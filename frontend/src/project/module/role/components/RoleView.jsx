import React from 'react';
import { Modal, Spin, Avatar } from 'antd';
import { RiShieldUserLine, RiTimeLine, RiFileListLine } from 'react-icons/ri';

const RoleView = ({ role, isLoading, visible, onClose }) => {

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        const date = new Date(timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getInitials = () => {
        if (!role || !role.role_name) return 'R';

        const nameParts = role.role_name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return role.role_name[0].toUpperCase();
    };

    const modalTitle = (
        <div className="modal-header">
            <div className="modal-header-title">
                <RiShieldUserLine /> Role Details
            </div>
        </div>
    );

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
            {isLoading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : role ? (
                <div className="modern-view modern-modal-view">
                    <div className="header">
                        <div className="avatar-container">
                            <Avatar
                                size={80}
                                className="avatar"
                            >
                                {getInitials()}
                            </Avatar>
                        </div>

                        <div className="basic-info">
                            <h2 className="name">
                                {role.role_name || 'Unnamed Role'}
                            </h2>
                        </div>
                    </div>

                    <div className="details-container">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <RiFileListLine />
                            </div>
                            <div className="detail-content">
                                <div className="detail-label">Permissions</div>
                                <div className="detail-value">
                                    <pre className="permissions-json">
                                        {role.permissions ? JSON.stringify(role.permissions, null, 2) : 'No permissions defined'}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <RiTimeLine />
                            </div>
                            <div className="detail-content">
                                <div className="detail-label">Created At</div>
                                <div className="detail-value">{formatDate(role?.createdAt)}</div>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <RiTimeLine />
                            </div>
                            <div className="detail-content">
                                <div className="detail-label">Last Updated</div>
                                <div className="detail-value">{formatDate(role?.updatedAt || role?.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="error-container">
                    Role not found
                </div>
            )}
        </Modal>
    );
};

export default RoleView; 