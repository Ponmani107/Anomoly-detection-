# Anomaly Detection in Surveillance Videos

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![PyTorch](https://img.shields.io/badge/ML-PyTorch-EE4C2C.svg?style=flat&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional end-to-end web application designed to identify unusual or anomalous activities in CCTV/surveillance footage. Utilizes Deep Learning (Unsupervised Autoencoders) to detect deviations from normal patterns in real-time or uploaded video files.

---

##  Key Features

- **🚀 Real-time Processing**: Fast analysis of surveillance footage using optimized ML pipelines.
- **📁 Smart Video Upload**: Support for MP4, AVI, and MOV formats with automatic processing.
- **🧠 Deep Learning Engine**: Powered by an Unsupervised Autoencoder model trained on normal activity patterns.
- **📊 Interactive Dashboard**: High-fidelity visualization of anomaly scores across the video timeline.
- **🔔 Intelligent Alerts**: Visual indicators and logs for detected unusual activities.
- **🎥 Live Feed Simulation**: Monitor multiple camera feeds simultaneously via a sleek dashboard interface.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (High-end custom UI)

### **Backend**
- **API Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Vision**: [OpenCV](https://opencv.org/)
- **Data Science**: [NumPy](https://numpy.org/), [Scikit-learn](https://scikit-learn.org/)

### **Machine Learning**
- **Library**: [PyTorch](https://pytorch.org/) & [Torchvision](https://pytorch.org/vision/)
- **Architecture**: Spatio-Temporal Autoencoder for anomaly detection.

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Python 3.10+
- Node.js 18+
- npm or yarn

### **1. Clone the Repository**
```bash
git clone https://github.com/Ponmani107/Anomoly-detection-.git
cd Anomoly-detection-
```

### **2. Backend Configuration**
```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### **3. Frontend Configuration**
```bash
cd frontend
npm install
```

---

## 🚀 Running the Project

To run the full application, open two separate terminals:

### **Terminal 1: Backend Server**
```powershell
# Navigate to root directory
.\venv\Scripts\python.exe -m uvicorn backend.main:app --port 8001 --reload
```
*API will be available at: http://localhost:8001*

### **Terminal 2: Frontend Client**
```powershell
cd frontend
npm run dev
```
*Web app will be available at: http://localhost:5173*

---

## 📂 Project Structure

```text
Anomoly-detection-/
├── backend/            # FastAPI source code
├── frontend/           # React + Vite application
├── ml/                 # PyTorch model, trainer, & inference logic
│   └── saved_models/   # Stored .pth model files (Ignored in Git)
├── uploads/            # Temporary directory for uploaded videos
├── requirements.txt    # Python dependencies
└── package.json        # Node.js dependencies
```

---

## 🔍 How It Works

This system leverages **Unsupervised Deep Learning** to ensure security without human bias.

### **1. Data Processing Pipeline**
When a video is uploaded or a camera feed is connected:
- **Preprocessing**: The system uses **OpenCV** to extract frames at a specific rate.
- **Normalization**: Frames are resized to 224x224 and normalized to ensure consistent lighting/contrast for the AI.

### **2. The AI Mechanism (Autoencoder)**
Traditional CCTV AI looks for specific objects (like guns). This system is smarter—it looks for **unusual behavior**:
- **Normality Learning**: During training, the model only watches "safe" footage. It creates a mathematical blueprint of what normal walking and standing looks like.
- **Reconstruction Analysis**: During monitoring, the AI tries to "re-draw" the current frame. 
    - If it can re-draw it easily, the activity is **Normal**.
    - If it fails (High Reconstruction Error), it means the AI is seeing something it wasn't trained for—an **Anomaly**.

### **3. Scoring & Thresholding**
- The system generates an **Anomaly Score (0.0 to 1.0)** for every second of footage.
- If the score crosses **0.8**, the system triggers a **Visual Alert** on the dashboard, flagging the timestamp for security review.

---

## 🏗️ System Architecture

1. **Frontend (React)**: High-performance UI that renders the video player and a real-time synchronized line chart.
2. **Backend (FastAPI)**: A high-concurrency Python server that handles file uploads and manages the ML pipeline.
3. **ML Layer (PyTorch)**: The "Inference Engine" that loads the trained `.pth` weights and performs GPU/CPU accelerated computations.

---

## 🧠 Model Information

The core detection engine uses an **Unsupervised Autoencoder**. 
- **Training**: The model is trained on "normal" surveillance footage to learn standard movement patterns.
- **Inference**: During testing, the model attempts to reconstruct input frames. A high reconstruction error (MSE) indicates an **anomaly** (something the model hasn't seen before, like a fight, sudden running, or restricted area crossing).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Developed with ❤️ for Advanced Surveillance Analytics.**
