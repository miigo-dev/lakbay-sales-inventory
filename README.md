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
    git clone https://github.com/miigo-dev/react-sales-inventory.git
    cd react-sales-inventory
    ```

2. Install the backend dependencies:
    ```sh
    cd server
    npm install
    ```

3. Install the frontend dependencies:
    ```sh
    cd client
    npm install
    ```

## Configuration

1. Create a `.env` file in the `server` directory and add your environment variables:
    ```env
    PORT = 8080
    SECRET = supersecret
    
    CLIENT_URL = http://localhost:3000
    SERVER_URL = http://localhost:8080

    DB_USER = user
    DB_HOST = host
    DB_DATABASE = db
    DB_PASSWORD = password
    DB_PORT = port
    ```

## Running the Project

1. Start the backend server:
    ```sh
    cd server
    npm run dev
    ```

2. Start the frontend development server:
    ```sh
    cd client
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000`.
