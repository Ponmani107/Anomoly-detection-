# Anomaly Detection in Surveillance Videos

A professional web application to identify unusual activities in surveillance footage using specialized Deep Learning models.

## Features
- **Video Upload**: fast and secure upload of CCTV footage.
- **Anomaly Detection**: Unsupervised learning model to flag irregularities.
- **Interactive Dashboard**: Visualize anomaly scores over time.

## Quick Start

### Backend
1. Initialize environment:
   ```bash
   py -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Start server:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- **Backend**: FastAPI, PyTorch, OpenCV
- **Frontend**: React, Tailwind CSS, Framer Motion

