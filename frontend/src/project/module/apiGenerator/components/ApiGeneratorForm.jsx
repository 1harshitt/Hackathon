import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Input, Button, Select, Switch, Space, Card, Divider, Tooltip } from 'antd';
import { PlusOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AdvancedForm from '../../../../components/AdvancedForm';

const { Option } = Select;

const validationSchema = Yup.object().shape({
    module_name: Yup.string()
        .required('Module name is required')
        .min(3, 'Module name must be at least 3 characters')
        .max(50, 'Module name must be less than 50 characters')
        .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, 'Module name must start with a letter and contain only letters and numbers'),
    fields: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required('Field name is required'),
                type: Yup.string().required('Field type is required'),
                allowNull: Yup.boolean(),
                unique: Yup.boolean(),
                enumValues: Yup.array().when('type', {
                    is: 'ENUM',
                    then: Yup.array().of(Yup.string()).min(1, 'At least one enum value is required'),
                    otherwise: Yup.array().nullable()
                })
            })
        )
        .min(1, 'At least one field is required')
});

const ApiGeneratorForm = ({ initialValues, isSubmitting, onSubmit, onCancel }) => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState(initialValues?.fields || [{ name: '', type: 'STRING', allowNull: true, unique: false }]);

    const handleFieldChange = (index, key, value) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [key]: value };
        
        // Reset enumValues if type is not ENUM
        if (key === 'type' && value !== 'ENUM') {
            newFields[index].enumValues = undefined;
        }
        
        setFields(newFields);
        form.setFieldsValue({ fields: newFields });
    };

    const addField = () => {
        const newFields = [...fields, { name: '', type: 'STRING', allowNull: true, unique: false }];
        setFields(newFields);
        form.setFieldsValue({ fields: newFields });
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
        form.setFieldsValue({ fields: newFields });
    };

    const addEnumValue = (fieldIndex) => {
        const newFields = [...fields];
        if (!newFields[fieldIndex].enumValues) {
            newFields[fieldIndex].enumValues = [];
        }
        newFields[fieldIndex].enumValues.push('');
        setFields(newFields);
        form.setFieldsValue({ fields: newFields });
    };

    const removeEnumValue = (fieldIndex, valueIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex].enumValues = newFields[fieldIndex].enumValues.filter((_, i) => i !== valueIndex);
        setFields(newFields);
        form.setFieldsValue({ fields: newFields });
    };

    const handleEnumValueChange = (fieldIndex, valueIndex, value) => {
        const newFields = [...fields];
        newFields[fieldIndex].enumValues[valueIndex] = value;
        setFields(newFields);
        form.setFieldsValue({ fields: newFields });
    };

    const handleSubmit = (values) => {
        // Process form values before submitting
        const processedValues = {
            ...values,
            fields: values.fields.map(field => ({
                ...field,
                // Convert enumValues to array if it's a string
                enumValues: field.type === 'ENUM' ? 
                    (Array.isArray(field.enumValues) ? field.enumValues : []) : 
                    undefined
            })),
            requirements: {
                authentication: values.authentication !== false, // Default to true
                openRoutes: values.openRoutes || []
            }
        };
        
        onSubmit(processedValues);
    };

    // Prepare initial values for the form
    const formInitialValues = initialValues ? {
        ...initialValues,
        authentication: initialValues.requirements?.authentication !== false, // Default to true
        openRoutes: initialValues.requirements?.openRoutes || []
    } : {
        module_name: '',
        fields: [{ name: '', type: 'STRING', allowNull: true, unique: false }],
        authentication: true,
        openRoutes: []
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={formInitialValues}
            onFinish={handleSubmit}
            className="api-generator-form"
        >
            <Form.Item
                name="module_name"
                label="Module Name"
                rules={[
                    { required: true, message: 'Please enter module name' },
                    { min: 3, message: 'Module name must be at least 3 characters' },
                    { max: 50, message: 'Module name must be less than 50 characters' },
                    { pattern: /^[a-zA-Z][a-zA-Z0-9]*$/, message: 'Module name must start with a letter and contain only letters and numbers' }
                ]}
            >
                <Input placeholder="Enter module name (e.g. product)" />
            </Form.Item>

            <Divider orientation="left">Fields</Divider>
            
            <Form.List name="fields">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card 
                                key={key} 
                                className="field-card"
                                title={`Field ${name + 1}`}
                                extra={
                                    <Button 
                                        type="text" 
                                        danger 
                                        icon={<MinusCircleOutlined />} 
                                        onClick={() => removeField(name)}
                                        disabled={fields.length === 1}
                                    >
                                        Remove
                                    </Button>
                                }
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    label="Field Name"
                                    rules={[{ required: true, message: 'Please enter field name' }]}
                                >
                                    <Input 
                                        placeholder="Enter field name" 
                                        onChange={(e) => handleFieldChange(name, 'name', e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'type']}
                                    label="Field Type"
                                    rules={[{ required: true, message: 'Please select field type' }]}
                                >
                                    <Select 
                                        placeholder="Select field type"
                                        onChange={(value) => handleFieldChange(name, 'type', value)}
                                    >
                                        <Option value="STRING">String</Option>
                                        <Option value="INTEGER">Integer</Option>
                                        <Option value="FLOAT">Float</Option>
                                        <Option value="BOOLEAN">Boolean</Option>
                                        <Option value="TEXT">Text</Option>
                                        <Option value="DATE">Date</Option>
                                        <Option value="JSON">JSON</Option>
                                        <Option value="ENUM">Enum</Option>
                                    </Select>
                                </Form.Item>

                                <Space>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'allowNull']}
                                        valuePropName="checked"
                                        label={
                                            <span>
                                                Allow Null
                                                <Tooltip title="If checked, this field can be null">
                                                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                                                </Tooltip>
                                            </span>
                                        }
                                    >
                                        <Switch 
                                            onChange={(checked) => handleFieldChange(name, 'allowNull', checked)}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'unique']}
                                        valuePropName="checked"
                                        label={
                                            <span>
                                                Unique
                                                <Tooltip title="If checked, this field must be unique">
                                                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                                                </Tooltip>
                                            </span>
                                        }
                                    >
                                        <Switch 
                                            onChange={(checked) => handleFieldChange(name, 'unique', checked)}
                                        />
                                    </Form.Item>
                                </Space>

                                {/* Enum Values */}
                                {form.getFieldValue(['fields', name, 'type']) === 'ENUM' && (
                                    <div className="enum-values">
                                        <Divider orientation="left">Enum Values</Divider>
                                        
                                        <Form.List name={[name, 'enumValues']}>
                                            {(enumFields, { add: addEnum, remove: removeEnum }) => (
                                                <>
                                                    {enumFields.map(({ key: enumKey, name: enumName, ...restEnumField }) => (
                                                        <Form.Item
                                                            key={enumKey}
                                                            {...restEnumField}
                                                            name={[enumName]}
                                                            rules={[{ required: true, message: 'Please enter enum value' }]}
                                                        >
                                                            <Input 
                                                                placeholder="Enter enum value"
                                                                addonAfter={
                                                                    <MinusCircleOutlined
                                                                        onClick={() => removeEnumValue(name, enumName)}
                                                                        style={{ color: 'red' }}
                                                                    />
                                                                }
                                                                onChange={(e) => handleEnumValueChange(name, enumName, e.target.value)}
                                                            />
                                                        </Form.Item>
                                                    ))}
                                                    
                                                    <Form.Item>
                                                        <Button 
                                                            type="dashed" 
                                                            onClick={() => addEnumValue(name)} 
                                                            block 
                                                            icon={<PlusOutlined />}
                                                        >
                                                            Add Enum Value
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                )}
                            </Card>
                        ))}
                        
                        <Form.Item>
                            <Button 
                                type="dashed" 
                                onClick={addField} 
                                block 
                                icon={<PlusOutlined />}
                            >
                                Add Field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Divider orientation="left">API Settings</Divider>

            <Form.Item
                name="authentication"
                valuePropName="checked"
                label="Require Authentication"
            >
                <Switch defaultChecked />
            </Form.Item>

            <Form.Item
                name="openRoutes"
                label="Open Routes (No Authentication Required)"
            >
                <Select 
                    mode="multiple" 
                    placeholder="Select open routes"
                    disabled={!form.getFieldValue('authentication')}
                >
                    <Option value="getAll">GET (List All)</Option>
                    <Option value="getById">GET By ID</Option>
                    <Option value="create">Create</Option>
                    <Option value="update">Update</Option>
                    <Option value="delete">Delete</Option>
                </Select>
            </Form.Item>

            <Form.Item className="form-actions">
                <Space>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        {initialValues ? 'Update API' : 'Create API'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ApiGeneratorForm; 