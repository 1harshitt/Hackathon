import React from 'react';
import * as Yup from 'yup';
import AdvancedForm from '../../../../../components/AdvancedForm';

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Contact name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d+$/, 'Please enter a valid phone number (digits only)')
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
});

// Define fields configuration
const contactFields = [
    {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter full name',
        rules: [
            { required: true, message: 'Please enter the contact name' },
            { min: 2, message: 'Name must be at least 2 characters' },
            { max: 50, message: 'Name must be less than 50 characters' }
        ],
        span: 12
    },
    {
        name: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'Enter email address',
        rules: [
            { required: true, message: 'Please enter the email address' },
            { type: 'email', message: 'Please enter a valid email address' }
        ],
        span: 12
    },
    {
        name: 'phone',
        label: 'Phone Number',
        type: 'text',
        placeholder: 'Enter phone number',
        rules: [
            { required: true, message: 'Please enter the phone number' },
            {
                validator: async (_, value) => {
                    if (value) {
                        if (!/^\d+$/.test(value)) {
                            throw new Error('Please enter a valid phone number (digits only)');
                        }
                        if (value.length < 10 || value.length > 15) {
                            throw new Error('Phone number must be between 10-15 digits');
                        }
                    }
                }
            }
        ],
        span: 12
    }
];

const ContactForm = ({ initialValues, isSubmitting, onSubmit, onCancel }) => {
    const handleSubmit = (values) => {
        const formData = {
            ...values,
            phone: Number(values.phone)
        };
        onSubmit(formData);
    };

    return (
        <AdvancedForm
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            fields={contactFields}
            validationSchema={validationSchema}
            submitButtonText={initialValues ? 'Update Contact' : 'Create Contact'}
        />
    );
};

export default ContactForm; 