# Backend Generator

A powerful tool to generate backend code based on your model definitions. This generator creates models, controllers, and routes following a standardized structure.

## Features

- Generate model files with Sequelize schema
- Generate controller files with validation and CRUD operations
- Generate route files with proper middleware setup
- Web UI for easy model definition
- API endpoint for programmatic generation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   TIMEZONE=UTC
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Usage

### Web UI

1. Open your browser and navigate to `http://localhost:3000/generator`
2. Enter your model name (e.g., "task")
3. Add fields with their types and constraints
4. Click "Generate Backend Code"
5. View the generated code in the preview tabs
6. The code is automatically saved to your project

### API Endpoint

You can also generate code programmatically by making a POST request to `/api/v1/generator`:

```javascript
fetch('http://localhost:3000/api/v1/generator', {
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
.then(data => console.log(data));
```

### CLI Usage

You can also generate code directly from the command line:

```
node src/generator/index.js task '[{"name":"title","type":"STRING","required":true},{"name":"description","type":"TEXT","required":false}]'
```

## Generated Structure

For each model, the generator creates:

- `src/models/[modelName]Model.js` - The Sequelize model definition
- `src/controllers/[modelName]Controller.js` - Controller with validation and CRUD operations
- `src/routes/[modelName]Routes.js` - Express route definitions

## Extending the Generator

You can extend the generator by modifying the template files in `src/generator/templates/`.

## License

This project is licensed under the MIT License. 