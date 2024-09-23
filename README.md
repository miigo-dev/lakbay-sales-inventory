# React Sales Inventory

This project is a sales inventory management system built with React for the frontend and Node.js with Express for the backend. It uses PostgreSQL as the database.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed on your machine.
- PostgreSQL installed and running.
- A PostgreSQL database created with the necessary tables.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/react-sales-inventory.git
    cd react-sales-inventory
    ```

2. Install the backend dependencies:
    ```sh
    cd server
    npm install
    ```

3. Install the frontend dependencies:
    ```sh
    cd ../client
    npm install
    ```

## Configuration

1. Configure the PostgreSQL connection in `server/index.js`:
    ```javascript
    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'your-username',
        host: 'localhost',
        database: 'your-database',
        password: 'your-password',
        port: 5432,
    });

    module.exports = {
        query: (text, params) => pool.query(text, params)
    }
    ```

2. Create a `.env` file in the `server` directory and add your environment variables:
    ```env
    PORT=5000
    SECRET=your_jwt_secret
    ```

## Running the Project

1. Start the backend server:
    ```sh
    cd server
    npm start
    ```

This project is licensed under the MIT License. See the `LICENSE` file for more information.
