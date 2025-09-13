import React from 'react';
import { Switch } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useUpdateLeadMutation, useGetFiltersQuery } from '../../../../../config/api/apiServices';
import CommonTable from '../../../../../components/CommonTable';
import { generateColumns, generateActionItems } from '../../../../../utils/tableUtils.jsx';
import FancyLoader from '../../../../../components/FancyLoader';

const LeadList = ({
    leads = [],
    isLoading,
    viewMode,
    currentPage,
    pageSize,
    total,
    onPageChange,
    onEdit,
    onDelete,
    pipelines = [],
    stages = []
}) => {
    const [updateLead] = useUpdateLeadMutation();

    const { data: filtersResponse } = useGetFiltersQuery({ limit: 'all' });
    const filters = filtersResponse?.data?.items || [];
    const sources = filters.filter(filter => filter.type === 'source');

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'var(--text-error)';
            case 'medium':
                return 'var(--text-warning)';
            case 'low':
                return 'var(--text-success)';
            default:
                return 'var(--text-primary)';
        }
    };

    const getPipelineName = (pipelineId) => {
        if (!pipelineId) return "No Pipeline";
        const pipeline = pipelines.find(p => p.id === pipelineId);
        return pipeline ? pipeline.name : "No Pipeline";
    };

    const getStageName = (stageId) => {
        if (!stageId) return "No Stage";
        const stage = stages.find(s => s.id === stageId);
        return stage ? stage.name : "No Stage";
    };

    const getSourceName = (sourceId) => {
        if (!sourceId) return null;
        const source = sources.find(s => s.id === sourceId);
        return source ? source.name : null;
    };

    const renderPipelineStageInfo = (lead) => {
        const pipelineName = getPipelineName(lead.pipeline);
        const stageName = getStageName(lead.stage);

        return (
            <div className="pipeline-stage-info">
                <div className="pipeline-name">{pipelineName || "No Pipeline"}</div>
                <div className="stage-name">{stageName || "No Stage"}</div>
            </div>
        );
    };

    const handleStatusToggle = async (record, checked) => {
        try {
            const newStatus = checked ? 'open' : 'closed';
            await updateLead({
                id: record.id,
                data: {
                    ...record,
                    status: newStatus
                }
            }).unwrap();
        } catch (error) {
            // Error handling is done in parent component
        }
    };

    const fields = [
        {
            name: 'leadTitle',
            title: 'Title',
            render: (title) => (
                <div style={{ fontWeight: 'bold' }}>{title}</div>
            ),
            sorter: (a, b) => a.leadTitle.localeCompare(b.leadTitle)
        },
        {
            name: 'leadValue',
            title: 'Value',
            render: (value) => (
                <div className="value-display">
                    <span className="currency-symbol">₹</span>
                    <span className="value-amount">{parseFloat(value).toLocaleString()}</span>
                </div>
            ),
            sorter: (a, b) => a.leadValue - b.leadValue
        },
        {
            name: 'pipeline',
            title: 'Pipeline / Stage',
            render: (_, record) => renderPipelineStageInfo(record)
        },
        {
            name: 'source',
            title: 'Source',
            render: (sourceId) => sourceId ? <span>{getSourceName(sourceId)}</span> : null,
            filters: sources.map(source => ({ text: source.name, value: source.id })),
            onFilter: (value, record) => record.source === value,
            filterSearch: true
        },
        {
            name: 'status',
            title: 'Status',
            render: (status, record) => (
                <Switch
                    checked={status === 'open'}
                    onChange={(checked) => handleStatusToggle(record, checked)}
                    checkedChildren="Open"
                    unCheckedChildren="Closed"
                />
            ),
            filters: [
                { text: 'Open', value: 'open' },
                { text: 'Closed', value: 'closed' }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            name: 'priority',
            title: 'Priority',
            render: (priority) => priority ?
                <span style={{ fontWeight: 'bold', color: getPriorityColor(priority) }}>{priority}</span>
                : null,
            filters: [
                { text: 'High', value: 'high' },
                { text: 'Medium', value: 'medium' },
                { text: 'Low', value: 'low' }
            ],
            onFilter: (value, record) => record.priority === value,
            filterSearch: true
        }
    ];

    const actions = [
        {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            handler: onEdit
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            handler: onDelete
        }
    ];

    const columns = generateColumns(fields);
    const getActionItems = generateActionItems(actions);

    if (isLoading && leads.length === 0) {
        return (
            <FancyLoader
                message="Loading your leads..."
                subMessage="Please wait while we prepare your data"
                subMessage2="This may take a few moments"
                processingText="PROCESSING"
            />
        );
    }

    // Kanban view is handled separately
    if (viewMode === 'grid') {
        return null;
    }

    return (
        <div className="table-list">
            <CommonTable
                data={leads}
                columns={columns}
                isLoading={isLoading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: onPageChange,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} leads`,
                    showQuickJumper: true
                }}
                actionItems={getActionItems}
                extraProps={{
                    itemName: 'leads',
                    className: 'lead-table'
                }}
                searchableColumns={['leadTitle', 'status', 'priority', 'source']}
            />
        </div>
    );
};

export default LeadList;