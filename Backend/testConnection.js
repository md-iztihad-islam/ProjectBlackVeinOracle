import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DB_URI
});

async function testConnection() {
    console.log('Testing database connection...\n');
    
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL successfully!\n');
        
        // Test 1: Simple SELECT
        const result1 = await client.query('SELECT NOW() as current_time');
        console.log('Current Time:', result1.rows[0].current_time);
        
        // Test 2: Count tables
        const result2 = await client.query(`
            SELECT COUNT(*) as table_count 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `);
        console.log('Total Tables:', result2.rows[0].table_count);
        
        // Test 3: List all tables
        const result3 = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);
        console.log('\nTables in database:');
        result3.rows.forEach((row, i) => {
            console.log(`  ${i + 1}. ${row.table_name}`);
        });
        
        // Test 4: Sample data query (if data exists)
        const result4 = await client.query('SELECT * FROM thana LIMIT 3');
        if (result4.rows.length > 0) {
            console.log('\nSample data from thana table:');
            console.table(result4.rows);
        }
        
        client.release();
        console.log('\nDatabase connection test completed successfully!');
        
    } catch (error) {
        console.error('Database connection failed:', error.message);
    } finally {
        await pool.end();
    }
}

testConnection();
