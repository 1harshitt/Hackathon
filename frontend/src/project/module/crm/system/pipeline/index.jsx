import React, { useState } from 'react';
import { message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { RiFlowChart } from 'react-icons/ri';
import {
    useGetPipelinesQuery,
    useCreatePipelineMutation,
    useUpdatePipelineMutation,
    useDeletePipelineMutation
} from '../../../../../config/api/apiServices';
import PipelineList from './components/PipelineList';
import PipelineForm from './components/PipelineForm';
import PipelineView from './components/PipelineView';
import { SystemModule } from '../../system';
import './pipeline.scss';

const Pipeline = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formModal, setFormModal] = useState({ visible: false, data: null });
    const [viewModal, setViewModal] = useState({ visible: false, data: null });
    const [deleteModal, setDeleteModal] = useState({ visible: false, data: null });

    const { data: response, isLoading } = useGetPipelinesQuery({
        page: currentPage,
        limit: pageSize
    });

    const [createPipeline, { isLoading: isCreating }] = useCreatePipelineMutation();
    const [updatePipeline, { isLoading: isUpdating }] = useUpdatePipelineMutation();
    const [deletePipeline, { isLoading: isDeleting }] = useDeletePipelineMutation();

    const pipelines = response?.data?.items || [];
    const total = response?.data?.total || 0;

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setCurrentPage(1);
    };

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const handleAdd = () => setFormModal({ visible: true, data: null });
    const handleEdit = (pipeline) => setFormModal({ visible: true, data: pipeline });
    const handleView = (pipeline) => setViewModal({ visible: true, data: pipeline });
    const handleDelete = (pipeline) => setDeleteModal({ visible: true, data: pipeline });

    const handleFormCancel = () => setFormModal({ visible: false, data: null });
    const handleViewCancel = () => setViewModal({ visible: false, data: null });
    const handleDeleteCancel = () => setDeleteModal({ visible: false, data: null });

    const handleDeleteConfirm = async () => {
        try {
            await deletePipeline(deleteModal.data.id).unwrap();
            message.success('Pipeline deleted successfully');
            setDeleteModal({ visible: false, data: null });
        } catch (error) {
            message.error('Failed to delete pipeline');
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            if (formModal.data) {
                await updatePipeline({
                    id: formModal.data.id,
                    data: values
                }).unwrap();
                message.success('Pipeline updated successfully');
            } else {
                await createPipeline(values).unwrap();
                message.success('Pipeline created successfully');
            }
            setFormModal({ visible: false, data: null });
        } catch (error) {
            message.error(`Failed to ${formModal.data ? 'update' : 'create'} pipeline: ${error.data?.message || error.message}`);
        }
    };

    return (
        <SystemModule
            title="Pipeline"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddClick={handleAdd}
            className="pipeline"
            formModal={formModal}
            viewModal={viewModal}
            deleteModal={deleteModal}
            onFormCancel={handleFormCancel}
            onViewCancel={handleViewCancel}
            onDeleteCancel={handleDeleteCancel}
            onDeleteConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
            formTitle={formModal?.data ? 'Edit Pipeline' : 'Add Pipeline'}
            formIcon={<RiFlowChart />}
            viewTitle={viewModal?.data ? `${viewModal.data.name} Pipeline` : 'Pipeline Details'}
            deleteTitle="Delete Pipeline"
            deleteItemName="pipeline"
            formContent={
                <PipelineForm
                    initialValues={formModal?.data}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    loading={isCreating || isUpdating}
                />
            }
            viewContent={
                viewModal?.data && (
                    <PipelineView
                        pipeline={viewModal.data}
                        onClose={handleViewCancel}
                        hideHeader={true}
                    />
                )
            }
        >
            <PipelineList
                viewMode={viewMode}
                pipelines={pipelines}
                isLoading={isLoading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: handlePageChange
                }}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
            />
        </SystemModule>
    );
};

export default Pipeline;