import React from 'react';
import { MdOutlineEmail, MdPhone, MdAccessTime } from 'react-icons/md';
import ModuleCard from '../../../../../components/ModuleCard';

const ContactCard = ({ contact, onEdit, onView, onDelete }) => {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        const date = new Date(timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const infoItems = [
        {
            icon: <MdOutlineEmail />,
            content: contact.email
        },
        {
            icon: <MdPhone />,
            content: contact.phone
        }
    ];

    const metaItems = [
        {
            icon: <MdAccessTime />,
            content: `Created ${formatDate(contact.createdAt)}`
        },
        {
            icon: <MdAccessTime />,
            content: `Updated ${formatDate(contact.updatedAt || contact.createdAt)}`
        }
    ];

    return (
        <ModuleCard
            title={contact.name}
            infoItems={infoItems}
            metaItems={metaItems}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            item={contact}
        />
    );
};

export default ContactCard;