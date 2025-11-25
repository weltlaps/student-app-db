const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432, // Changed from 5433 to 5432
    user: process.env.DB_USER || 'student_admin',
    password: process.env.DB_PASSWORD || 'student_pass_123',
    database: process.env.DB_NAME || 'student_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

pool.on('acquire', () => {
    console.log('🔗 Client acquired from pool');
});

// Helper function to execute queries
async function query(text, params) {
    const start = Date.now();
    try {
        console.log(`📝 Executing query: ${text}`, params || '');
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`✅ Query executed successfully in ${duration}ms, rows: ${res.rowCount}`);
        return res;
    } catch (error) {
        console.error('❌ Database query error:', error);
        throw error;
    }
}

// Test connection on startup
async function testConnection() {
    try {
        const result = await query('SELECT NOW() as current_time');
        console.log('📊 Database connection test successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
        return false;
    }
}

module.exports = {
    query,
    pool,
    testConnection
};
