import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCopy, faCode, faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { generateBasicCode, downloadZip } from '../services/api';

const ModelGenerator = () => {
    const [modelName, setModelName] = useState('');
    const [fields, setFields] = useState([
        { name: '', type: 'STRING', required: false, values: '' }
    ]);
    const [previewCode, setPreviewCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');

    const fieldTypes = [
        'STRING', 'TEXT', 'INTEGER', 'FLOAT', 'BOOLEAN', 'DATE', 'ENUM'
    ];

    const addField = () => {
        setFields([...fields, { name: '', type: 'STRING', required: false, values: '' }]);
    };

    const removeField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const handleFieldChange = (index, field, value) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [field]: value };
        setFields(newFields);
    };

    const validateModel = () => {
        if (!modelName) {
            setAlertMessage('Please provide a model name');
            setAlertType('danger');
            return false;
        }

        if (fields.some(f => !f.name)) {
            setAlertMessage('All fields must have names');
            setAlertType('danger');
            return false;
        }

        if (fields.some(f => f.type === 'ENUM' && !f.values)) {
            setAlertMessage('ENUM fields must have values');
            setAlertType('danger');
            return false;
        }

        return true;
    };

    const generatePreview = async () => {
        if (!validateModel()) return;

        setIsGenerating(true);
        setAlertMessage(null);

        try {
            // Prepare the model data
            const modelData = {
                modelName,
                fields: fields.map(field => ({
                    name: field.name,
                    type: field.type,
                    required: field.required,
                    values: field.type === 'ENUM' ? field.values.split(',').map(v => v.trim()) : undefined
                }))
            };

            // Generate code
            const response = await generateBasicCode(modelData);

            // Set the preview code
            setPreviewCode(JSON.stringify(response.results, null, 2));
            setAlertMessage('Backend code generated successfully!');
            setAlertType('success');
        } catch (error) {
            console.error('Error generating code:', error);
            setAlertMessage(`Error generating code: ${error.message}`);
            setAlertType('danger');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(previewCode);
        setAlertMessage('Code copied to clipboard!');
        setAlertType('success');
    };

    const handleDownload = async () => {
        if (!validateModel()) return;

        try {
            const modelData = {
                modelName,
                fields: fields.map(field => ({
                    name: field.name,
                    type: field.type,
                    required: field.required,
                    values: field.type === 'ENUM' ? field.values.split(',').map(v => v.trim()) : undefined
                }))
            };

            await downloadZip(modelData);
            setAlertMessage('Backend code downloaded successfully!');
            setAlertType('success');
        } catch (error) {
            console.error('Error downloading files:', error);
            setAlertMessage(`Error downloading files: ${error.message}`);
            setAlertType('danger');
        }
    };

    return (
        <Container className="py-5">
            <Row className="mb-4">
                <Col>
                    <div className="hero-section text-center p-5 rounded shadow-sm">
                        <h1 className="display-4">Backend Code Generator</h1>
                        <p className="lead">
                            Generate production-ready backend code in seconds
                        </p>
                    </div>
                </Col>
            </Row>

            {alertMessage && (
                <Row className="mb-4">
                    <Col>
                        <Alert variant={alertType} onClose={() => setAlertMessage(null)} dismissible>
                            {alertMessage}
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Backend Generator</h4>
                            <p>
                                Generate a complete backend with models, controllers, and routes following the standard structure.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={6}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <h2 className="mb-4">Model Definition</h2>

                            <Form.Group className="mb-4">
                                <Form.Label>Model Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. User, Product, Task"
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                />
                            </Form.Group>

                            <h5 className="mb-3">Fields</h5>

                            {fields.map((field, index) => (
                                <div key={index} className="field-row mb-3 p-3 border rounded">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Field Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="e.g. name, email, price"
                                                    value={field.name}
                                                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Field Type</Form.Label>
                                                <Form.Select
                                                    value={field.type}
                                                    onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                                                >
                                                    {fieldTypes.map(type => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Required"
                                                checked={field.required}
                                                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                                            />
                                        </Col>

                                        <Col md={6}>
                                            {field.type === 'ENUM' && (
                                                <Form.Group>
                                                    <Form.Label>Enum Values (comma-separated)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="e.g. active, inactive, pending"
                                                        value={field.values}
                                                        onChange={(e) => handleFieldChange(index, 'values', e.target.value)}
                                                    />
                                                </Form.Group>
                                            )}
                                        </Col>
                                    </Row>

                                    <div className="text-end mt-2">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeField(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="d-flex justify-content-between">
                                <Button variant="outline-primary" onClick={addField}>
                                    <FontAwesomeIcon icon={faPlus} /> Add Field
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={generatePreview}
                                    disabled={!modelName || isGenerating}
                                >
                                    <FontAwesomeIcon icon={faCode} /> Generate Code
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-3">
                                <h5>
                                    Preview
                                    {previewCode && (
                                        <Badge bg="success" className="ms-2">Generated</Badge>
                                    )}
                                </h5>

                                {previewCode && (
                                    <div>
                                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={copyToClipboard}>
                                            <FontAwesomeIcon icon={faCopy} /> Copy
                                        </Button>
                                        <Button variant="outline-primary" size="sm" onClick={handleDownload}>
                                            <FontAwesomeIcon icon={faDownload} /> Download
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="preview-container border rounded" style={{ minHeight: '400px', maxHeight: '600px', overflow: 'auto' }}>
                                {previewCode ? (
                                    <SyntaxHighlighter language="javascript" style={docco} className="h-100">
                                        {previewCode}
                                    </SyntaxHighlighter>
                                ) : (
                                    <div className="text-center p-5 text-muted">
                                        <FontAwesomeIcon icon={faEye} size="3x" className="mb-3" />
                                        <p>Code preview will appear here after generation.</p>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ModelGenerator; 