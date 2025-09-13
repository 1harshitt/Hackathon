import React from 'react';
import { Card } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ModuleCard = ({
    title,
    avatar,
    infoItems = [],
    metaItems = [],
    onView,
    onEdit,
    onDelete,
    item,
    viewButtonText = "View Details",
    statusBadge,
    extraContent
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
            style={{ overflow: "visible" }}
        >
            <Card className="module-card" bordered={false}>
                <div className="module-card-header">
                    {avatar && <div className="module-card-avatar">{avatar}</div>}
                    <h3 className="module-card-title">{title}</h3>
                    {statusBadge && <div className="status-badge">{statusBadge}</div>}
                </div>

                <div className="module-card-content">
                    {infoItems.map((info, index) => (
                        <div key={`info-${index}`} className="module-card-info">
                            {info.icon && info.icon}
                            {info.label && <span className="info-label">{info.label}:</span>}
                            {info.badge ? (
                                <span className="badge">{info.content}</span>
                            ) : (
                                <span>{info.content}</span>
                            )}
                        </div>
                    ))}

                    {extraContent}
                </div>

                {metaItems.length > 0 && (
                    <div className="module-card-meta">
                        {metaItems.map((meta, index) => (
                            <div key={`meta-${index}`}>
                                {meta.icon && meta.icon}
                                <span>{meta.content}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="module-card-actions">
                    <motion.button
                        className="btn btn-primary btn-view"
                        onClick={() => onView && onView(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <EyeOutlined /> {viewButtonText}
                    </motion.button>
                    {onEdit && (
                        <motion.button
                            className="btn btn-icon btn-ghost"
                            onClick={() => onEdit(item)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <EditOutlined />
                        </motion.button>
                    )}
                    {onDelete && (
                        <motion.button
                            className="btn btn-icon btn-ghost delete"
                            onClick={() => onDelete(item)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <DeleteOutlined />
                        </motion.button>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

ModuleCard.propTypes = {
    title: PropTypes.string.isRequired,
    avatar: PropTypes.node,
    infoItems: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node,
            content: PropTypes.node.isRequired,
            label: PropTypes.string,
            badge: PropTypes.bool
        })
    ),
    metaItems: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node,
            content: PropTypes.node.isRequired
        })
    ),
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    item: PropTypes.object.isRequired,
    viewButtonText: PropTypes.string,
    statusBadge: PropTypes.node,
    extraContent: PropTypes.node
};

export default ModuleCard; 