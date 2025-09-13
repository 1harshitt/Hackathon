import React from 'react';
import { Typography } from 'antd';
import { RiLayoutGridLine, RiListUnordered } from 'react-icons/ri';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const { Title } = Typography;

const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3
        }
    }
};

const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3
        }
    }
};

const ModuleLayout = ({
    title,
    children,
    showViewToggle = false,
    viewMode = 'list',
    onViewModeChange,
    actionButtons,
    className = '',
    onAddClick,
    showAddButton = true,
    addButtonText,
    extraHeaderContent
}) => {
    const singularTitle = title.endsWith('s') ? title.slice(0, -1) : title;
    const defaultAddButtonText = `Add ${singularTitle}`;

    const renderAddButton = () => {
        if (!showAddButton) return null;

        return (
            <motion.button
                className="btn btn-primary add-button"
                onClick={onAddClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <PlusOutlined /> <span className="btn-text">{addButtonText || defaultAddButtonText}</span>
            </motion.button>
        );
    };

    return (
        <div className={`module-container ${className}`} style={{ overflow: "visible" }}>
            <motion.div
                className="module-header"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                style={{ overflow: "visible" }}
            >
                <div className="module-header-title">
                    <Title level={2} className="mfh_title">{title}</Title>
                </div>
                <div className="module-header-actions">
                    {extraHeaderContent}
                    {showViewToggle && (
                        <div
                            className="view-toggle"
                            data-mode={viewMode}
                            style={{ overflow: "visible" }}
                        >
                            <motion.button
                                className={`btn btn-icon ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => onViewModeChange('list')}
                                title="List View"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RiListUnordered />
                            </motion.button>
                            <motion.button
                                className={`btn btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => onViewModeChange('grid')}
                                title="Grid View"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RiLayoutGridLine />
                            </motion.button>
                        </div>
                    )}
                    {renderAddButton()}
                    {actionButtons}
                </div>
            </motion.div>
            <motion.div
                className="module-content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                style={{ overflow: "visible" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

ModuleLayout.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    showViewToggle: PropTypes.bool,
    viewMode: PropTypes.oneOf(['list', 'grid']),
    onViewModeChange: PropTypes.func,
    actionButtons: PropTypes.node,
    className: PropTypes.string,
    onAddClick: PropTypes.func,
    showAddButton: PropTypes.bool,
    addButtonText: PropTypes.string,
    extraHeaderContent: PropTypes.node
};

export default ModuleLayout; 