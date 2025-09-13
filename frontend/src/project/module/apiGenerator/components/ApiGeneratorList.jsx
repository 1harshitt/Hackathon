import React from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ApiGeneratorList = ({ 
    apiGenerators, 
    isLoading, 
    pagination, 
    onEdit, 
    onDelete 
}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'generated':
                return 'success';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Module Name',
            dataIndex: 'module_name',
            key: 'module_name',
            sorter: (a, b) => a.module_name.localeCompare(b.module_name)
        },
        {
            title: 'Fields Count',
            key: 'fields_count',
            render: (_, record) => (
                <span>{record.fields?.length || 0}</span>
            )
        },
        {
            title: 'Authentication',
            key: 'authentication',
            render: (_, record) => (
                <Tag color={record.requirements?.authentication ? 'blue' : 'orange'}>
                    {record.requirements?.authentication ? 'Required' : 'Not Required'}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status?.charAt(0).toUpperCase() + status?.slice(1)}
                </Tag>
            )
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => onEdit(record)} 
                            disabled={record.status === 'generated'} 
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => onDelete(record)} 
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    // Make sure apiGenerators is always an array
    const safeApiGenerators = Array.isArray(apiGenerators) ? apiGenerators : [];

    return (
        <Table
            columns={columns}
            dataSource={safeApiGenerators}
            rowKey="id"
            loading={isLoading}
            pagination={pagination}
        />
    );
};

export default ApiGeneratorList; 