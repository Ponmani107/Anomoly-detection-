import cv2
import numpy as np
import torch
from torchvision import transforms
from PIL import Image

def get_transforms(img_size=(224, 224)):
    return transforms.Compose([
        transforms.Resize(img_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

def extract_frames(video_path, max_frames=48):
    """
    Extract frames from video for model input.
    Samples at most 48 frames for ultra-fast inference.
    """
    cap = cv2.VideoCapture(str(video_path))
    frames = []
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total_frames <= 0:
        return []
        
    # Calculate step to get at most max_frames
    step = max(1, total_frames // max_frames)
    
    for i in range(0, total_frames, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret:
            break
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frames.append(Image.fromarray(frame_rgb))
        
        if len(frames) >= max_frames:
            break
            
    cap.release()
    return frames
