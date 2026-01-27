# Anomaly Detection Model Training Guide

## Overview
This guide explains how to train the anomaly detection model for accurate CCTV surveillance analysis.

## Training Approach
The system uses an **Autoencoder-based Anomaly Detection** approach:
- **Training**: Model learns to reconstruct NORMAL surveillance footage
- **Inference**: High reconstruction error = Anomaly detected
- **Detection**: Objects with high anomaly scores are marked with red bounding boxes

## Prerequisites

### 1. Prepare Training Data
Create a directory with **normal surveillance videos only**:

```
data/
└── train/
    ├── normal_video_1.mp4
    ├── normal_video_2.mp4
    ├── normal_video_3.mp4
    └── ... (more normal videos)
```

**Important**: 
- Use videos of **normal, non-anomalous** activity
- Minimum 20-50 videos recommended
- Videos should represent typical surveillance scenarios
- MP4, AVI, or MOV formats supported

### 2. Install Dependencies
Ensure PyTorch is installed with CUDA support (if using GPU):

```bash
pip install torch torchvision
```

## Training the Model

### Quick Start
From the project root directory:

```bash
python -m ml.trainer --data_dir data/train --epochs 50 --batch_size 2
```

### Training Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--data_dir` | Path to training videos directory | `data/train` |
| `--epochs` | Number of training epochs | `50` |
| `--batch_size` | Batch size (reduce if out of memory) | `2` |
| `--lr` | Learning rate | `1e-4` |

### Example Commands

**Basic Training (CPU):**
```bash
python -m ml.trainer --data_dir data/train
```

**Extended Training (GPU):**
```bash
python -m ml.trainer --data_dir data/train --epochs 100 --batch_size 4
```

**Quick Test Training:**
```bash
python -m ml.trainer --data_dir data/train --epochs 10 --batch_size 1
```

## Training Process

The training script will:
1. Load all videos from the specified directory
2. Extract frame sequences from each video
3. Train the autoencoder to reconstruct normal patterns
4. Save the best model based on validation loss
5. Store the trained model at: `ml/saved_models/autoencoder.pth`

### Expected Output:
```
=== Training Anomaly Detection Model ===
Device: cuda
Epochs: 50
Batch Size: 2
Learning Rate: 0.0001

Found 25 training videos in data/train
Training samples: 20
Validation samples: 5

Epoch [1/50] Batch [1/10] Loss: 0.8234
Epoch [1/50] Batch [5/10] Loss: 0.7123
...
Epoch [1/50] - Train Loss: 0.6543, Val Loss: 0.7012
✓ Best model saved (Val Loss: 0.7012)
```

## Using the Trained Model

After training completes:

1. **Restart the Backend Server:**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8001
   ```

2. **Upload Videos:**
   - Go to the frontend dashboard
   - Upload surveillance footage
   - The trained model will now provide accurate anomaly detection

## Model Architecture

```
Input Video → Frame Extraction → ResNet50 Encoder → Bottleneck (512) 
           ↓
    Anomaly Score ← MSE Loss ← LSTM Decoder ← Bottleneck
```

## Tips for Best Results

### Data Quality
- **Quantity**: More training videos = better accuracy (aim for 50+)
- **Diversity**: Include various lighting, angles, times of day
- **Consistency**: All videos should be from similar camera setups
- **Duration**: 30-60 second clips work well

### Training Parameters
- **Small Dataset (<20 videos)**: Use `--epochs 30 --batch_size 1`
- **Medium Dataset (20-50 videos)**: Use `--epochs 50 --batch_size 2`
- **Large Dataset (50+ videos)**: Use `--epochs 100 --batch_size 4`

### Hardware Recommendations
- **CPU**: Works but slow (1-3 hours for 50 epochs)
- **GPU**: Recommended (10-30 minutes for 50 epochs)
- **RAM**: Minimum 8GB recommended

## Troubleshooting

### Out of Memory Error
```bash
python -m ml.trainer --batch_size 1
```

### No Training Data Found
Ensure videos are in the correct directory:
```bash
ls data/train/  # Should show .mp4/.avi/.mov files
```

### Model Not Loading
Check that the model file exists:
```bash
ls ml/saved_models/autoencoder.pth
```

## Advanced: Monitoring Training

To monitor GPU usage during training:
```bash
# Terminal 1: Start training
python -m ml.trainer --data_dir data/train

# Terminal 2: Monitor GPU
watch -n 1 nvidia-smi
```

## Next Steps

After training:
1. Test the model with various surveillance videos
2. Fine-tune by adjusting epochs and learning rate
3. Re-train if anomaly detection accuracy is low
4. Consider adding more diverse training data

## Support

For issues or questions about training:
- Check the training logs for error messages
- Ensure training data meets requirements
- Try reducing batch size if encountering memory errors





