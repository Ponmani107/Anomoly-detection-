import React from 'react';
import { LayoutDashboard, History, Settings, ShieldAlert, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, activeView, setActiveView }) => {
    const menuItems = [
        { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { id: 'anomalies', icon: <ShieldAlert size={20} />, label: 'Anomalies' },
        { id: 'history', icon: <History size={20} />, label: 'History' },
        { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            {/* Logo Section */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <ShieldAlert size={20} className="text-white" />
                </div>
                {isOpen && <span className="sidebar-logo-text">Sentinel AI</span>}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                    >
                        {item.icon}
                        {isOpen && <span className="sidebar-link-text">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="sidebar-footer">
                <button className="sidebar-link">
                    <LogOut size={20} />
                    {isOpen && <span className="sidebar-link-text">Logout</span>}
                </button>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="sidebar-toggle"
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
        </div>
    );
};

export default Sidebar;
