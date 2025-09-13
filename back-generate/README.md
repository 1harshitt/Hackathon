# Backend Generator

A powerful tool for generating backend code with Express.js and Sequelize. This generator allows you to quickly create models, controllers, routes, and middleware with various levels of complexity.

## Features

- **Basic Generator**: Creates simple CRUD operations
- **Advanced Generator**: Includes validation, pagination, and error handling
- **Project Generator**: Creates a full project with multiple models and relationships
- **CLI Interface**: Interactive command-line interface for easy code generation
- **API Endpoints**: RESTful API for programmatic code generation
- **Customizable Templates**: Easily modify the generated code to fit your needs

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/backend-generator.git

# Navigate to the project directory
cd backend-generator

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
```

## Usage

### CLI Interface

The CLI interface provides an interactive way to generate code:

```bash
# Run the CLI
npm run cli
```

The CLI will guide you through the process of selecting a generator type and defining your models and fields.

#### Basic Generator

The basic generator creates simple CRUD operations:

```bash
# Generate basic files
npm run generate:basic
```

#### Advanced Generator

The advanced generator includes validation, pagination, and error handling:

```bash
# Generate advanced files
npm run generate:advanced
```

### API Interface

The API interface allows you to generate code programmatically:

```bash
# Start the API server
npm start
```

#### API Endpoints

- `GET /`: API documentation
- `POST /api/generate/basic`: Generate basic CRUD files
- `POST /api/generate/advanced`: Generate advanced files with validation and pagination
- `POST /api/generate/project`: Generate a full project with multiple models

#### Example Request

```javascript
// Generate basic files
fetch('http://localhost:3000/api/generate/basic', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    modelName: 'user',
    fields: [
      { name: 'username', type: 'STRING', required: true, unique: true },
      { name: 'email', type: 'STRING', required: true, unique: true },
      { name: 'password', type: 'STRING', required: true },
      { name: 'isActive', type: 'BOOLEAN', required: false, defaultValue: true }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Generated Code Structure

### Basic Generator

The basic generator creates the following files:

- **Model**: Defines the database schema using Sequelize
- **Controller**: Contains CRUD operations
- **Routes**: Sets up the API endpoints

### Advanced Generator

The advanced generator creates the following files:

- **Model**: Defines the database schema with validation and hooks
- **Controller**: Contains CRUD operations with pagination and error handling
- **Middleware**: Includes validation middleware
- **Routes**: Sets up the API endpoints with middleware
- **Database Config**: Configures the database connection
- **Server**: Sets up the Express server

## Customization

You can customize the generated code by modifying the templates in the `src/generator` directory:

- `basicGenerator.js`: Templates for basic CRUD operations
- `advancedGenerator.js`: Templates for advanced features

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
NODE_ENV=development

# Database configuration
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_DIALECT=mysql
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. 