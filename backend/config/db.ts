import mysql from 'mysql2/promise';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'military_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
pool.getConnection()
  .then((connection) => {
    console.log('✅ MySQL Connection Successful!');
    console.log('🛡️ Indian Army CMD Database: MySQL pool initialized.');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ MySQL Connection Failed:', err.message);
    console.error('Please check your database credentials in the .env file');
    process.exit(1);
  });

// Export pool for use in routes
export default pool;
