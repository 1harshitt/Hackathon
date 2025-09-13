import React from 'react';
import * as Yup from 'yup';
import AdvancedForm from '../../../../components/AdvancedForm';

const getValidationSchema = (isEditing) => {
    return Yup.object().shape({
        username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters'),
        email: Yup.string()
            .required('Email is required')
            .email('Please enter a valid email'),
        password: isEditing
            ? Yup.string().min(6, 'Password must be at least 6 characters')
            : Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        role_id: Yup.string().required('Role is required'),
        first_name: Yup.string(),
        last_name: Yup.string(),
        phone: Yup.string(),
        address: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        country: Yup.string(),
        zip_code: Yup.string(),
        is_active: Yup.boolean()
    });
};

const UserForm = ({ initialValues, roles, isLoadingRoles, isSubmitting, onSubmit, onCancel }) => {
    const isEditing = !!initialValues;

    const getUserFields = () => {
        const commonFields = [
            {
                name: 'username',
                label: 'Username',
                type: 'text',
                placeholder: 'Enter username',
                rules: [
                    { required: true, message: 'Please enter username' },
                    { min: 3, message: 'Username must be at least 3 characters' }
                ],
                span: 12
            },
            {
                name: 'email',
                label: 'Email',
                type: 'text',
                placeholder: 'Enter email',
                rules: [
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                ],
                span: 12
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                placeholder: isEditing ? 'Enter new password to change' : 'Enter password',
                rules: isEditing
                    ? [{ min: 6, message: 'Password must be at least 6 characters' }]
                    : [
                        { required: true, message: 'Please enter password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ],
                span: 24,
                className: 'custom-password-input'
            },
            {
                name: 'role_id',
                label: 'Role',
                type: 'select',
                placeholder: 'Select role',
                rules: [{ required: true, message: 'Please select a role' }],
                options: Array.isArray(roles)
                    ? roles.map(role => ({ label: role.role_name, value: role.id }))
                    : [],
                disabled: isLoadingRoles,
                span: 24
            }
        ];

        if (isEditing) {
            return [
                ...commonFields,
                {
                    name: 'first_name',
                    label: 'First Name',
                    type: 'text',
                    placeholder: 'Enter first name',
                    span: 12
                },
                {
                    name: 'last_name',
                    label: 'Last Name',
                    type: 'text',
                    placeholder: 'Enter last name',
                    span: 12
                },
                {
                    name: 'phone',
                    label: 'Phone',
                    type: 'text',
                    placeholder: 'Enter phone number',
                    span: 24
                },
                {
                    name: 'address',
                    label: 'Address',
                    type: 'textarea',
                    placeholder: 'Enter address',
                    rows: 2,
                    span: 24
                },
                {
                    name: 'city',
                    label: 'City',
                    type: 'text',
                    placeholder: 'Enter city',
                    span: 12
                },
                {
                    name: 'state',
                    label: 'State',
                    type: 'text',
                    placeholder: 'Enter state',
                    span: 12
                },
                {
                    name: 'country',
                    label: 'Country',
                    type: 'text',
                    placeholder: 'Enter country',
                    span: 12
                },
                {
                    name: 'zip_code',
                    label: 'Zip Code',
                    type: 'text',
                    placeholder: 'Enter zip code',
                    span: 12
                },
                {
                    name: 'is_active',
                    label: 'Status',
                    type: 'select',
                    options: [
                        { label: 'Active', value: true },
                        { label: 'Inactive', value: false }
                    ],
                    span: 24
                }
            ];
        }

        return commonFields;
    };

    const handleSubmit = (values) => {
        if (isEditing && !values.password) {
            const { password, ...restValues } = values;
            onSubmit(restValues);
        } else {
            onSubmit(values);
        }
    };

    return (
        <AdvancedForm
            initialValues={initialValues ? { ...initialValues, password: undefined } : undefined}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            fields={getUserFields()}
            validationSchema={getValidationSchema(isEditing)}
            submitButtonText={isEditing ? 'Update User' : 'Create User'}
        />
    );
};

export default UserForm;