import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AnalysisViewer from './components/AnalysisViewer';
import DashboardLayout from './components/DashboardLayout';
import CameraFeed from './components/CameraFeed';
import RecentAlerts from './components/RecentAlerts';
import { Upload, Video, X, FileVideo, ShieldAlert, Zap, BarChart3, Clock, Grid3X3, Bell, Activity } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [currentFile, setCurrentFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUploadedVideos();
  }, []);

  const fetchUploadedVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/videos');
      setUploadedVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const handleUploadComplete = (filename) => {
    setCurrentFile(filename);
    setUploading(false);
    fetchUploadedVideos(); // Refresh video list
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    if (file && (file.type.includes('video') || file.name.match(/\.(mp4|avi|mov)$/i))) {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8001/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setTimeout(() => {
          handleUploadComplete(response.data.filename);
        }, 800);

      } catch (err) {
        console.error(err);
        alert('Upload failed: ' + (err.response?.data?.detail || err.message));
        setUploading(false);
      }
    } else {
      alert('Please select a valid video file (.mp4, .avi, or .mov)');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'overview' ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Surveillance Analytics</h1>
            <p className="text-slate-500 mt-1">Monitor and detect anomalies in real-time camera feeds.</p>
          </div>

          <div className="grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Scans', value: '1,284', iconColor: 'blue', trend: '+12%', changeType: 'positive' },
              { label: 'Anomalies', value: '42', iconColor: 'red', trend: '-5%', changeType: 'negative' },
              { label: 'System Uptime', value: '99.9%', iconColor: 'amber', trend: 'Stable', changeType: 'neutral' },
              { label: 'Avg Speed', value: '120ms', iconColor: 'emerald', trend: '-20ms', changeType: 'positive' },
            ].map((stat, i) => {
              const icons = [BarChart3, ShieldAlert, Zap, Clock];
              const Icon = icons[i];
              return (
                <div key={i} className="dashboard-card stats-card stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex justify-between items-start">
                    <div className={`stat-icon-container stat-icon-${stat.iconColor}`}>
                      <Icon size={28} style={{ color: 'white' }} />
                    </div>
                    <span className={`trend-badge trend-${stat.changeType}`}>
                      {stat.changeType === 'positive' && '↗'}
                      {stat.changeType === 'negative' && '↘'}
                      {stat.trend}
                    </span>
                  </div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {currentFile ? (
            <div className="space-y-6">
              <div className="dashboard-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ padding: '16px' }}>
                <div className="flex items-center gap-4">
                  <div className="icon-container" style={{ width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Analysis</p>
                    <p className="text-base font-bold text-slate-900 line-clamp-1">{currentFile}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentFile(null)}
                  className="btn-primary"
                >
                  <X size={16} />
                  Reset
                </button>
              </div>

              <div className="dashboard-card" style={{ overflow: 'hidden', minHeight: '500px' }}>
                <AnalysisViewer filename={currentFile} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Live Camera Feeds and Alerts */}
              <div className="grid-cols-1 lg-grid-cols-3 gap-8">
                <div className="lg-col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Grid3X3 size={20} /> Live Camera Feeds
                    </h2>
                    <div className="flex gap-2">
                      <button className="filter-button">
                        All Cameras
                      </button>
                      
                      <button className="filter-button">
                        Anomalies Only
                      </button>
                    </div>
                  </div>

                  <div className="grid-cols-2 md-grid-cols-3 lg-grid-cols-4 gap-3">
                    {uploadedVideos.length > 0 ? (
                      uploadedVideos.slice(0, 8).map((video, index) => ({
                        id: index + 1,
                        name: `CAM-${String(index + 1).padStart(3, '0')}`,
                        location: ['Main Entrance', 'Parking Area', 'Perimeter', 'Warehouse'][index] || 'Unknown',
                        status: Math.random() > 0.7 ? 'anomaly' : 'normal',
                        lastScan: 'Just now',
                        videoUrl: video.url,
                        filename: video.filename
                      })).map((camera, index) => (
                        <div key={camera.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                          <CameraFeed
                            camera={camera}
                            onViewClick={handleUploadComplete}
                          />
                        </div>
                      ))
                    ) : (
                      [
                        { id: 1, name: 'CAM-001', location: 'Main Entrance', status: 'normal', lastScan: 'Just now' },
                        { id: 2, name: 'CAM-002', location: 'Parking Area', status: 'normal', lastScan: '2 min ago' },
                        { id: 3, name: 'CAM-003', location: 'Perimeter', status: 'anomaly', lastScan: 'Just now' },
                        { id: 4, name: 'CAM-004', location: 'Warehouse', status: 'normal', lastScan: '5 min ago' },
                        { id: 5, name: 'CAM-005', location: 'Loading Dock', status: 'normal', lastScan: '3 min ago' },
                        { id: 6, name: 'CAM-006', location: 'Rear Exit', status: 'normal', lastScan: '1 min ago' },
                        { id: 7, name: 'CAM-007', location: 'Lobby', status: 'normal', lastScan: 'Just now' },
                        { id: 8, name: 'CAM-008', location: 'Stairwell', status: 'normal', lastScan: '4 min ago' },
                      ].map(camera => (
                        <CameraFeed key={camera.id} camera={camera} />
                      ))
                    )}
                  </div>
                </div>

                <div className="lg-col-span-1">
                  <RecentAlerts />
                </div>
              </div>

              {/* Alternative Upload Option */}
              <div className="dashboard-card" style={{ padding: '48px' }}>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,.avi,.mov,video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div className="upload-icon" style={{ width: '80px', height: '80px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      {uploading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <Upload className="w-10 h-10 text-blue-600" />
                      )}
                    </div>

                    {uploading ? (
                      <div className="text-center" style={{ textAlign: 'center' }}>
                        <h3 className="text-xl font-bold text-slate-900" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Processing Video...</h3>
                        <p className="text-slate-500 mt-2" style={{ color: '#64748b', marginTop: '8px' }}>Uploading and initializing AI engine</p>
                      </div>
                    ) : (
                      <div className="text-center" style={{ textAlign: 'center' }}>
                        <h3 className="text-xl font-bold text-slate-900" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                          {isDragging ? 'Drop to start' : 'Upload Surveillance Footage'}
                        </h3>
                        <p className="text-slate-500 mt-2" style={{ color: '#64748b', marginTop: '8px' }}>
                          Drag and drop or click to browse files
                        </p>
                        <p className="text-slate-400 text-xs mt-4" style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '16px' }}>
                          Supports MP4, AVI, and MOV formats up to 500MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-64 glass-card">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} View</h2>
            <p className="text-slate-300">This section is currently under development.</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;