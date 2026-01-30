import pool from '../src/config/dbConnection.js';
import bcrypt from 'bcryptjs';

const thanasData = [
    // Dhaka Metropolitan Area
    {
        thana_name: 'Ramna Model Police Station',
        district: 'Dhaka',
        zone: 'Central',
        address: 'Ramna, Dhaka-1000',
        phone: '02-9558131',
        email: 'ramna.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Motijheel Police Station',
        district: 'Dhaka',
        zone: 'Central',
        address: 'Motijheel, Dhaka-1000',
        phone: '02-9551515',
        email: 'motijheel.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Gulshan Police Station',
        district: 'Dhaka',
        zone: 'North',
        address: 'Gulshan-2, Dhaka-1212',
        phone: '02-8829513',
        email: 'gulshan.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Dhanmondi Police Station',
        district: 'Dhaka',
        zone: 'Central',
        address: 'Dhanmondi, Dhaka-1205',
        phone: '02-9665222',
        email: 'dhanmondi.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Mirpur Model Police Station',
        district: 'Dhaka',
        zone: 'North',
        address: 'Mirpur-10, Dhaka-1216',
        phone: '02-9006421',
        email: 'mirpur.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Uttara Police Station',
        district: 'Dhaka',
        zone: 'North',
        address: 'Uttara Sector-7, Dhaka-1230',
        phone: '02-8952121',
        email: 'uttara.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Banani Police Station',
        district: 'Dhaka',
        zone: 'North',
        address: 'Banani, Dhaka-1213',
        phone: '02-9892345',
        email: 'banani.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Tejgaon Police Station',
        district: 'Dhaka',
        zone: 'Central',
        address: 'Tejgaon, Dhaka-1215',
        phone: '02-8870123',
        email: 'tejgaon.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Badda Police Station',
        district: 'Dhaka',
        zone: 'North',
        address: 'Badda, Dhaka-1212',
        phone: '02-8820456',
        email: 'badda.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Shantinagar Police Station',
        district: 'Dhaka',
        zone: 'Central',
        address: 'Shantinagar, Dhaka-1217',
        phone: '02-9356789',
        email: 'shantinagar.thana@police.gov.bd',
        password: 'Thana@123'
    },
    
    // Chittagong Metropolitan Area
    {
        thana_name: 'Kotwali Police Station',
        district: 'Chittagong',
        zone: 'South',
        address: 'Kotwali, Chittagong-4000',
        phone: '031-610244',
        email: 'ctg.kotwali.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Panchlaish Police Station',
        district: 'Chittagong',
        zone: 'South',
        address: 'Panchlaish, Chittagong-4203',
        phone: '031-656789',
        email: 'panchlaish.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Khulshi Police Station',
        district: 'Chittagong',
        zone: 'South',
        address: 'Khulshi, Chittagong-4225',
        phone: '031-653456',
        email: 'khulshi.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Agrabad Police Station',
        district: 'Chittagong',
        zone: 'South',
        address: 'Agrabad, Chittagong-4100',
        phone: '031-721234',
        email: 'agrabad.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Halishahar Police Station',
        district: 'Chittagong',
        zone: 'North',
        address: 'Halishahar, Chittagong-4230',
        phone: '031-681234',
        email: 'halishahar.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'GEC Police Station',
        district: 'Chittagong',
        zone: 'North',
        address: 'GEC, Chittagong-4207',
        phone: '031-645678',
        email: 'gec.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Nasirabad Police Station',
        district: 'Chittagong',
        zone: 'West',
        address: 'Nasirabad, Chittagong-4000',
        phone: '031-721456',
        email: 'nasirabad.thana@police.gov.bd',
        password: 'Thana@123'
    },
    
    // Rajshahi Metropolitan Area
    {
        thana_name: 'Rajpara Police Station',
        district: 'Rajshahi',
        zone: 'Central',
        address: 'Rajpara, Rajshahi-6100',
        phone: '0721-772345',
        email: 'rajpara.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Boalia Police Station',
        district: 'Rajshahi',
        zone: 'West',
        address: 'Boalia, Rajshahi-6100',
        phone: '0721-774567',
        email: 'boalia.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Motihar Police Station',
        district: 'Rajshahi',
        zone: 'East',
        address: 'Motihar, Rajshahi-6100',
        phone: '0721-775678',
        email: 'motihar.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Puthia Police Station',
        district: 'Rajshahi',
        zone: 'East',
        address: 'Puthia, Rajshahi-6200',
        phone: '0721-776789',
        email: 'puthia.thana@police.gov.bd',
        password: 'Thana@123'
    },
    
    // Khulna Metropolitan Area
    {
        thana_name: 'Khulna Sadar Police Station',
        district: 'Khulna',
        zone: 'Central',
        address: 'Khulna Sadar, Khulna-9100',
        phone: '041-720123',
        email: 'khulna.sadar.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Sonadanga Police Station',
        district: 'Khulna',
        zone: 'North',
        address: 'Sonadanga, Khulna-9100',
        phone: '041-720456',
        email: 'sonadanga.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Daulatpur Police Station',
        district: 'Khulna',
        zone: 'South',
        address: 'Daulatpur, Khulna-9202',
        phone: '041-720789',
        email: 'daulatpur.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Batiaghata Police Station',
        district: 'Khulna',
        zone: 'East',
        address: 'Batiaghata, Khulna-9200',
        phone: '041-721234',
        email: 'batiaghata.thana@police.gov.bd',
        password: 'Thana@123'
    },
    
    // Sylhet Metropolitan Area
    {
        thana_name: 'Kotwali Police Station (Sylhet)',
        district: 'Sylhet',
        zone: 'Central',
        address: 'Kotwali, Sylhet-3100',
        phone: '0821-714567',
        email: 'sylhet.kotwali.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Jalalabad Police Station',
        district: 'Sylhet',
        zone: 'East',
        address: 'Jalalabad, Sylhet-3100',
        phone: '0821-715678',
        email: 'jalalabad.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Sadar Police Station (Sylhet)',
        district: 'Sylhet',
        zone: 'North',
        address: 'Sadar, Sylhet-3100',
        phone: '0821-716789',
        email: 'sadar.sylhet.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Osmani Nagar Police Station',
        district: 'Sylhet',
        zone: 'West',
        address: 'Osmani Nagar, Sylhet-3100',
        phone: '0821-717890',
        email: 'osmani.nagar.thana@police.gov.bd',
        password: 'Thana@123'
    },
    
    // Barisal Metropolitan Area
    {
        thana_name: 'Barisal Sadar Police Station',
        district: 'Barisal',
        zone: 'Central',
        address: 'Barisal Sadar, Barisal-8200',
        phone: '0431-231234',
        email: 'barisal.sadar.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Kotwali Police Station (Barisal)',
        district: 'Barisal',
        zone: 'South',
        address: 'Kotwali, Barisal-8200',
        phone: '0431-232345',
        email: 'barisal.kotwali.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Hizla Police Station',
        district: 'Barisal',
        zone: 'North',
        address: 'Hizla, Barisal-8300',
        phone: '0431-233456',
        email: 'hizla.thana@police.gov.bd',
        password: 'Thana@123'
    },
    
    // Mymensingh Metropolitan Area
    {
        thana_name: 'Mymensingh Sadar Police Station',
        district: 'Mymensingh',
        zone: 'Central',
        address: 'Mymensingh Sadar, Mymensingh-2200',
        phone: '091-61234',
        email: 'mymensingh.sadar.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Kotwali Police Station (Mymensingh)',
        district: 'Mymensingh',
        zone: 'North',
        address: 'Kotwali, Mymensingh-2200',
        phone: '091-62345',
        email: 'mymensingh.kotwali.thana@police.gov.bd',
        password: 'Thana@123'
    },
    {
        thana_name: 'Trishal Police Station',
        district: 'Mymensingh',
        zone: 'East',
        address: 'Trishal, Mymensingh-2201',
        phone: '091-63456',
        email: 'trishal.thana@police.gov.bd',
        password: 'Thana@123'
    }
];

const seedThanas = async () => {
    try {
        console.log('\n═══════════════════════════════════════════════');
        console.log('   🏛️  THANA DATA SEEDING SCRIPT');
        console.log('═══════════════════════════════════════════════\n');
        
        console.log('🔍 Checking for admin user...\n');
        
        // Get first admin from database
        const adminResult = await pool.query('SELECT admin_id FROM admin LIMIT 1');
        
        if (adminResult.rows.length === 0) {
            console.error('❌ No admin user found! Please create an admin user first.');
            console.log('\nRun this query in Supabase SQL Editor:');
            console.log(`
    INSERT INTO admin (full_name, username, email, password)
    VALUES ('System Admin', 'admin', 'admin@police.gov.bd', 'hashedpassword')
    RETURNING admin_id;
            `);
            process.exit(1);
        }
        
        const adminId = adminResult.rows[0].admin_id;
        console.log(`✅ Using admin_id: ${adminId}\n`);
        console.log(`Preparing to insert ${thanasData.length} thanas...\n`);
        
        const saltRounds = 10;
        let successCount = 0;
        let errorCount = 0;
        const insertedThanas = [];
        
        for (const thana of thanasData) {
            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(thana.password, saltRounds);
                
                const query = `
                    INSERT INTO thana (thana_name, district, zone, address, phone, email, password, created_by_admin_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING thana_id, thana_name, district, zone;
                `;
                
                const result = await pool.query(query, [
                    thana.thana_name,
                    thana.district,
                    thana.zone,
                    thana.address,
                    thana.phone,
                    thana.email,
                    hashedPassword,
                    adminId
                ]);
                
                const insertedThana = result.rows[0];
                insertedThanas.push(insertedThana);
                
                console.log(`✅ ID ${insertedThana.thana_id}: ${insertedThana.thana_name}`);
                successCount++;
                
            } catch (error) {
                console.error(`❌ Failed to insert ${thana.thana_name}: ${error.message}`);
                errorCount++;
            }
        }
        
        console.log('\n═══════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('═══════════════════════════════════════════════');
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📈 Total: ${thanasData.length}`);
        
        // Show statistics by district
        const districtStats = await pool.query(`
            SELECT district, COUNT(*) as thana_count
            FROM thana
            GROUP BY district
            ORDER BY district
        `);
        
        console.log('\n🏛️  THANAS BY DISTRICT:\n');
        districtStats.rows.forEach(stat => {
            console.log(`   ${stat.district.padEnd(15)}: ${stat.thana_count} thanas`);
        });
        
        // Show statistics by zone
        const zoneStats = await pool.query(`
            SELECT zone, COUNT(*) as thana_count
            FROM thana
            GROUP BY zone
            ORDER BY thana_count DESC
        `);
        
        console.log('\n📍 THANAS BY ZONE:\n');
        zoneStats.rows.forEach(stat => {
            console.log(`   ${stat.zone.padEnd(15)}: ${stat.thana_count} thanas`);
        });
        
        // Show all inserted thanas grouped by district
        console.log('\n🔐 LOGIN CREDENTIALS:\n');
        console.log('   Email: [thana email from list]');
        console.log('   Password: Thana@123');
        
        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ Thana data seeding completed successfully!');
        console.log('═══════════════════════════════════════════════\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Critical Error:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedThanas();
