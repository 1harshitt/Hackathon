import React from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ContactCard from './ContactCard.jsx';
import CommonTable from '../../../../../components/CommonTable';
import ModuleGrid from '../../../../../components/ModuleGrid';
import { generateColumns, generateActionItems } from '../../../../../utils/tableUtils.jsx';

const ContactList = ({
    contacts = [],
    isLoading = false,
    viewMode = 'list',
    pagination,
    onEdit,
    onView,
    onDelete
}) => {
    // Define fields for the table
    const fields = [
        {
            name: 'name',
            title: 'Name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            name: 'email',
            title: 'Email'
        },
        {
            name: 'phone',
            title: 'Phone'
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
            handler: onDelete
        }
    ];

    // Generate columns
    const columns = generateColumns(fields, {
        dateFields: ['createdAt', 'updatedAt']
    });

    // Generate action items
    const getActionItems = generateActionItems(actions);

    const renderContactCard = (contact) => (
        <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
        />
    );

    if (viewMode === 'grid') {
        return (
            <ModuleGrid
                items={contacts}
                renderItem={renderContactCard}
                isLoading={isLoading}
                emptyMessage="No contacts found"
            />
        );
    }

    return (
        <div className="table-list">
            <CommonTable
                data={contacts}
                columns={columns}
                isLoading={isLoading}
                pagination={pagination}
                actionItems={getActionItems}
                extraProps={{
                    itemName: 'contacts',
                    className: 'contact-table'
                }}
                searchableColumns={['name', 'email', 'phone']}
                dateColumns={['createdAt', 'updatedAt']}
            />
        </div>
    );
};

export default ContactList; 