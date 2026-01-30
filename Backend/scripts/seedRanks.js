import pool from '../src/config/dbConnection.js';

const ranksData = [
    { rank_code: 'constable', rank_name: 'Constable', level: 1 },
    { rank_code: 'sergeant', rank_name: 'Sergeant', level: 2 },
    { rank_code: 'asi', rank_name: 'Assistant Sub-Inspector', level: 3 },
    { rank_code: 'si', rank_name: 'Sub-Inspector', level: 4 },
    { rank_code: 'inspector', rank_name: 'Inspector', level: 5 },
    { rank_code: 'oc', rank_name: 'Officer-in-Charge', level: 6 },
    { rank_code: 'dsp', rank_name: 'Deputy Superintendent of Police', level: 7 },
    { rank_code: 'addl_sp', rank_name: 'Additional Superintendent of Police', level: 8 },
    { rank_code: 'sp', rank_name: 'Superintendent of Police', level: 9 },
    { rank_code: 'ac', rank_name: 'Assistant Commissioner', level: 10 },
    { rank_code: 'dc', rank_name: 'Deputy Commissioner', level: 11 },
    { rank_code: 'addl_dc', rank_name: 'Additional Deputy Commissioner', level: 12 },
    { rank_code: 'jc', rank_name: 'Joint Commissioner', level: 13 },
    { rank_code: 'dig', rank_name: 'Deputy Inspector General', level: 14 },
    { rank_code: 'addl_dig', rank_name: 'Additional Deputy Inspector General', level: 15 },
    { rank_code: 'addl_cp', rank_name: 'Additional Commissioner of Police', level: 16 },
    { rank_code: 'cp', rank_name: 'Commissioner of Police', level: 17 },
    { rank_code: 'ig', rank_name: 'Inspector General of Police', level: 18 }
];

const seedRanks = async () => {
    const client = await pool.connect();
    
    try {
        console.log(`Inserting ${ranksData.length} ranks into database...\n`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const rank of ranksData) {
            try {
                const query = `
                    INSERT INTO rank (rank_code, rank_name, level)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (rank_code) DO NOTHING
                    RETURNING rank_code, rank_name, level;
                `;
                
                const result = await client.query(query, [
                    rank.rank_code,
                    rank.rank_name,
                    rank.level
                ]);
                
                if (result.rows.length > 0) {
                    console.log(`✅ Level ${result.rows[0].level}: ${result.rows[0].rank_name} (${result.rows[0].rank_code})`);
                    successCount++;
                } else {
                    console.log(`⚠️  Skipped (already exists): ${rank.rank_name}`);
                }
                
            } catch (error) {
                console.error(`❌ Failed to insert ${rank.rank_name}:`, error.message);
                errorCount++;
            }
        }
        
        console.log(`\n📊 Summary:`);
        console.log(`   Inserted: ${successCount}`);
        console.log(`   Skipped: ${ranksData.length - successCount - errorCount}`);
        console.log(`   Failed: ${errorCount}`);
        console.log(`   Total: ${ranksData.length}`);
        
        // Show all ranks in database
        const allRanks = await client.query('SELECT rank_code, rank_name, level FROM rank ORDER BY level');
        console.log(`\n👮 Rank Hierarchy:\n`);
        allRanks.rows.forEach(rank => {
            console.log(`   Level ${rank.level.toString().padStart(2)}: ${rank.rank_name} (${rank.rank_code})`);
        });
        
        console.log('\n✅ Rank data seeded successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

seedRanks()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });