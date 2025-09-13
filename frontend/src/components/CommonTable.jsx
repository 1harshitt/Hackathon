import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Input, Button, Space, Empty } from 'antd';
import { SearchOutlined, MoreOutlined, FilterOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

const CommonTable = ({
    data = [],
    columns = [],
    isLoading = false,
    pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
        onChange: () => { },
    },
    actionItems = [],
    extraProps = {},
    searchableColumns = [],
    dateColumns = []
}) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        confirm();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ padding: 8 }}
            >
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            className="btn btn-filter btn-primary"
                        >
                            Search
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={() => handleReset(clearFilters, confirm)}
                            className="btn btn-filter btn-reset"
                        >
                            Reset
                        </Button>
                    </motion.div>
                </Space>
            </motion.div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? 'var(--primary-color)' : undefined }} />
        ),
        onFilter: (value, record) => {
            if (dataIndex === 'source') {
                return record[dataIndex] === value;
            }

            return record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '';
        },
        filteredValue: searchedColumn === dataIndex ? [searchText] : null
    });

    const enhancedColumns = columns.map(column => {
        let enhancedColumn = { ...column };
        const dataIndex = column.dataIndex || column.name;

        if (searchableColumns.includes(dataIndex)) {
            enhancedColumn = {
                ...enhancedColumn,
                ...getColumnSearchProps(dataIndex)
            };
        }

        if (column.filters) {
            enhancedColumn.filterIcon = filtered => (
                <FilterOutlined style={{ color: filtered ? 'var(--primary-color)' : undefined }} />
            );
        }

        if (dateColumns.includes(dataIndex) && !column.render) {
            enhancedColumn.render = (value, record) => {
                const dateValue = value || (column.fallbackField && record[column.fallbackField]);
                return formatDate(dateValue);
            };
        }

        return enhancedColumn;
    });

    if (actionItems && actionItems.length > 0) {
        enhancedColumns.push({
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_, record) => (
                <Dropdown
                    menu={{ items: actionItems(record) }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <motion.button
                        className="btn btn-icon btn-ghost"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MoreOutlined />
                    </motion.button>
                </Dropdown>
            )
        });
    }

    return (
        <motion.div
            className="common-table"
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${pagination.current}-${pagination.pageSize}`}
                    className="table-scroll-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Table
                        columns={enhancedColumns}
                        dataSource={data}
                        rowKey="id"
                        loading={isLoading}
                        onChange={(newPagination, filters, sorter) => {
                            pagination.onChange(newPagination.current, newPagination.pageSize);
                        }}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} ${extraProps.itemName || 'items'}`,
                            showQuickJumper: true,
                            position: isMobile ? ['bottomCenter'] : ['bottomRight']
                        }}
                        locale={{
                            emptyText: (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={`No ${extraProps.itemName || 'items'} found`}
                                    />
                                </motion.div>
                            )
                        }}
                        scroll={{ x: 'max-content' }}
                        {...extraProps}
                    />
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default CommonTable; 