import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, activeView, setActiveView }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                activeView={activeView}
                setActiveView={setActiveView}
            />

            <div className={`main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
                <Header toggleSidebar={toggleSidebar} />

                <main className="main-content-area">
                    <div className="container-max">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
