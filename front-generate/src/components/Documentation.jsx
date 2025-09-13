import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCode, faServer, faDatabase, faWrench, faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';

const Documentation = () => {
    return (
        <Container className="py-5">
            <Row className="mb-4">
                <Col>
                    <h1 className="mb-4">Documentation</h1>
                    <p className="lead">
                        Learn how to use the Backend Generator to create production-ready backend code in seconds.
                    </p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2>
                                <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
                                Getting Started
                            </h2>
                            <p>
                                The Backend Generator allows you to quickly generate backend code for your projects.
                                Simply define your models and their fields, and the generator will create all the necessary
                                files for a fully functional backend.
                            </p>
                            <h5 className="mt-4">Generation Types</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Best For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Basic</td>
                                        <td>Simple CRUD operations with minimal setup</td>
                                        <td>Quick prototypes, simple applications</td>
                                    </tr>
                                    <tr>
                                        <td>Advanced</td>
                                        <td>Full CRUD with validation, pagination, and error handling</td>
                                        <td>Production applications, complex data models</td>
                                    </tr>
                                    <tr>
                                        <td>Project</td>
                                        <td>Multiple models with relationships and complete project structure</td>
                                        <td>Full backend applications, multi-model systems</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2>
                                <FontAwesomeIcon icon={faDatabase} className="me-2 text-primary" />
                                Model Definition
                            </h2>
                            <p>
                                Start by defining your model name (e.g., "task", "user", "product"). Then add fields
                                with their types and constraints. The generator supports the following field types:
                            </p>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Example Use</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>STRING</code></td>
                                        <td>For short text</td>
                                        <td>Names, emails, titles</td>
                                    </tr>
                                    <tr>
                                        <td><code>TEXT</code></td>
                                        <td>For longer text content</td>
                                        <td>Descriptions, articles, comments</td>
                                    </tr>
                                    <tr>
                                        <td><code>INTEGER</code></td>
                                        <td>For whole numbers</td>
                                        <td>Ages, counts, IDs</td>
                                    </tr>
                                    <tr>
                                        <td><code>FLOAT</code></td>
                                        <td>For decimal numbers</td>
                                        <td>Prices, ratings, measurements</td>
                                    </tr>
                                    <tr>
                                        <td><code>BOOLEAN</code></td>
                                        <td>For true/false values</td>
                                        <td>Status flags, toggles</td>
                                    </tr>
                                    <tr>
                                        <td><code>DATE</code></td>
                                        <td>For date and time</td>
                                        <td>Created at, updated at, deadlines</td>
                                    </tr>
                                    <tr>
                                        <td><code>ENUM</code></td>
                                        <td>For predefined options</td>
                                        <td>Status (active, inactive), roles</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <p className="mt-3">
                                For each field, you can specify if it's required and provide enum values if applicable.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2>
                                <FontAwesomeIcon icon={faCode} className="me-2 text-primary" />
                                Generated Code
                            </h2>
                            <h5 className="mt-3">Basic Generator</h5>
                            <p>Creates simple CRUD operations with:</p>
                            <ul>
                                <li><strong>Model</strong>: Sequelize model definition</li>
                                <li><strong>Controller</strong>: Basic CRUD operations</li>
                                <li><strong>Routes</strong>: RESTful API endpoints</li>
                            </ul>

                            <h5 className="mt-4">Advanced Generator</h5>
                            <p>Includes everything from the basic generator plus:</p>
                            <ul>
                                <li><strong>Validation</strong>: Input validation middleware</li>
                                <li><strong>Pagination</strong>: Paginated list endpoints</li>
                                <li><strong>Error Handling</strong>: Robust error handling</li>
                                <li><strong>Filtering</strong>: Query parameter filtering</li>
                                <li><strong>Hooks</strong>: Model lifecycle hooks</li>
                            </ul>

                            <h5 className="mt-4">Project Generator</h5>
                            <p>Creates a complete project structure with:</p>
                            <ul>
                                <li><strong>Multiple Models</strong>: With relationships</li>
                                <li><strong>Config</strong>: Database and server configuration</li>
                                <li><strong>Middleware</strong>: Authentication, validation, error handling</li>
                                <li><strong>Utils</strong>: Helper functions and utilities</li>
                                <li><strong>Tests</strong>: Basic test setup</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2>
                                <FontAwesomeIcon icon={faServer} className="me-2 text-primary" />
                                API Usage
                            </h2>
                            <p>
                                You can also use the generator programmatically via its API endpoints:
                            </p>

                            <h5 className="mt-4">Basic Generator</h5>
                            <pre className="bg-light p-3 rounded">
                                {`fetch('http://localhost:3000/api/generate/basic', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    modelName: 'task',
    fields: [
      { name: 'title', type: 'STRING', required: true },
      { name: 'description', type: 'TEXT', required: false },
      { name: 'status', type: 'ENUM', required: true, values: ['pending', 'in_progress', 'completed'] }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
                            </pre>

                            <h5 className="mt-4">Advanced Generator</h5>
                            <pre className="bg-light p-3 rounded">
                                {`fetch('http://localhost:3000/api/generate/advanced', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    modelName: 'user',
    fields: [
      { name: 'username', type: 'STRING', required: true },
      { name: 'email', type: 'STRING', required: true },
      { name: 'password', type: 'STRING', required: true },
      { name: 'role', type: 'ENUM', required: true, values: ['user', 'admin'] }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
                            </pre>

                            <h5 className="mt-4">Project Generator</h5>
                            <pre className="bg-light p-3 rounded">
                                {`fetch('http://localhost:3000/api/generate/project', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    models: [
      {
        modelName: 'user',
        fields: [
          { name: 'username', type: 'STRING', required: true },
          { name: 'email', type: 'STRING', required: true }
        ]
      },
      {
        modelName: 'post',
        fields: [
          { name: 'title', type: 'STRING', required: true },
          { name: 'content', type: 'TEXT', required: true },
          { name: 'userId', type: 'INTEGER', required: true }
        ]
      }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
                            </pre>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Documentation; 