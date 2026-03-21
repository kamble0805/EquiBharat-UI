require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
});

async function checkTable() {
    try {
        const [rows] = await pool.query("SHOW TABLES LIKE 'holidays'");
        if (rows.length > 0) {
            console.log("Table 'holidays' exists");
            const [data] = await pool.query("SELECT * FROM holidays LIMIT 5");
            console.log("Sample data:", data);
        } else {
            console.log("Table 'holidays' DOES NOT exist");
        }
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkTable();
