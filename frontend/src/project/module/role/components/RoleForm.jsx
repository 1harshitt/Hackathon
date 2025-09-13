import React from 'react';
import * as Yup from 'yup';
import AdvancedForm from '../../../../components/AdvancedForm';

const validationSchema = Yup.object().shape({
    role_name: Yup.string()
        .required('Role name is required')
        .min(3, 'Role name must be at least 3 characters')
        .max(50, 'Role name must be less than 50 characters'),
    permissions: Yup.string()
        .nullable()
});

const roleFields = [
    {
        name: 'role_name',
        label: 'Role Name',
        type: 'text',
        placeholder: 'Enter role name',
        rules: [{ required: true, message: 'Please enter role name' }],
        span: 24
    },
    {
        name: 'permissions',
        label: 'Permissions',
        type: 'textarea',
        placeholder: 'Enter permissions (JSON format)',
        rows: 4,
        span: 24
    }
];

const RoleForm = ({ initialValues, isSubmitting, onSubmit, onCancel }) => {
    return (
        <AdvancedForm
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
            fields={roleFields}
            validationSchema={validationSchema}
            submitButtonText={initialValues ? 'Update Role' : 'Create Role'}
        />
    );
};

export default RoleForm; 