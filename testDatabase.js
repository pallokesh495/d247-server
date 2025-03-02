const pool = require('./config/db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connection successful:', res.rows[0]);
    }
    pool.end(); // Close the connection
});