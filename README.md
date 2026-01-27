# 🛡️ Anomaly Detection in Surveillance Videos

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![PyTorch](https://img.shields.io/badge/ML-PyTorch-EE4C2C.svg?style=flat&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional end-to-end web application designed to identify unusual or anomalous activities in CCTV/surveillance footage. Utilizes Deep Learning (Unsupervised Autoencoders) to detect deviations from normal patterns in real-time or uploaded video files.

---

## ✨ Key Features

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

## 🧠 Model Information

The core detection engine uses an **Unsupervised Autoencoder**. 
- **Training**: The model is trained on "normal" surveillance footage to learn standard movement patterns.
- **Inference**: During testing, the model attempts to reconstruct input frames. A high reconstruction error (MSE) indicates an **anomaly** (something the model hasn't seen before, like a fight, sudden running, or restricted area crossing).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Developed with ❤️ for Advanced Surveillance Analytics.**
