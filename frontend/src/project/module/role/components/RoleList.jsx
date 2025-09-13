import React from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import CommonTable from '../../../../components/CommonTable';
import { generateColumns, generateActionItems } from '../../../../utils/tableUtils.jsx';

const RoleList = ({
    roles = [],
    isLoading = false,
    currentPage = 1,
    pageSize = 10,
    total = 0,
    onPageChange,
    onEdit,
    onView,
    onDelete
}) => {
    // Define fields for the table
    const fields = [
        {
            name: 'role_name',
            title: 'Role Name',
            render: (text, record) => (
                <div className="name-container">
                    <span className="name">{text}</span>
                    {record.role_name === 'admin' && (
                        <span className="system-label">System</span>
                    )}
                </div>
            )
        },
        {
            name: 'permissions',
            title: 'Permissions',
            render: (permissions) => {
                if (!permissions) return "No permissions";

                try {
                    const permissionsObj = typeof permissions === 'string'
                        ? JSON.parse(permissions)
                        : permissions;

                    const moduleCount = Object.keys(permissionsObj).length;
                    if (moduleCount === 0) return "No permissions";

                    const hasAdminAccess = Object.values(permissionsObj).some(
                        module => module.create && module.read && module.update && module.delete
                    );

                    let summary = `${moduleCount} ${moduleCount === 1 ? 'module' : 'modules'}`;
                    if (hasAdminAccess) {
                        summary += ", Full access";
                    }

                    return summary;
                } catch (error) {
                    return "Invalid format";
                }
            }
        },
        { name: 'createdAt', title: 'Created At' },
        { name: 'updatedAt', title: 'Updated At' }
    ];

    // Define actions
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
            disabled: (record) => record.role_name === 'admin',
            handler: onDelete
        }
    ];

    // Generate columns
    const columns = generateColumns(fields, {
        dateFields: ['createdAt', 'updatedAt']
    });

    // Generate action items
    const getActionItems = generateActionItems(actions);

    return (
        <div className="table-list">
            <CommonTable
                data={roles.map(role => ({ ...role, key: role.id }))}
                columns={columns}
                isLoading={isLoading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: onPageChange
                }}
                actionItems={getActionItems}
                extraProps={{
                    itemName: 'roles',
                    className: 'role-table'
                }}
                searchableColumns={['role_name']}
                dateColumns={['createdAt', 'updatedAt']}
            />
        </div>
    );
};

export default RoleList; 