import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import os
import cv2
from PIL import Image
import numpy as np
from ml.model import AnomalyAE
from ml.utils import get_transforms, extract_frames
from backend.core.config import settings
from pathlib import Path

class VideoDataset(Dataset):
    """Dataset for loading video sequences for anomaly detection training."""
    def __init__(self, root_dir, transform=None, sequence_length=16):
        self.root_dir = Path(root_dir)
        self.transform = transform
        self.sequence_length = sequence_length
        self.video_paths = []
        
        if self.root_dir.exists():
            self.video_paths = list(self.root_dir.glob('*.mp4')) + \
                             list(self.root_dir.glob('*.avi')) + \
                             list(self.root_dir.glob('*.mov'))
        
        print(f"Found {len(self.video_paths)} training videos in {root_dir}")

    def __len__(self):
        return len(self.video_paths)

    def __getitem__(self, idx):
        video_path = self.video_paths[idx]
        frames = self._extract_sequence(video_path)
        
        if self.transform:
            frames = [self.transform(frame) for frame in frames]
        
        # Stack frames: (Sequence, C, H, W)
        frames_tensor = torch.stack(frames)
        return frames_tensor
    
    def _extract_sequence(self, video_path):
        """Extract a sequence of frames from video."""
        cap = cv2.VideoCapture(str(video_path))
        frames = []
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Sample frames uniformly across the video
        indices = np.linspace(0, frame_count - 1, self.sequence_length, dtype=int)
        
        for i in indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if ret:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(Image.fromarray(frame_rgb))
            else:
                # If frame read fails, duplicate last frame
                frames.append(frames[-1] if frames else Image.new('RGB', (224, 224)))
        
        cap.release()
        return frames

def train_model(data_dir, epochs=50, batch_size=2, learning_rate=1e-4, val_split=0.2):
    """Train the anomaly detection autoencoder model.
    
    Args:
        data_dir: Directory containing normal training videos
        epochs: Number of training epochs
        batch_size: Batch size for training
        learning_rate: Learning rate for optimizer
        val_split: Validation split ratio
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n=== Training Anomaly Detection Model ===")
    print(f"Device: {device}")
    print(f"Epochs: {epochs}")
    print(f"Batch Size: {batch_size}")
    print(f"Learning Rate: {learning_rate}\n")

    # Initialize model
    model = AnomalyAE().to(device)
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    criterion = nn.MSELoss()
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5)

    # Load dataset
    dataset = VideoDataset(data_dir, transform=get_transforms())
    
    if len(dataset) == 0:
        print("\n⚠️  WARNING: No training videos found!")
        print(f"Please add normal surveillance videos to: {data_dir}")
        print("\nFor demo purposes, creating a mock trained model...\n")
        
        # Save a mock model for demo
        os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
        torch.save(model.state_dict(), settings.MODEL_PATH)
        print(f"✓ Mock model saved to {settings.MODEL_PATH}")
        return
    
    # Train/Val split
    val_size = int(len(dataset) * val_split)
    train_size = len(dataset) - val_size
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0) if val_size > 0 else None
    
    print(f"Training samples: {train_size}")
    print(f"Validation samples: {val_size}\n")

    best_val_loss = float('inf')
    
    for epoch in range(epochs):
        # Training phase
        model.train()
        train_loss = 0.0
        
        for batch_idx, inputs in enumerate(train_loader):
            inputs = inputs.to(device)  # Shape: (B, Seq, C, H, W)
            
            optimizer.zero_grad()
            recon, features = model(inputs)
            
            # Loss: Reconstruction of ResNet features
            loss = criterion(recon, features)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            
            if (batch_idx + 1) % 5 == 0:
                print(f"Epoch [{epoch+1}/{epochs}] Batch [{batch_idx+1}/{len(train_loader)}] Loss: {loss.item():.4f}")
        
        avg_train_loss = train_loss / len(train_loader)
        
        # Validation phase
        if val_loader:
            model.eval()
            val_loss = 0.0
            
            with torch.no_grad():
                for inputs in val_loader:
                    inputs = inputs.to(device)
                    recon, features = model(inputs)
                    loss = criterion(recon, features)
                    val_loss += loss.item()
            
            avg_val_loss = val_loss / len(val_loader)
            scheduler.step(avg_val_loss)
            
            print(f"\nEpoch [{epoch+1}/{epochs}] - Train Loss: {avg_train_loss:.4f}, Val Loss: {avg_val_loss:.4f}")
            
            # Save best model
            if avg_val_loss < best_val_loss:
                best_val_loss = avg_val_loss
                os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
                torch.save(model.state_dict(), settings.MODEL_PATH)
                print(f"✓ Best model saved (Val Loss: {best_val_loss:.4f})\n")
        else:
            print(f"\nEpoch [{epoch+1}/{epochs}] - Train Loss: {avg_train_loss:.4f}\n")
            # Save model every 10 epochs if no validation
            if (epoch + 1) % 10 == 0:
                os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
                torch.save(model.state_dict(), settings.MODEL_PATH)
                print(f"✓ Model checkpoint saved\n")

    # Save final model
    os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
    torch.save(model.state_dict(), settings.MODEL_PATH)
    print(f"\n✓ Training complete! Model saved to {settings.MODEL_PATH}")
    print(f"\nTo use the trained model, restart the backend server.\n")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train Anomaly Detection Model')
    parser.add_argument('--data_dir', type=str, default='data/train', help='Directory containing training videos')
    parser.add_argument('--epochs', type=int, default=50, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=2, help='Batch size')
    parser.add_argument('--lr', type=float, default=1e-4, help='Learning rate')
    
    args = parser.parse_args()
    
    train_model(args.data_dir, args.epochs, args.batch_size, args.lr)
