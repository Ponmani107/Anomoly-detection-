import React from 'react';
import { ShieldAlert, ShieldCheck, Clock, MapPin } from 'lucide-react';

const RecentAlerts = ({ alerts = [] }) => {
  // Sample data for demonstration
  const sampleAlerts = [
    {
      id: 1,
      camera: 'CAM-001',
      location: 'Main Entrance',
      timestamp: '2 minutes ago',
      severity: 'high',
      description: 'Unusual movement detected near main entrance',
      status: 'active'
    },
    {
      id: 2,
      camera: 'CAM-003',
      location: 'Parking Lot',
      timestamp: '15 minutes ago',
      severity: 'medium',
      description: 'Vehicle parked in restricted area',
      status: 'resolved'
    },
    {
      id: 3,
      camera: 'CAM-005',
      location: 'Warehouse',
      timestamp: '45 minutes ago',
      severity: 'high',
      description: 'Unauthorized personnel in restricted zone',
      status: 'active'
    },
    {
      id: 4,
      camera: 'CAM-007',
      location: 'Back Office',
      timestamp: '2 hours ago',
      severity: 'low',
      description: 'Motion detected after hours',
      status: 'resolved'
    }
  ];

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'high': return 'alert-icon-high';
      case 'medium': return 'alert-icon-medium';
      case 'low': return 'alert-icon-low';
      default: return 'alert-icon-default';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? 
      <ShieldAlert size={18} /> : 
      <ShieldCheck size={18} />;
  };

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <div className="flex items-center justify-between">
          <h2 className="alerts-title">Recent Alerts</h2>
          <div className="alerts-filters">
            <button className="filter-button active">
              Active
            </button>
            <button className="filter-button">
              All
            </button>
          </div>
        </div>
      </div>

      <div className="alerts-content">
        <div className="alerts-list">
          {(alerts.length > 0 ? alerts : sampleAlerts).map((alert, index) => (
            <div 
              key={alert.id} 
              className="alert-item stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`alert-icon-container ${getSeverityClass(alert.severity)}`}>
                {getStatusIcon(alert.status)}
              </div>
              
              <div className="alert-content">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="alert-title-text">{alert.description}</h3>
                  <span className={`alert-status alert-status-${alert.status}`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </div>
                
                <div className="alert-meta">
                  <div className="alert-location">
                    <MapPin size={12} className="alert-meta-icon" />
                    <span>{alert.location}</span>
                  </div>
                  <div className="alert-time">
                    <Clock size={12} className="alert-meta-icon" />
                    <span>{alert.timestamp}</span>
                  </div>
                  <span className="alert-camera-tag">
                    {alert.camera}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="view-all-button">
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default RecentAlerts;