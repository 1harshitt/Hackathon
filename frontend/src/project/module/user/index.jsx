import React, { useState, useEffect } from 'react';
import { Modal, Space, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RiUserLine } from 'react-icons/ri';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserView from './components/UserView';
import { ModalTitle } from '../../../components/AdvancedForm';
import ModuleLayout from '../../../components/ModuleLayout';
import {
    useDeleteUserMutation,
    useGetUsersQuery,
    useGetRolesQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation
} from '../../../config/api/apiServices';
import './user.scss';

const User = () => {
    const [viewMode, setViewMode] = useState('list');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [formModal, setFormModal] = useState({ visible: false, data: null });
    const [viewModal, setViewModal] = useState({ visible: false, id: null });
    const [deleteModal, setDeleteModal] = useState({ visible: false, data: null });

    const { data: usersData, isLoading: isLoadingUsers, isFetching } = useGetUsersQuery({
        page: pagination.current,
        limit: pagination.pageSize
    });

    const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
    const { data: userData, isLoading: isLoadingUser } = useGetUserQuery(viewModal.id, {
        skip: !viewModal.id
    });

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const users = usersData?.data?.items || [];
    const roles = rolesData?.data?.items || [];
    const user = userData?.data;
    const total = usersData?.data?.total || 0;

    const [roleMap, setRoleMap] = useState({});

    useEffect(() => {
        if (roles && roles.length > 0) {
            const map = {};
            roles.forEach(role => {
                map[role.id] = role.role_name;
            });
            setRoleMap(map);
        }
    }, [roles]);

    const handleAdd = () => setFormModal({ visible: true, data: null });
    const handleEdit = (user) => setFormModal({ visible: true, data: user });
    const handleView = (user) => setViewModal({ visible: true, id: user.id });
    const handleDelete = (user) => setDeleteModal({ visible: true, data: user });

    const handleFormCancel = () => setFormModal({ visible: false, data: null });
    const handleViewCancel = () => setViewModal({ visible: false, id: null });
    const handleDeleteCancel = () => setDeleteModal({ visible: false, data: null });

    const handlePageChange = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize: pageSize
        });
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleFormSubmit = async (values) => {
        try {
            if (formModal.data) {
                const updatedValues = { ...values };

                if (updatedValues.username === formModal.data.username) {
                    delete updatedValues.username;
                }

                if (updatedValues.email === formModal.data.email) {
                    delete updatedValues.email;
                }

                if (!updatedValues.password || updatedValues.password.trim() === '') {
                    delete updatedValues.password;
                }

                await updateUser({
                    id: formModal.data.id,
                    data: updatedValues
                }).unwrap();
                message.success('User updated successfully');
            } else {
                await createUser(values).unwrap();
                message.success('User created successfully');
            }
            setFormModal({ visible: false, data: null });
        } catch (error) {
            if (error.data) {
                const errorMessage = error.data.message?.replace('⚠️ ', '');
                message.error(errorMessage || 'Failed to process user data');
            } else {
                message.error('An unexpected error occurred');
            }
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteUser(deleteModal.data.id).unwrap();
            message.success('User deleted successfully');
            setDeleteModal({ visible: false, data: null });
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    return (
        <ModuleLayout
            title="Users"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddClick={handleAdd}
            className="user"
        >
            <UserList
                users={users}
                roleMap={roleMap}
                isLoading={isLoadingUsers || isFetching}
                viewMode={viewMode}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: total,
                    onChange: handlePageChange
                }}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
            />

            <Modal
                title={<ModalTitle icon={RiUserLine} title={formModal.data ? 'Edit User' : 'Add User'} />}
                open={formModal.visible}
                onCancel={handleFormCancel}
                footer={null}
                width={800}
                className="modal"
                maskClosable={true}
            >
                <UserForm
                    initialValues={formModal.data}
                    roles={roles}
                    isLoadingRoles={isLoadingRoles}
                    isSubmitting={isCreating || isUpdating}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            </Modal>

            <UserView
                user={user}
                roleMap={roleMap}
                isLoading={isLoadingUser}
                visible={viewModal.visible}
                onClose={handleViewCancel}
            />

            <Modal
                title={<ModalTitle icon={DeleteOutlined} title="Delete User" />}
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
                <p>Are you sure you want to delete user "{deleteModal.data?.username}"?</p>
                <p>This action cannot be undone.</p>
            </Modal>
        </ModuleLayout>
    );
};

export default User;