import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Empty, Spin, Tag, Dropdown, message } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { RiFileList3Line } from 'react-icons/ri';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useUpdateLeadMutation, useUpdateStageMutation, useGetContactsQuery, useGetFiltersQuery } from '../../../../../config/api/apiServices';

const LeadKanbanView = ({
    leads = [],
    isLoading,
    onEdit,
    onDelete,
    pipelines = [],
    stages = [],
    selectedPipeline
}) => {
    const [stageGroups, setStageGroups] = useState({});
    const [pipelineStages, setPipelineStages] = useState([]);
    const [updateLead] = useUpdateLeadMutation();
    const [updateStage] = useUpdateStageMutation();

    const { data: contactsResponse } = useGetContactsQuery({ limit: 'all' });
    const contacts = contactsResponse?.data?.items || [];

    const { data: filtersResponse } = useGetFiltersQuery({ limit: 'all' });
    const filters = filtersResponse?.data?.items || [];
    const sources = useMemo(() => filters.filter(filter => filter.type === 'source'), [filters]);

    const getContactName = useCallback((contactId) => {
        if (!contactId) return null;
        const contact = contacts.find(c => c.id === contactId);
        return contact ? contact.name : contactId;
    }, [contacts]);

    const getSourceName = useCallback((sourceId) => {
        if (!sourceId) return null;
        const source = sources.find(s => s.id === sourceId);
        return source ? source.name : sourceId;
    }, [sources]);

    useEffect(() => {
        if (selectedPipeline) {
            const filteredStages = stages.filter(
                stage => stage.pipeline === selectedPipeline && stage.type === 'lead'
            );
            const sortedStages = [...filteredStages].sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                return 0;
            });
            setPipelineStages(sortedStages);
        } else {
            setPipelineStages([]);
        }
    }, [selectedPipeline, stages]);

    useEffect(() => {
        const groups = {};
        pipelineStages.forEach(stage => {
            groups[stage.id] = {
                stage: stage,
                leads: []
            };
        });

        leads.forEach(lead => {
            if (lead.stage && groups[lead.stage]) {
                groups[lead.stage].leads.push({
                    ...lead,
                    contactName: getContactName(lead.contact),
                    sourceName: getSourceName(lead.source)
                });
            } else if (lead.stage) {
                const matchingStage = stages.find(s => s.id === lead.stage);
                if (matchingStage) {
                    groups[lead.stage] = {
                        stage: matchingStage,
                        leads: [{
                            ...lead,
                            contactName: getContactName(lead.contact),
                            sourceName: getSourceName(lead.source)
                        }]
                    };
                }
            }
        });

        setStageGroups(groups);
    }, [leads, pipelineStages, stages, getContactName, getSourceName]);

    const getActionItems = useCallback((record) => [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: () => onEdit(record)
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            onClick: () => onDelete(record),
            danger: true
        }
    ], [onEdit, onDelete]);

    const renderEmptyState = () => (
        <div className="empty-state">
            <RiFileList3Line className="empty-icon" />
            <p className="empty-text">No leads found. Create one to get started.</p>
        </div>
    );

    const handleDragEnd = useCallback(async (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        if (type === 'COLUMN') {
            const stageId = draggableId;
            const stage = pipelineStages.find(s => s.id === stageId);

            if (!stage) return;

            try {
                await updateStage({
                    id: stage.id,
                    data: {
                        ...stage,
                        order: destination.index
                    }
                }).unwrap();
            } catch (error) {
                message.error('Failed to update stage order');
            }
            return;
        }

        const leadId = draggableId;
        const lead = leads.find(l => l.id === leadId);

        if (!lead) return;

        try {
            await updateLead({
                id: lead.id,
                data: {
                    ...lead,
                    stage: destination.droppableId
                }
            }).unwrap();
        } catch (error) {
            message.error('Failed to move lead');
        }
    }, [leads, pipelineStages, updateLead, updateStage]);

    const renderActionButton = useCallback((lead) => (
        <Dropdown
            menu={{ items: getActionItems(lead) }}
            trigger={['click']}
            placement="bottomRight"
        >
            <button className="action-button" onClick={(e) => e.stopPropagation()}>
                <MoreOutlined />
            </button>
        </Dropdown>
    ), [getActionItems]);

    if (isLoading && leads.length === 0) {
        return <div className="center-spinner"><Spin size="large" /></div>;
    }

    if (leads.length === 0 || pipelineStages.length === 0) {
        return renderEmptyState();
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="lead-kanban">
                <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                    {(provided) => (
                        <Row
                            className="kanban-container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {pipelineStages.map((stage, index) => {
                                const stageGroup = stageGroups[stage.id] || { leads: [] };
                                return (
                                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                                        {(provided) => (
                                            <Col
                                                className="kanban-column"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <div className="kanban-column-header" {...provided.dragHandleProps}>
                                                    <h3>{stage.name}</h3>
                                                    <Tag>{stageGroup.leads.length}</Tag>
                                                </div>
                                                <Droppable droppableId={stage.id} type="CARD">
                                                    {(provided) => (
                                                        <div
                                                            className="kanban-column-content"
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                        >
                                                            {stageGroup.leads.length === 0 ? (
                                                                <Empty
                                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                                    description="No leads in this stage"
                                                                    className="kanban-empty"
                                                                />
                                                            ) : (
                                                                stageGroup.leads.map((lead, index) => (
                                                                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="lead-card"
                                                                            >
                                                                                <div className="lead-card-header">
                                                                                    <h3 className="lead-card-title">{lead.leadTitle}</h3>
                                                                                    {renderActionButton(lead)}
                                                                                </div>
                                                                                <div className="lead-card-content">
                                                                                    {lead.contactName && (
                                                                                        <div className="lead-card-info">
                                                                                            <span className="stat-label">Contact</span>
                                                                                            <span className="stat-value">{lead.contactName}</span>
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="lead-card-info">
                                                                                        <span className="stat-label">Value</span>
                                                                                        <span className="stat-value">₹{parseFloat(lead.leadValue).toLocaleString()}</span>
                                                                                    </div>
                                                                                    <div className="lead-card-status-row">
                                                                                        {lead.status && (
                                                                                            <span className={`stat-tag ${lead.status.toLowerCase()}`}>{lead.status}</span>
                                                                                        )}
                                                                                        {lead.priority && (
                                                                                            <span className={`stat-tag ${lead.priority.toLowerCase()}`}>{lead.priority}</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))
                                                            )}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </Col>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </Row>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default LeadKanbanView;
