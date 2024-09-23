const { Pool } = require('pg');
const pool = new Pool({
    user: 'lakbay',
    host: 'localhost',
    database: 'lakbay',
    password: 'lakbayKK!',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}