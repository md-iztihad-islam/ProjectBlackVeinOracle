import pool from '../src/config/dbConnection.js';
import bcrypt from 'bcryptjs';

const generateOfficers = async () => {
    // Get all thana IDs from database
    const thanasResult = await pool.query('SELECT thana_id FROM thana ORDER BY thana_id');
    const thanas = thanasResult.rows.map(row => row.thana_id);
    
    if (thanas.length === 0) {
        console.error('❌ No thanas found. Please seed thanas first.');
        process.exit(1);
    }
    
    const ranks = [
        'constable', 'si', 'inspector', 'oc',
        'dsp', 'addl_sp', 'sp', 'ac', 'dc', 'addl_dc',
        'jc', 'dig', 'addl_dig', 'addl_cp', 'cp', 'ig'
    ];

    const firstNames = ['Md.', 'Abdur', 'Syed', 'Sultana', 'Nasrin', 'Farhana', 'Arif', 'Tariqul', 'Kamal', 'Zakir'];
    const lastNames = ['Hossain', 'Rahman', 'Islam', 'Akter', 'Begum', 'Khan', 'Ahmed', 'Ali', 'Sarkar', 'Reza'];
    
    const officers = [];

    for (let i = 1; i <= 300; i++) {
        // Distribute officers across thanas
        const thana_id = thanas[(i - 1) % thanas.length];
        
        // Pick names and rank
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName} ${i}`;
        
        // Logical rank distribution: higher index = higher rank (roughly)
        let rank_code;
        if (i === 1) rank_code = 'constable';
        else if (i < 50) rank_code = 'constable';
        else if (i < 100) rank_code = 'si';
        else if (i < 150) rank_code = 'inspector';
        else if (i < 200) rank_code = 'oc';
        else if (i < 250) rank_code = 'dsp';
        else rank_code = 'sp';

        officers.push({
            badge_no: `BP-${100000 + i}`,
            full_name: fullName,
            rank_code: rank_code,
            thana_id: thana_id,
            phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`.substring(0, 11),
            email: `officer${i}@police.gov.bd`,
            image_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
            password: 'Officer@123'
        });
    }
    return officers;
};

const seedOfficers = async () => {
    try {
        console.log('\n═══════════════════════════════════════════════');
        console.log('   👮 SEEDING OFFICERS DATA');
        console.log('═══════════════════════════════════════════════\n');
        
        // Step 1: Check existing data
        console.log('🔍 Checking existing officers...\n');
        const existingResult = await pool.query('SELECT COUNT(*) as count FROM officer');
        const existingCount = existingResult.rows[0].count;
        
        if (existingCount > 0) {
            console.log(`⏭️  Found ${existingCount} existing officers. Skipping insert.\n`);
            console.log('═══════════════════════════════════════════════\n');
            process.exit(0);
        }
        
        // Step 2: Generate officers
        console.log('🏗️  Generating 300 officers...\n');
        const officersData = await generateOfficers();
        
        // Step 3: Insert officers
        console.log(`📥 Inserting ${officersData.length} officers...\n`);
        
        const saltRounds = 10;
        let successCount = 0;
        let errorCount = 0;
        
        for (const officer of officersData) {
            try {
                const hashedPassword = await bcrypt.hash(officer.password, saltRounds);
                
                const query = `
                    INSERT INTO officer (badge_no, full_name, rank_code, thana_id, phone, email, image_url, password)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING officer_id, badge_no, full_name, rank_code
                `;
                
                await pool.query(query, [
                    officer.badge_no,
                    officer.full_name,
                    officer.rank_code,
                    officer.thana_id,
                    officer.phone,
                    officer.email,
                    officer.image_url,
                    hashedPassword
                ]);
                
                successCount++;
                
                // Show progress every 50 officers
                if (successCount % 50 === 0) {
                    console.log(`✅ Inserted ${successCount} officers...`);
                }
                
            } catch (error) {
                errorCount++;
                if (errorCount <= 5) {
                    console.error(`❌ Failed to insert ${officer.full_name}: ${error.message}`);
                }
            }
        }
        
        // Step 4: Display statistics
        console.log('\n═══════════════════════════════════════════════');
        console.log('📊 INSERTION SUMMARY');
        console.log('═══════════════════════════════════════════════');
        console.log(`✅ Successfully inserted: ${successCount}`);
        console.log(`❌ Failed insertions: ${errorCount}`);
        console.log(`📈 Total: ${officersData.length}`);
        
        // Get stats by rank
        const rankStats = await pool.query(`
            SELECT r.rank_name, r.rank_code, COUNT(o.officer_id) as count
            FROM rank r
            LEFT JOIN officer o ON r.rank_code = o.rank_code
            GROUP BY r.rank_code, r.rank_name, r.level
            ORDER BY r.level
        `);
        
        console.log('\n👮 OFFICERS BY RANK:\n');
        rankStats.rows.forEach(row => {
            console.log(`   ${row.rank_name.padEnd(20)}: ${(row.count || 0).toString().padStart(3)} officers`);
        });
        
        // Get stats by thana
        const thanaStats = await pool.query(`
            SELECT t.thana_name, t.district, COUNT(o.officer_id) as count
            FROM thana t
            LEFT JOIN officer o ON t.thana_id = o.thana_id
            GROUP BY t.thana_id, t.thana_name, t.district
            ORDER BY count DESC
            LIMIT 10
        `);
        
        console.log('\n📍 TOP 10 THANAS BY OFFICER COUNT:\n');
        thanaStats.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.thana_name.padEnd(30)} (${row.district}): ${row.count} officers`);
        });
        
        console.log('\n🔐 LOGIN CREDENTIALS:');
        console.log('   Email: officer[1-300]@police.gov.bd');
        console.log('   Password: Officer@123');
        
        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ Officers seeding completed successfully!');
        console.log('═══════════════════════════════════════════════\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedOfficers();
