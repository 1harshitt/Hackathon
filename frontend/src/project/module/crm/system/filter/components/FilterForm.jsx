import React from 'react';
import * as Yup from 'yup';
import AdvancedForm from '../../../../../../components/AdvancedForm';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Filter name is required'),
    type: Yup.string().required('Filter type is required')
});

const FilterForm = ({ initialValues, onSubmit, onCancel, loading }) => {
    const typeOptions = [
        { value: 'tag', label: 'Tag' },
        { value: 'status', label: 'Status' },
        { value: 'label', label: 'Label' },
        { value: 'source', label: 'Source' },
        { value: 'category', label: 'Category' },
    ];

    const getFilterFields = () => {
        return [
            {
                name: 'name',
                label: 'Filter Name',
                type: 'text',
                placeholder: 'Enter filter name',
                rules: [{ required: true, message: 'Please enter filter name' }],
                span: 24
            },
            {
                name: 'type',
                label: 'Filter Type',
                type: 'select',
                placeholder: 'Select filter type',
                rules: [{ required: true, message: 'Please select filter type' }],
                options: typeOptions,
                disabled: !!initialValues,
                span: 24
            }
        ];
    };

    return (
        <AdvancedForm
            initialValues={initialValues}
            isSubmitting={loading}
            onSubmit={onSubmit}
            onCancel={onCancel}
            fields={getFilterFields()}
            validationSchema={validationSchema}
            submitButtonText={initialValues ? 'Update Filter' : 'Create Filter'}
        />
    );
};

export default FilterForm; 