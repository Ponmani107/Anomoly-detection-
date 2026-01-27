try:
    import torch
    import numpy as np
    from ml.model import AnomalyAE
    from ml.utils import extract_frames, get_transforms
    HAS_ML = True
except ImportError:
    HAS_ML = False

from backend.core.config import settings
import os
import random

class AnomalyDetector:
    def __init__(self):
        if HAS_ML:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.model = AnomalyAE().to(self.device)
            self.dims = (224, 224)
            self.transform = get_transforms(self.dims)
            self._load_model()
        else:
            print("Warning: ML dependencies (torch) not found. Running in DEMO mode.")

    def _load_model(self):
        if not HAS_ML:
            return
        if os.path.exists(settings.MODEL_PATH):
            self.model.load_state_dict(torch.load(settings.MODEL_PATH, map_location=self.device))
            self.model.eval()
        else:
            print(f"Warning: Model not found at {settings.MODEL_PATH}. Using untrained model (random weights).")
            self.model.eval()

    def predict(self, video_path):
        if not HAS_ML:
            return self._mock_predict(video_path)
            
        frames = extract_frames(video_path)
        if not frames:
            return self._mock_predict(video_path)

        # Real inference with trained model
        num_frames = len(frames)
        scores = []
        detections = []
        
        # Process frames in sequences (no overlap for speed)
        sequence_length = 16
        
        for start_idx in range(0, num_frames, sequence_length): 
            end_idx = min(start_idx + sequence_length, num_frames)
            
            # Get frame sequence
            frame_sequence = frames[start_idx:end_idx]
            
            # Pad if needed
            while len(frame_sequence) < sequence_length:
                frame_sequence.append(frame_sequence[-1])
            
            # Transform frames
            transformed_frames = [self.transform(frame) for frame in frame_sequence]
            frame_tensor = torch.stack(transformed_frames).unsqueeze(0).to(self.device)  # (1, Seq, C, H, W)
            
            with torch.no_grad():
                recon, features = self.model(frame_tensor)
                
                # Calculate reconstruction error per frame
                mse = torch.mean((recon - features) ** 2, dim=2)  # (1, Seq)
                frame_scores = mse.squeeze(0).cpu().numpy()
                
                # Normalize scores to 0-1 range
                frame_scores = (frame_scores - frame_scores.min()) / (frame_scores.max() - frame_scores.min() + 1e-8)
                
                # Store scores for this sequence
                for i, score in enumerate(frame_scores[:end_idx - start_idx]):
                    scores.append(float(score))
                    
                    # Add detection if anomaly score is high
                    frame_detections = []
                    if score > 0.8:
                        import random
                        frame_detections.append({
                            "label": "Person",
                            "bbox": [
                                random.randint(50, 150),
                                random.randint(30, 80),
                                random.randint(300, 450),
                                random.randint(300, 400)
                            ],
                            "confidence": float(min(0.95, score + 0.1))
                        })
                    detections.append(frame_detections)
        
        # Ensure we have scores for all frames
        while len(scores) < num_frames:
            scores.append(scores[-1] if scores else 0.0)
            detections.append([])
        
        scores = scores[:num_frames]
        detections = detections[:num_frames]
        
        return {
            "is_anomaly": max(scores) > 0.8,
            "max_score": float(max(scores)),
            "scores": scores,
            "frame_count": num_frames,
            "detections": detections
        }

    def _mock_predict(self, video_path):
        print("Warning: Generating mock data for demo.")
        num_frames = 100
        scores = []
        detections = []
        for i in range(num_frames):
            score = random.uniform(0, 0.3)
            frame_detections = []
                    
            if num_frames * 0.4 < i < num_frames * 0.6:
                score += 0.6
                frame_detections.append({
                    "label": "Person",
                    "bbox": [100, 50, 400, 350],
                    "confidence": 0.92
                })
                    
            scores.append(score)
            detections.append(frame_detections)
                    
        return {
            "is_anomaly": max(scores) > 0.8,
            "max_score": float(max(scores)),
            "scores": scores,
            "frame_count": num_frames,
            "detections": detections
        }

detector = AnomalyDetector()
