import React from 'react';
import * as Yup from 'yup';
import { useGetPipelinesQuery } from '../../../../../../config/api/apiServices';
import AdvancedForm from '../../../../../../components/AdvancedForm';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Stage name is required'),
    pipeline_id: Yup.string().required('Pipeline is required'),
    type: Yup.string().required('Stage type is required'),
    is_default: Yup.boolean()
});

const StageForm = ({ initialValues, onSubmit, onCancel, loading }) => {
    const { data: pipelinesResponse, isLoading: isPipelinesLoading } = useGetPipelinesQuery({
        limit: 100
    }, {
        refetchOnMountOrArgChange: true
    });

    const pipelines = pipelinesResponse?.data?.items || [];

    const getStageFields = () => {
        return [
            {
                name: 'name',
                label: 'Stage Name',
                type: 'text',
                placeholder: 'Enter stage name',
                rules: [{ required: true, message: 'Please enter stage name' }],
                span: 24
            },
            {
                name: 'pipeline_id',
                label: 'Pipeline',
                type: 'select',
                placeholder: 'Select pipeline',
                rules: [{ required: true, message: 'Please select a pipeline' }],
                options: pipelines.map(p => ({ label: p.name, value: p.id })),
                loading: isPipelinesLoading,
                disabled: isPipelinesLoading || pipelines.length === 0,
                span: 12
            },
            {
                name: 'type',
                label: 'Stage Type',
                type: 'select',
                placeholder: 'Select stage type',
                rules: [{ required: true, message: 'Please select stage type' }],
                options: [
                    { label: 'Lead', value: 'lead' },
                    { label: 'Proposal', value: 'proposal' }
                ],
                span: 12
            },
            {
                name: 'is_default',
                label: 'Set as default stage',
                type: 'checkbox',
                span: 24
            }
        ];
    };

    const handleSubmit = (values) => {
        const formData = {
            ...values,
            pipeline: values.pipeline_id,
        };

        delete formData.pipeline_id;

        onSubmit(formData);
    };

    return (
        <AdvancedForm
            initialValues={initialValues ? {
                ...initialValues,
                pipeline_id: initialValues.pipeline,
            } : undefined}
            isSubmitting={loading}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            fields={getStageFields()}
            validationSchema={validationSchema}
            submitButtonText={initialValues ? 'Update Stage' : 'Create Stage'}
        />
    );
};

export default StageForm; 