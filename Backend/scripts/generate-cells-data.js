import pool from '../src/config/dbConnection.js';

const generateCellBlocksAndCells = async () => {
    const client = await pool.connect();
    
    try {
        console.log('Generating cell blocks and cells for all jails...\n');
        
        // Get all jails
        const jailsResult = await client.query('SELECT jail_id, jail_name, capacity FROM jail ORDER BY jail_id');
        const jails = jailsResult.rows;
        
        console.log(`Found ${jails.length} jails\n`);
        
        let totalBlocks = 0;
        let totalCells = 0;
        
        for (const jail of jails) {
            console.log(`\n🏛️  Processing: ${jail.jail_name} (Capacity: ${jail.capacity})`);
            
            // Check if blocks already exist for this jail
            const existingBlocksCheck = await client.query(
                'SELECT COUNT(*) as count FROM cell_block WHERE jail_id = $1',
                [jail.jail_id]
            );
            
            if (existingBlocksCheck.rows[0].count > 0) {
                console.log(`  ⏭️  Skipping - ${existingBlocksCheck.rows[0].count} blocks already exist`);
                continue;
            }
            
            // Determine number of blocks based on jail capacity
            let numBlocks;
            if (jail.capacity >= 3000) {
                numBlocks = 8; // Large jails: 8 blocks
            } else if (jail.capacity >= 1500) {
                numBlocks = 6; // Medium-large jails: 6 blocks
            } else if (jail.capacity >= 800) {
                numBlocks = 4; // Medium jails: 4 blocks
            } else {
                numBlocks = 3; // Small jails: 3 blocks
            }
            
            const blockCapacity = Math.floor(jail.capacity / numBlocks);
            
            // Insert blocks
            for (let i = 1; i <= numBlocks; i++) {
                const blockName = `Block ${String.fromCharCode(64 + i)}`; // Block A, Block B, etc.
                
                const blockResult = await client.query(`
                    INSERT INTO cell_block (jail_id, block_name, capacity)
                    VALUES ($1, $2, $3)
                    RETURNING block_id, block_name, capacity
                `, [jail.jail_id, blockName, blockCapacity]);
                
                const block = blockResult.rows[0];
                totalBlocks++;
                
                console.log(`  ✅ ${block.block_name} (ID: ${block.block_id}, Capacity: ${block.capacity})`);
                
                // Determine cells per block
                // Each cell holds 4-8 people on average
                const avgPeoplePerCell = 6;
                const numCells = Math.floor(blockCapacity / avgPeoplePerCell);
                
                // Insert cells for this block
                for (let j = 1; j <= numCells; j++) {
                    const cellNumber = `${String.fromCharCode(64 + i)}${j.toString().padStart(2, '0')}`; // A01, A02, etc.
                    const cellCapacity = Math.floor(Math.random() * 5) + 4; // 4-8 people per cell
                    
                    // Random status distribution: 70% available, 20% occupied, 10% maintenance
                    const rand = Math.random();
                    let status, numPeople;
                    
                    if (rand < 0.7) {
                        status = 'available';
                        numPeople = 0;
                    } else if (rand < 0.9) {
                        status = 'occupied';
                        numPeople = Math.floor(Math.random() * cellCapacity) + 1;
                    } else {
                        status = 'maintenance';
                        numPeople = 0;
                    }
                    
                    await client.query(`
                        INSERT INTO cell (block_id, cell_number, capacity, status, number_of_people)
                        VALUES ($1, $2, $3, $4, $5)
                    `, [block.block_id, cellNumber, cellCapacity, status, numPeople]);
                    
                    totalCells++;
                }
                
                console.log(`     ↳ Created ${numCells} cells`);
            }
        }
        
        console.log('\n\n📊 Summary:');
        console.log(`   Total Jails: ${jails.length}`);
        console.log(`   Total Blocks: ${totalBlocks}`);
        console.log(`   Total Cells: ${totalCells}`);
        
        // Statistics
        const stats = await client.query(`
            SELECT 
                COUNT(DISTINCT j.jail_id) as total_jails,
                COUNT(DISTINCT cb.block_id) as total_blocks,
                COUNT(c.cell_id) as total_cells,
                SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END) as available_cells,
                SUM(CASE WHEN c.status = 'occupied' THEN 1 ELSE 0 END) as occupied_cells,
                SUM(CASE WHEN c.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_cells,
                SUM(c.number_of_people) as total_inmates
            FROM jail j
            LEFT JOIN cell_block cb ON j.jail_id = cb.jail_id
            LEFT JOIN cell c ON cb.block_id = c.block_id
        `);
        
        console.log('\n📈 Database Statistics:');
        console.log(`   Available Cells: ${stats.rows[0].available_cells}`);
        console.log(`   Occupied Cells: ${stats.rows[0].occupied_cells}`);
        console.log(`   Under Maintenance: ${stats.rows[0].maintenance_cells}`);
        console.log(`   Total Inmates: ${stats.rows[0].total_inmates}`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        client.release();
        await pool.end();
    }
};

generateCellBlocksAndCells();