import React, { useState } from 'react';
import { Modal, Space, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RiCodeBoxLine } from 'react-icons/ri';
import ApiGeneratorList from './components/ApiGeneratorList';
import ApiGeneratorForm from './components/ApiGeneratorForm';
import { ModalTitle } from '../../../components/AdvancedForm';
import ModuleLayout from '../../../components/ModuleLayout';
import {
    useDeleteApiGeneratorMutation,
    useGetApiGeneratorsQuery,
    useCreateApiGeneratorMutation,
    useUpdateApiGeneratorMutation
} from '../../../config/api/apiServices';
import './apiGenerator.scss';

const ApiGenerator = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [formModal, setFormModal] = useState({ visible: false, data: null });
    const [deleteModal, setDeleteModal] = useState({ visible: false, data: null });

    const { data: apiGeneratorsData, isLoading: isLoadingApiGenerators, isFetching } = useGetApiGeneratorsQuery({
        page: pagination.current,
        limit: pagination.pageSize
    });

    const [deleteApiGenerator, { isLoading: isDeleting }] = useDeleteApiGeneratorMutation();
    const [createApiGenerator, { isLoading: isCreating }] = useCreateApiGeneratorMutation();
    const [updateApiGenerator, { isLoading: isUpdating }] = useUpdateApiGeneratorMutation();

    const apiGenerators = apiGeneratorsData?.data?.items || [];
    const total = apiGeneratorsData?.data?.total || 0;

    const handleAdd = () => setFormModal({ visible: true, data: null });
    const handleEdit = (apiGenerator) => setFormModal({ visible: true, data: apiGenerator });
    const handleDelete = (apiGenerator) => setDeleteModal({ visible: true, data: apiGenerator });

    const handleFormCancel = () => setFormModal({ visible: false, data: null });
    const handleDeleteCancel = () => setDeleteModal({ visible: false, data: null });

    const handlePageChange = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize: pageSize
        });
    };

    const handleFormSubmit = async (values) => {
        try {
            if (formModal.data) {
                await updateApiGenerator({
                    id: formModal.data.id,
                    data: values
                }).unwrap();
                message.success('API module updated successfully');
            } else {
                await createApiGenerator(values).unwrap();
                message.success('API module created successfully');
            }
            setFormModal({ visible: false, data: null });
        } catch (error) {
            if (error.data) {
                const errorMessage = error.data.message?.replace('⚠️ ', '');
                message.error(errorMessage || 'Failed to process API module data');
            } else {
                message.error('An unexpected error occurred');
            }
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteApiGenerator(deleteModal.data.id).unwrap();
            message.success('API module deleted successfully');
            setDeleteModal({ visible: false, data: null });
        } catch (error) {
            message.error('Failed to delete API module');
        }
    };

    return (
        <ModuleLayout
            title="API Generator"
            onAddClick={handleAdd}
            className="api-generator"
        >
            <ApiGeneratorList
                apiGenerators={apiGenerators}
                isLoading={isLoadingApiGenerators || isFetching}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: total,
                    onChange: handlePageChange
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                title={<ModalTitle icon={RiCodeBoxLine} title={formModal.data ? 'Edit API Module' : 'Create API Module'} />}
                open={formModal.visible}
                onCancel={handleFormCancel}
                footer={null}
                width={800}
                className="modal"
                maskClosable={false}
            >
                <ApiGeneratorForm
                    initialValues={formModal.data}
                    isSubmitting={isCreating || isUpdating}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            </Modal>

            <Modal
                title={<ModalTitle icon={<DeleteOutlined />} title="Delete API Module" />}
                open={deleteModal.visible}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText="Delete"
                cancelText="Cancel"
                className="delete-modal"
                centered
                maskClosable={false}
                okButtonProps={{
                    danger: true,
                    loading: isDeleting
                }}
            >
                <p>Are you sure you want to delete API module "{deleteModal.data?.module_name}"?</p>
                <p>This action will delete all generated files and cannot be undone.</p>
            </Modal>
        </ModuleLayout>
    );
};

export default ApiGenerator; 