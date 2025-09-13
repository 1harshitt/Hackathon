import React from 'react';
import { MdOutlineEmail, MdAccessTime } from 'react-icons/md';
import { FaUserTag } from 'react-icons/fa';
import ModuleCard from '../../../../components/ModuleCard';

const UserCard = ({ user, roleName, onEdit, onView, onDelete }) => {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        const date = new Date(timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const infoItems = [
        {
            icon: <MdOutlineEmail />,
            content: user.email
        },
        {
            icon: <FaUserTag />,
            content: roleName || 'N/A',
            badge: true
        }
    ];

    const metaItems = [
        {
            icon: <MdAccessTime />,
            content: `Created ${formatDate(user.createdAt)}`
        },
        {
            icon: <MdAccessTime />,
            content: `Updated ${formatDate(user.updatedAt || user.createdAt)}`
        }
    ];

    return (
        <ModuleCard
            title={user.username}
            infoItems={infoItems}
            metaItems={metaItems}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            item={user}
        />
    );
};

export default UserCard;

