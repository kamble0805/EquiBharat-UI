import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,

    // Pool settings
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    // Keep-alive to prevent Hostinger from closing idle connections
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,

    // Timeouts
    connectTimeout: 10000,

    // Timezone – store and retrieve as IST (Indian Standard Time)
    timezone: '+05:30',
});

export default pool;
