import React from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import UserCard from './UserCard.jsx';
import CommonTable from '../../../../components/CommonTable';
import ModuleGrid from '../../../../components/ModuleGrid';
import { generateColumns, generateActionItems } from '../../../../utils/tableUtils.jsx';

const UserList = ({ users, roleMap, isLoading, viewMode, pagination, onEdit, onView, onDelete }) => {
    const fields = [
        {
            name: 'username',
            title: 'Username',
            sorter: (a, b) => a.username.localeCompare(b.username)
        },
        {
            name: 'email',
            title: 'Email'
        },
        {
            name: 'role_id',
            title: 'Role',
            render: (roleId) => roleMap[roleId] || 'N/A'
        },
        {
            name: 'createdAt',
            title: 'Created At',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            name: 'updatedAt',
            title: 'Updated At',
            sorter: (a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt)
        }
    ];
    const actions = [
        {
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            handler: onView
        },
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

    const columns = generateColumns(fields, {
        dateFields: ['createdAt', 'updatedAt']
    });

    const getActionItems = generateActionItems(actions);

    const renderUserCard = (user) => (
        <UserCard
            key={user.id}
            user={user}
            roleName={roleMap[user.role_id]}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
        />
    );

    if (viewMode === 'grid') {
        return (
            <ModuleGrid
                items={users}
                renderItem={renderUserCard}
                isLoading={isLoading}
                emptyMessage="No users found"
            />
        );
    }

    return (
        <div className="table-list">
            <CommonTable
                data={users}
                columns={columns}
                isLoading={isLoading}
                pagination={pagination}
                actionItems={getActionItems}
                extraProps={{
                    itemName: 'users',
                    onChange: (newPagination) => pagination.onChange(newPagination.current, newPagination.pageSize)
                }}
                searchableColumns={['username', 'email', 'role_id']}
                dateColumns={['createdAt', 'updatedAt']}
            />
        </div>
    );
};

export default UserList;