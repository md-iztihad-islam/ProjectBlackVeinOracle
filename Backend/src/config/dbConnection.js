import { Pool } from 'pg';
import { DB_URI } from './serverConfig.js';

const pool = new Pool({
    connectionString: DB_URI,
    ssl: {
        rejectUnauthorized: false
    }
})

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        client.query('SELECT NOW()');
        client.release();
        console.log('Database connected successfully');
        return pool;
    } catch (error) {
        console.log('Database connection failed:', error);
        return null;
    }
}

export default pool;