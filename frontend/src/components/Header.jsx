import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    return (
        <header className="header">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="lg-hidden" style={{color: '#64748b'}}>
                    <Menu size={20} />
                </button>
                <div className="header-search">
                    <input
                        type="text"
                        placeholder="Search analysis..."
                        className="search-input"
                    />
                    <Search className="search-icon" size={18} />
                </div>
            </div>

            <div className="header-actions">
                <button className="action-button">
                    <Bell size={20} />
                    <span className="notification-badge"></span>
                </button>
                <div className="divider"></div>
                <div className="user-profile">
                    <div className="user-info">
                        <p className="user-name">John Doe</p>
                        <p className="user-role">Admin Account</p>
                    </div>
                    <div className="user-avatar">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
