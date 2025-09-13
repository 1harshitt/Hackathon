import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useGetFiltersQuery, useGetContactsQuery } from '../../../../../config/api/apiServices';
import AdvancedForm from '../../../../../components/AdvancedForm';

const validationSchema = Yup.object().shape({
    leadTitle: Yup.string().required('Lead title is required'),
    leadValue: Yup.number().required('Lead value is required').min(0, 'Lead value must be positive'),
    pipeline: Yup.string().required('Pipeline is required'),
    stage: Yup.string(),
    contact: Yup.string(),
    source: Yup.string(),
    category: Yup.string(),
    priority: Yup.string(),
    status: Yup.string()
});

const LeadForm = ({ initialValues, isSubmitting, onSubmit, onCancel, pipelines = [], stages = [] }) => {
    const [selectedPipeline, setSelectedPipeline] = useState(initialValues?.pipeline || null);
    const isEditing = !!initialValues;

    const { data: filtersResponse } = useGetFiltersQuery({ limit: 'all' });
    const filters = filtersResponse?.data?.items || [];
    const sources = filters.filter(filter => filter.type === 'source');
    const categories = filters.filter(filter => filter.type === 'category');
    const statuses = filters.filter(filter => filter.type === 'status');

    // Fixed priority options instead of dynamic
    const priorityOptions = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' }
    ];

    const { data: contactsResponse } = useGetContactsQuery({ limit: 'all' });
    const contacts = contactsResponse?.data?.items || [];

    const leadStages = stages.filter(stage =>
        stage.type === 'lead' && (!selectedPipeline || stage.pipeline === selectedPipeline)
    );

    useEffect(() => {
        if (initialValues?.pipeline) {
            setSelectedPipeline(initialValues.pipeline);
        }
    }, [initialValues]);

    const handlePipelineChange = (value, _option, form) => {
        const { setFieldValue } = form;
        setSelectedPipeline(value);

        if (stages.length > 0) {
            const defaultLeadStage = stages.find(
                stage => stage.pipeline === value && stage.type === 'lead' && stage.is_default === true
            );

            if (defaultLeadStage) {
                setFieldValue('stage', defaultLeadStage.id);
            } else {
                const anyLeadStage = stages.find(
                    stage => stage.pipeline === value && stage.type === 'lead'
                );
                setFieldValue('stage', anyLeadStage ? anyLeadStage.id : undefined);
            }
        } else {
            setFieldValue('stage', undefined);
        }
    };

    const getLeadFields = () => {
        const fields = [
            {
                name: 'leadTitle',
                label: 'Lead Title',
                type: 'text',
                placeholder: 'Enter lead title',
                rules: [{ required: true, message: 'Please enter lead title' }],
                span: 12
            },
            {
                name: 'leadValue',
                label: 'Lead Value',
                type: 'number',
                placeholder: 'Enter lead value',
                rules: [{ required: true, message: 'Please enter lead value' }],
                min: 0,
                addonBefore: '₹',
                formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                parser: value => value.replace(/\₹\s?|(,*)/g, ''),
                span: 12
            },
            {
                name: 'pipeline',
                label: 'Pipeline',
                type: 'select',
                placeholder: 'Select Pipeline',
                rules: [{ required: true, message: 'Please select pipeline' }],
                options: pipelines.map(p => ({ label: p.name, value: p.id })),
                onChange: handlePipelineChange,
                showSearch: true,
                optionFilterProp: 'children',
                span: 12
            }
        ];

        if (isEditing) {
            fields.push({
                name: 'stage',
                label: 'Stage',
                type: 'select',
                placeholder: 'Select Stage',
                rules: [{ required: true, message: 'Please select stage' }],
                options: leadStages.map(s => ({ label: s.name, value: s.id })),
                disabled: !selectedPipeline,
                showSearch: true,
                optionFilterProp: 'children',
                span: 12
            });

            fields.push(
                {
                    name: 'priority',
                    label: 'Priority',
                    type: 'select',
                    placeholder: 'Select Priority',
                    options: priorityOptions,
                    showSearch: true,
                    optionFilterProp: 'children',
                    allowClear: true,
                    span: 12
                },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    placeholder: 'Select Status',
                    options: statuses.map(s => ({ label: s.name, value: s.id })),
                    showSearch: true,
                    optionFilterProp: 'children',
                    allowClear: true,
                    span: 12
                }
            );
        } else {
            fields.push({
                name: 'stage',
                type: 'text',
                style: { display: 'none' },
                span: 0
            });
        }

        fields.push(
            {
                name: 'source',
                label: 'Source',
                type: 'select',
                placeholder: 'Select Source',
                rules: !isEditing ? [{ required: true, message: 'Please select source' }] : [],
                options: sources.map(s => ({ label: s.name, value: s.id })),
                showSearch: true,
                optionFilterProp: 'children',
                allowClear: isEditing,
                span: 12
            },
            {
                name: 'category',
                label: 'Category',
                type: 'select',
                placeholder: 'Select Category',
                rules: !isEditing ? [{ required: true, message: 'Please select category' }] : [],
                options: categories.map(c => ({ label: c.name, value: c.id })),
                showSearch: true,
                optionFilterProp: 'children',
                allowClear: isEditing,
                span: 12
            }
        );

        fields.push({
            name: 'contact',
            label: isEditing ? 'Contact' : 'Associated Contact',
            type: 'select',
            placeholder: 'Select Contact',
            options: contacts.map(c => ({ label: c.name, value: c.id })),
            showSearch: true,
            optionFilterProp: 'children',
            allowClear: true,
            span: isEditing ? 24 : 12
        });

        return fields;
    };

    const handleSubmit = async (values) => {
        try {
            const payload = { ...values };

            if (!payload.stage && payload.pipeline) {
                const defaultStage = stages.find(
                    stage => stage.pipeline === payload.pipeline &&
                        stage.type === 'lead' &&
                        stage.is_default === true
                ) ||
                    stages.find(
                        stage => stage.pipeline === payload.pipeline &&
                            stage.type === 'lead'
                    ) ||
                    stages.find(
                        stage => stage.pipeline === payload.pipeline
                    );

                if (defaultStage) {
                    payload.stage = defaultStage.id;
                }
            }

            if (!payload.stage) {
                throw new Error("No valid stage found for the selected pipeline");
            }

            onSubmit(payload);
        } catch (error) {
            console.error("Error in lead form submission:", error);
        }
    };

    return (
        <AdvancedForm
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            fields={getLeadFields()}
            validationSchema={validationSchema}
            submitButtonText={isEditing ? 'Update Lead' : 'Create Lead'}
        />
    );
};

export default LeadForm; 