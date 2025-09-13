import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { RiContactsLine } from 'react-icons/ri';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import ContactView from './components/ContactView';
import { ModalTitle } from '../../../../components/AdvancedForm';
import ModuleLayout from '../../../../components/ModuleLayout';
import {
    useGetContactsQuery,
    useDeleteContactMutation,
    useGetContactQuery,
    useCreateContactMutation,
    useUpdateContactMutation
} from '../../../../config/api/apiServices';
import './contact.scss';

const Contact = () => {
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [formModal, setFormModal] = useState({ visible: false, data: null });
    const [viewModal, setViewModal] = useState({ visible: false, id: null });
    const [deleteModal, setDeleteModal] = useState({ visible: false, data: null });

    const { data: response, isLoading } = useGetContactsQuery({
        page: currentPage,
        limit: pageSize
    });

    const { data: viewingContactResponse, isLoading: isViewLoading } = useGetContactQuery(
        viewModal.id,
        { skip: !viewModal.id }
    );

    const viewingContact = viewingContactResponse?.data;

    const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
    const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
    const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

    const contacts = response?.data?.items || [];
    const total = response?.data?.total || 0;
    const currentPageFromServer = response?.data?.currentPage || 1;

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleAdd = () => setFormModal({ visible: true, data: null });
    const handleEdit = (contact) => setFormModal({ visible: true, data: contact });
    const handleView = (contact) => {
        setViewModal({ visible: true, id: contact.id });
    };
    const handleDelete = (contact) => setDeleteModal({ visible: true, data: contact });

    const handleFormCancel = () => setFormModal({ visible: false, data: null });
    const handleViewCancel = () => setViewModal({ visible: false, id: null });
    const handleDeleteCancel = () => setDeleteModal({ visible: false, data: null });

    const handleFormSubmit = async (values) => {
        try {
            if (formModal.data) {
                await updateContact({
                    id: formModal.data.id,
                    data: values
                }).unwrap();
                message.success('Contact updated successfully');
            } else {
                await createContact(values).unwrap();
                message.success('Contact created successfully');
            }
            setFormModal({ visible: false, data: null });
        } catch (error) {
            message.error(`Failed to ${formModal.data ? 'update' : 'create'} contact: ${error.data?.message || error.message}`);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteContact(deleteModal.data.id).unwrap();
            message.success('Contact deleted successfully');
            setDeleteModal({ visible: false, data: null });
        } catch (error) {
            message.error('Failed to delete contact');
        }
    };

    return (
        <ModuleLayout
            title="Contacts"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddClick={handleAdd}
            className="contact"
        >
            <ContactList
                contacts={contacts}
                isLoading={isLoading}
                viewMode={viewMode}
                pagination={{
                    current: currentPageFromServer,
                    pageSize: pageSize,
                    total: total,
                    onChange: handlePageChange
                }}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
            />

            <Modal
                title={<ModalTitle icon={RiContactsLine} title={formModal.data ? 'Edit Contact' : 'Add Contact'} />}
                open={formModal.visible}
                onCancel={handleFormCancel}
                footer={null}
                width={800}
                className="modal"
                maskClosable={true}
            >
                <ContactForm
                    initialValues={formModal.data}
                    isSubmitting={isCreating || isUpdating}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            </Modal>

            <ContactView
                contact={viewingContact}
                isLoading={isViewLoading}
                visible={viewModal.visible}
                onClose={handleViewCancel}
            />

            <Modal
                title={<ModalTitle icon={DeleteOutlined} title="Delete Contact" />}
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
                <p>Are you sure you want to delete contact "{deleteModal.data?.name}"?</p>
                <p>This action cannot be undone.</p>
            </Modal>
        </ModuleLayout>
    );
};

export default Contact; 