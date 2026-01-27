import React, { useState } from 'react';
import { Camera, ShieldAlert, ShieldCheck, Wifi, WifiOff, Play } from 'lucide-react';

const CameraFeed = ({ camera, onViewClick }) => {
  const [isConnected, setIsConnected] = useState(true);
  
  // Get current timestamp for surveillance overlay
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');
  };
  
  return (
    <div className="camera-card">
      <div className="camera-header">
        <div className="camera-name">
          <Camera size={14} className="camera-icon" />
          {camera.name}
        </div>
        
        <div className="camera-icons">
          {isConnected ? (
            <Wifi size={14} style={{ color: '#10b981' }} />
          ) : (
            <WifiOff size={14} style={{ color: '#ef4444' }} />
          )}
          
          <div className={`camera-status-indicator ${
            camera.status === 'anomaly' ? 'camera-status-anomaly' : 'camera-status-normal'
          }`}></div>
        </div>
      </div>
      
      <div className="camera-image-container">
        {camera.videoUrl ? (
          <video 
            src={camera.videoUrl} 
            className="camera-image"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img 
            src={camera.thumbnail || `https://picsum.photos/seed/${camera.id}/400/300`} 
            alt={camera.name}
            className="camera-image"
          />
        )}
        
        {/* Professional timestamp overlay */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#00ff00',
          fontFamily: 'monospace',
          fontSize: '8px',
          fontWeight: 'bold',
          padding: '3px 6px',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          letterSpacing: '0.5px',
          zIndex: 5
        }}>
          ● REC {getTimestamp()}
        </div>
        
        {camera.status === 'anomaly' && (
          <div className="camera-overlay">
            <div className="camera-alert">
              <ShieldAlert size={16} />
              ANOMALY DETECTED
            </div>
          </div>
        )}
        
        <div className="camera-location">
          {camera.location}
        </div>
      </div>
      
      <div className="camera-footer">
        <span className="camera-meta">
          Last scan: {camera.lastScan}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {camera.filename && onViewClick && (
            <button
              onClick={() => onViewClick(camera.filename)}
              style={{
                fontSize: '0.7rem',
                padding: '3px 8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.4)';
              }}
            >
              <Play size={10} />
              Analyze
            </button>
          )}
          <span className={`camera-status-badge ${
            camera.status === 'normal' 
              ? 'camera-status-badge-normal' 
              : 'camera-status-badge-anomaly'
          }`}>
            {camera.status === 'normal' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            {camera.status.charAt(0).toUpperCase() + camera.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;