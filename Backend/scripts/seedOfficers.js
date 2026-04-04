import pool from '../src/config/dbConnection.js';
import bcrypt from 'bcryptjs';

const maleFirstNames = [
    'Md', 'Abdul', 'Abdur', 'Syed', 'Mohammad', 'Sajid', 'Arif', 'Tariqul', 'Kamal', 'Zakir',
    'Naim', 'Imran', 'Rafiq', 'Shakil', 'Mahbub', 'Rashed', 'Masud', 'Jahid', 'Fahim', 'Nayeem',
    'Ashraful', 'Saiful', 'Mizan', 'Rana', 'Sabbir', 'Jubayer', 'Shuvo', 'Parvez', 'Ehsan', 'Tanvir',
    'Tareq', 'Iqbal', 'Momin', 'Abbas', 'Anis', 'Babul', 'Faruk', 'Golam', 'Habib', 'Iftekhar',
    'Jahangir', 'Kawsar', 'Mamun', 'Nazmul', 'Omar', 'Partho', 'Roni', 'Suman', 'Tipu', 'Yasin'
];
const femaleFirstNames = [
    'Sultana', 'Nasrin', 'Farhana', 'Ayesha', 'Roksana', 'Jannat', 'Shirin', 'Nusrat', 'Mim', 'Tasnim',
    'Mithila', 'Sanjida', 'Tania', 'Sabrina', 'Sharmin', 'Jahanara', 'Muniya', 'Rumana', 'Rupa', 'Tanjila',
    'Shahana', 'Samira', 'Anika', 'Sadia', 'Maliha', 'Nazia', 'Nafisa', 'Saima', 'Tahmina', 'Purnima',
    'Rina', 'Sumaiya', 'Ishrat', 'Lubna', 'Hasina', 'Papia', 'Razia', 'Sheuly', 'Momena', 'Selina'
];
const lastNames = [
    'Hossain', 'Rahman', 'Islam', 'Akter', 'Begum', 'Khan', 'Ahmed', 'Ali', 'Sarkar', 'Reza',
    'Chowdhury', 'Bhuiyan', 'Miah', 'Uddin', 'Karim', 'Hasan', 'Mahmud', 'Jamal', 'Kabir', 'Siddique',
    'Azad', 'Bhuiya', 'Das', 'Dey', 'Haque', 'Jalil', 'Khaled', 'Mannan', 'Mollik', 'Munshi',
    'Naser', 'Noor', 'Quader', 'Rashid', 'Riyad', 'Saha', 'Sikder', 'Talukder', 'Ullah', 'Zaman'
];

const randomNid = () => {
    // 17-digit numeric string (common NID format)
    let nid = '';
    for (let i = 0; i < 17; i++) {
        nid += Math.floor(Math.random() * 10).toString();
    }
    return nid;
};

const randomBirthDate = () => {
    // Officers age range: 22 - 58
    const startYear = 1968;
    const endYear = 2002;
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const mm = month.toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
};

const generateOfficers = async () => {
    // Get all thana IDs from database
    const thanasResult = await pool.query('SELECT thana_id FROM thana ORDER BY thana_id');
    const thanas = thanasResult.rows.map(row => row.thana_id);
    
    if (thanas.length === 0) {
        console.error('❌ No thanas found. Please seed thanas first.');
        process.exit(1);
    }
    
    const officers = [];
    let badgeCounter = 100000;

    for (const thanaId of thanas) {
        // 10 officers per thana: 7 male, 3 female
        const genderPlan = [
            'male', 'male', 'male', 'male', 'male', 'male', 'male',
            'female', 'female', 'female'
        ];

        // Rank distribution per thana (10 total)
        const rankPlan = [
            'oc',
            'inspector', 'inspector',
            'si', 'si',
            'constable', 'constable', 'constable', 'constable', 'constable'
        ];

        for (let i = 0; i < 10; i++) {
            const gender = genderPlan[i];
            const firstNamePool = gender === 'female' ? femaleFirstNames : maleFirstNames;
            const firstName = firstNamePool[Math.floor(Math.random() * firstNamePool.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fullName = `${firstName} ${lastName}`;
            const fatherFirst = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
            const fatherLast = lastNames[Math.floor(Math.random() * lastNames.length)];
            const motherFirst = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
            const motherLast = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fatherName = `${fatherFirst} ${fatherLast}`;
            const motherName = `${motherFirst} ${motherLast}`;
            const emailLocal = fullName.toLowerCase().replace(/[^a-z]/g, '');

            officers.push({
                badge_no: `BP-${badgeCounter++}`,
                full_name: fullName,
                rank_code: rankPlan[i],
                thana_id: thanaId,
                phone: `01${Math.floor(300000000 + Math.random() * 699999999)}`.substring(0, 11),
                email: `${emailLocal}${badgeCounter}@police.gov.bd`,
                image_url: `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 90)}.jpg`,
                gender,
                nid_number: randomNid(),
                father_name: fatherName,
                mother_name: motherName,
                birth_date: randomBirthDate(),
                password: 'officer@123'
            });
        }
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
            console.log(`🔁 Found ${existingCount} existing officers. Updating extra fields...\n`);

            const officersResult = await pool.query(
                'SELECT officer_id, full_name, gender FROM officer ORDER BY officer_id'
            );

            let updatedCount = 0;
            for (const row of officersResult.rows) {
                const gender = row.gender === 'female' ? 'female' : 'male';
                const fatherFirst = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
                const fatherLast = lastNames[Math.floor(Math.random() * lastNames.length)];
                const motherFirst = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
                const motherLast = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fatherName = `${fatherFirst} ${fatherLast}`;
                const motherName = `${motherFirst} ${motherLast}`;
                const nidNumber = randomNid();
                const birthDate = randomBirthDate();
                const imageUrl = `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 90)}.jpg`;

                await pool.query(
                    `
                        UPDATE officer
                        SET nid_number = $1,
                            father_name = $2,
                            mother_name = $3,
                            birth_date = $4,
                            image_url = $5
                        WHERE officer_id = $6
                    `,
                    [nidNumber, fatherName, motherName, birthDate, imageUrl, row.officer_id]
                );

                updatedCount++;
                if (updatedCount % 100 === 0) {
                    console.log(`✅ Updated ${updatedCount} officers...`);
                }
            }

            console.log(`\n✅ Updated ${updatedCount} officers with new fields.`);
            console.log('═══════════════════════════════════════════════\n');
            process.exit(0);
        }
        
        // Step 2: Generate officers
        console.log('🏗️  Generating 10 officers per thana...\n');
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
                    INSERT INTO officer (
                        badge_no, full_name, rank_code, thana_id, phone, email, image_url,
                        nid_number, father_name, mother_name, birth_date, gender, password
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
                    officer.nid_number,
                    officer.father_name,
                    officer.mother_name,
                    officer.birth_date,
                    officer.gender,
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
        console.log('   Email: officername@police.gov.bd');
        console.log('   Password: officer@123');
        
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
