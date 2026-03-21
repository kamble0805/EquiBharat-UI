import pool from '../src/lib/db';

async function checkTable() {
    try {
        const [rows]: any = await pool.query("SHOW TABLES LIKE 'holidays'");
        if (rows.length > 0) {
            console.log("Table 'holidays' exists");
            const [data]: any = await pool.query("SELECT * FROM holidays LIMIT 5");
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
