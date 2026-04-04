import pool from '../src/config/dbConnection.js';
import bcrypt from 'bcryptjs';

const maleFirstNames = [
  'Md', 'Abdul', 'Abdur', 'Syed', 'Mohammad', 'Sajid', 'Arif', 'Tariqul', 'Kamal', 'Zakir',
  'Naim', 'Imran', 'Rafiq', 'Shakil', 'Mahbub', 'Rashed', 'Masud', 'Jahid', 'Fahim', 'Nayeem',
  'Ashraful', 'Saiful', 'Mizan', 'Rana', 'Sabbir', 'Jubayer', 'Shuvo', 'Parvez', 'Ehsan', 'Tanvir'
];
const femaleFirstNames = [
  'Sultana', 'Nasrin', 'Farhana', 'Ayesha', 'Roksana', 'Jannat', 'Shirin', 'Nusrat', 'Mim', 'Tasnim',
  'Mithila', 'Sanjida', 'Tania', 'Sabrina', 'Sharmin', 'Jahanara', 'Rumana', 'Rupa', 'Tanjila', 'Shahana'
];
const lastNames = [
  'Hossain', 'Rahman', 'Islam', 'Akter', 'Begum', 'Khan', 'Ahmed', 'Ali', 'Sarkar', 'Reza',
  'Chowdhury', 'Bhuiyan', 'Miah', 'Uddin', 'Karim', 'Hasan', 'Mahmud', 'Jamal', 'Kabir', 'Siddique'
];

const randomNid = () => {
  let nid = '';
  for (let i = 0; i < 17; i++) {
    nid += Math.floor(Math.random() * 10).toString();
  }
  return nid;
};

const randomBirthDate = () => {
  // Age range 18-65
  const startYear = 1960;
  const endYear = 2008;
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildName = (gender) => {
  const first = gender === 'female' ? pick(femaleFirstNames) : pick(maleFirstNames);
  const last = pick(lastNames);
  return `${first} ${last}`;
};

const seedUsers = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   👤 SEEDING USERS DATA');
    console.log('═══════════════════════════════════════════════\n');

    const existingResult = await pool.query('SELECT COUNT(*)::int AS count FROM "user"');
    const existingCount = existingResult.rows[0].count;
    const targetTotal = 300;
    const toInsert = Math.max(0, targetTotal - existingCount);

    if (toInsert === 0) {
      console.log(`⏭️  Already have ${existingCount} users. Skipping insert.`);
      process.exit(0);
    }

    const thanaResult = await pool.query('SELECT thana_name, district FROM thana ORDER BY thana_id');
    const thanas = thanaResult.rows;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('user@123', saltRounds);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < toInsert; i++) {
      const gender = i < Math.ceil(toInsert * 0.3) ? 'female' : 'male';
      const fullName = buildName(gender);
      const emailLocal = fullName.toLowerCase().replace(/[^a-z]/g, '');
      const email = `${emailLocal}${existingCount + i + 1}@gmail.com`;
      const phone = `01${Math.floor(300000000 + Math.random() * 699999999)}`.substring(0, 11);
      const thana = thanas.length ? thanas[i % thanas.length] : { thana_name: 'Unknown', district: 'Dhaka' };
      const address = `${thana.thana_name}, ${thana.district}`;

      try {
        await pool.query(
          `
            INSERT INTO "user" (
              full_name, nid_number, phone, email, address, birth_date, gender, password
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
          `,
          [
            fullName,
            randomNid(),
            phone,
            email,
            address,
            randomBirthDate(),
            gender,
            hashedPassword
          ]
        );
        successCount++;
        if (successCount % 50 === 0) {
          console.log(`✅ Inserted ${successCount} users...`);
        }
      } catch (error) {
        errorCount++;
        if (errorCount <= 5) {
          console.error(`❌ Failed to insert ${fullName}: ${error.message}`);
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 INSERTION SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Successfully inserted: ${successCount}`);
    console.log(`❌ Failed insertions: ${errorCount}`);
    console.log(`🎯 Targeted insertions: ${toInsert}`);

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ User seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedUsers();
