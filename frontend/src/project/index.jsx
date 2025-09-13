import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { selectCurrentUser, selectIsLogin, selectUserRole } from '../auth/services/authSlice';
import { useGetRoleQuery } from '../auth/services/authApi';
import './dashboard.scss';
import {
    UserOutlined,
    TeamOutlined,
    ShopOutlined,
    FileTextOutlined,
    RiseOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const Dashboard = () => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const isLoggedIn = useSelector(selectIsLogin);
    const userRole = useSelector(selectUserRole);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const skipRoleQuery = useMemo(() => {
        return !user?.role_id || !!userRole;
    }, [user?.role_id, userRole]);

    const { isLoading: isRoleLoading } = useGetRoleQuery(
        user?.role_id,
        {
            skip: skipRoleQuery,
            refetchOnMountOrArgChange: true
        }
    );

    const checkAuth = useMemo(() => {
        return () => {
            if (!isLoggedIn) {
                navigate('/login', { replace: true });
            }
        };
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getColSpan = () => {
        if (windowWidth < 576) return 24;
        if (windowWidth < 992) return 12;
        return 8;
    };

    // Get appropriate class for conversion rate card based on screen size
    const getConversionCardClass = () => {
        return windowWidth < 768 ? 'stats-card full-width' : 'stats-card';
    };

    if (!user) {
        return null;
    }

    return (
        <motion.div
            className="dashboard-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={itemVariants}
            >
                <Title level={2} className="dashboard-welcome-title">
                    {getGreeting()}, {user?.username || 'User'}!
                </Title>
                <Title level={4} className="dashboard-subtitle">
                    {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </Title>
            </motion.div>

            <div className="stats-cards-container">
                <motion.div className="stats-card" variants={itemVariants}>
                    <div className="icon-wrapper">
                        <UserOutlined style={{ fontSize: 24 }} />
                    </div>
                    <div className="content">
                        <div className="title">TOTAL USERS</div>
                        <div className="value">125</div>
                        <div className="sub-text">Active this month</div>
                    </div>
                </motion.div>

                <motion.div className="stats-card" variants={itemVariants}>
                    <div className="icon-wrapper">
                        <TeamOutlined style={{ fontSize: 24 }} />
                    </div>
                    <div className="content">
                        <div className="title">TOTAL LEADS</div>
                        <div className="value">87</div>
                        <div className="sub-text">10 new this week</div>
                    </div>
                </motion.div>

                <motion.div className="stats-card" variants={itemVariants}>
                    <div className="icon-wrapper">
                        <ShopOutlined style={{ fontSize: 24 }} />
                    </div>
                    <div className="content">
                        <div className="title">TOTAL SALES</div>
                        <div className="value">32</div>
                        <div className="sub-text">₹32,500 revenue</div>
                    </div>
                </motion.div>

                <motion.div className={getConversionCardClass()} variants={itemVariants}>
                    <div className="icon-wrapper">
                        <RiseOutlined style={{ fontSize: 24 }} />
                    </div>
                    <div className="content">
                        <div className="title">CONVERSION RATE</div>
                        <div className="value">24%</div>
                        <div className="sub-text">+2.5% from last month</div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard; 