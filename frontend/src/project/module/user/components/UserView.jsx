import React from 'react';
import { Spin, Modal, Avatar, Badge } from 'antd';
import { RiContactsLine, RiMapPinLine, RiPhoneLine, RiMailLine, RiUser3Line, RiVipCrownLine, RiTimeLine } from 'react-icons/ri';

const UserView = ({ user, roleMap, isLoading, visible, onClose }) => {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        const date = new Date(timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const modalTitle = (
        <div className="modal-header">
            <div className="modal-header-title">
                <RiContactsLine /> User Details
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <Modal
                title={modalTitle}
                open={visible}
                onCancel={onClose}
                footer={null}
                width={700}
                className="common-modal modern-modal"
                maskClosable={true}
                centered
            >
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            </Modal>
        );
    }

    if (!user) {
        return (
            <Modal
                title={modalTitle}
                open={visible}
                onCancel={onClose}
                footer={null}
                width={700}
                className="common-modal modern-modal"
                maskClosable={true}
                centered
            >
                <div className="error-container">
                    User not found
                </div>
            </Modal>
        );
    }

    const roleName = roleMap[user.role_id] || 'N/A';

    const formatAddress = () => {
        const parts = [];
        if (user.address) parts.push(user.address);

        const cityState = [];
        if (user.city) cityState.push(user.city);
        if (user.state) cityState.push(user.state);

        if (cityState.length > 0) {
            parts.push(cityState.join(', '));
        }

        if (user.country) {
            parts.push(user.country);
        }

        if (user.zip_code) {
            parts.push(user.zip_code);
        }

        return parts.join(', ') || 'N/A';
    };

    const getInitials = () => {
        const firstInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
        const lastInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial || user.username.charAt(0).toUpperCase();
    };

    return (
        <Modal
            title={modalTitle}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            className="common-modal modern-modal"
            maskClosable={true}
            centered
        >
            <div className="modern-view modern-modal-view">
                <div className="header">
                    <div className="avatar-container">
                        <Avatar
                            size={80}
                            className="avatar"
                        >
                            {getInitials()}
                        </Avatar>
                        <Badge
                            status={user.is_active ? "success" : "error"}
                            className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}
                        />
                    </div>

                    <div className="basic-info">
                        <h2 className="name">
                            {user.first_name && user.last_name ?
                                `${user.first_name} ${user.last_name}` :
                                user.username
                            }
                        </h2>
                        <div className="badge-container">
                            <div className="badge">
                                <RiVipCrownLine className="icon" />
                                <span className="text">{roleName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="details-container">
                    <div className="detail-item">
                        <div className="detail-icon">
                            <RiUser3Line />
                        </div>
                        <div className="detail-content">
                            <div className="detail-label">Username</div>
                            <div className="detail-value">{user.username}</div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <div className="detail-icon">
                            <RiMailLine />
                        </div>
                        <div className="detail-content">
                            <div className="detail-label">Email</div>
                            <div className="detail-value">{user.email}</div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <div className="detail-icon">
                            <RiPhoneLine />
                        </div>
                        <div className="detail-content">
                            <div className="detail-label">Phone</div>
                            <div className="detail-value">{user.phone || 'N/A'}</div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <div className="detail-icon">
                            <RiMapPinLine />
                        </div>
                        <div className="detail-content">
                            <div className="detail-label">Address</div>
                            <div className="detail-value">{formatAddress()}</div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <div className="detail-icon">
                            <RiTimeLine />
                        </div>
                        <div className="detail-content">
                            <div className="detail-label">Created At</div>
                            <div className="detail-value">{formatDate(user.createdAt)}</div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <div className="detail-icon">
                            <RiTimeLine />
                        </div>
                        <div className="detail-content">
                            <div className="detail-label">Last Updated</div>
                            <div className="detail-value">{formatDate(user.updatedAt || user.createdAt)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserView;