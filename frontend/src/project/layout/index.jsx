import React, { useState, useEffect } from 'react';
import { Layout, Drawer } from 'antd';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './header';
import DashboardSidebar from './sidebar';
import DashboardFooter from './footer';
import './styles.scss';

const { Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

    // Detect screen size changes
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
            if (window.innerWidth <= 1024) {
                setCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Toggle sidebar for mobile devices
    const toggleMobileMenu = () => {
        if (isMobile) {
            setMobileDrawerVisible(!mobileDrawerVisible);
        } else {
            setCollapsed(!collapsed);
        }
    };

    // Close mobile drawer
    const closeMobileDrawer = () => {
        setMobileDrawerVisible(false);
    };

    return (
        <Layout className="dashboard-layout">
            {/* Desktop Sidebar */}
            {!isMobile && <DashboardSidebar collapsed={collapsed} />}

            {/* Mobile Sidebar Drawer */}
            {isMobile && (
                <Drawer
                    placement="left"
                    closable={false}
                    onClose={closeMobileDrawer}
                    open={mobileDrawerVisible}
                    width={256}
                    bodyStyle={{ padding: 0 }}
                    className="mobile-sidebar-drawer"
                >
                    <DashboardSidebar
                        collapsed={false}
                        isMobile={true}
                        onBackClick={closeMobileDrawer}
                    />
                </Drawer>
            )}

            <Layout
                className={`dashboard-layout-main ${!collapsed && !isMobile ? 'expanded' : ''}`}
            >
                <DashboardHeader
                    collapsed={collapsed}
                    setCollapsed={toggleMobileMenu}
                    isMobile={isMobile}
                />

                <div className="dashboard-content-wrapper">
                    <Content className="dashboard-layout-content">
                        <Outlet />
                    </Content>
                </div>

                <DashboardFooter />
            </Layout>
        </Layout>
    );
};

export default DashboardLayout; 