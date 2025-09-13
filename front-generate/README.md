# Backend Code Generator - Frontend

This is the frontend application for the Backend Code Generator system. It provides a user-friendly interface for generating backend code components such as models, controllers, and routes.

## Features

- Interactive UI for defining data models
- Field type selection with support for various data types
- Preview generated code in real-time
- Download generated code files
- Documentation on how to use the generator

## Tech Stack

- React with Vite
- React Bootstrap for UI components
- React Router for navigation
- Axios for API communication
- FontAwesome for icons
- React Syntax Highlighter for code display

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd front-generate
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the application for production:

```bash
npm run build
```

The build files will be in the `dist` directory.

## API Integration

The frontend communicates with the backend API to generate code. The API endpoints are:

- `POST /api/v1/generator` - Generate code based on model definition
- `POST /api/v1/generator/download` - Download generated code as a ZIP file

## License

MIT
 