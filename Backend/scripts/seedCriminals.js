import pool from '../src/config/dbConnection.js';

const maleFirstNames = [
  'Md', 'Abdul', 'Abdur', 'Syed', 'Mohammad', 'Sajid', 'Arif', 'Tariqul', 'Kamal', 'Zakir',
  'Naim', 'Imran', 'Rafiq', 'Shakil', 'Mahbub', 'Rashed', 'Masud', 'Jahid', 'Fahim', 'Nayeem',
  'Ashraful', 'Saiful', 'Mizan', 'Rana', 'Sabbir', 'Jubayer', 'Shuvo', 'Parvez', 'Ehsan', 'Tanvir',
  'Faisal', 'Nazmul', 'Mahin', 'Riad', 'Shahin', 'Kabir', 'Mahfuz', 'Rokon', 'Sakib', 'Sakil',
  'Sohel', 'Rasel', 'Hridoy', 'Bashar', 'Azad', 'Kawsar', 'Mamun', 'Rony', 'Tapan', 'Yasin'
];
const femaleFirstNames = [
  'Sultana', 'Nasrin', 'Farhana', 'Ayesha', 'Roksana', 'Jannat', 'Shirin', 'Nusrat', 'Mim', 'Tasnim',
  'Mithila', 'Sanjida', 'Tania', 'Sabrina', 'Sharmin', 'Jahanara', 'Rumana', 'Rupa', 'Tanjila', 'Shahana',
  'Samira', 'Anika', 'Sadia', 'Maliha', 'Nazia', 'Nafisa', 'Saima', 'Tahmina', 'Purnima', 'Rina',
  'Sumaiya', 'Ishrat', 'Lubna', 'Hasina', 'Papia', 'Razia', 'Sheuly', 'Momena', 'Selina', 'Taniya'
];
const lastNames = [
  'Hossain', 'Rahman', 'Islam', 'Akter', 'Begum', 'Khan', 'Ahmed', 'Ali', 'Sarkar', 'Reza',
  'Chowdhury', 'Bhuiyan', 'Miah', 'Uddin', 'Karim', 'Hasan', 'Mahmud', 'Jamal', 'Kabir', 'Siddique',
  'Azad', 'Bhuiya', 'Das', 'Dey', 'Haque', 'Jalil', 'Khaled', 'Mannan', 'Mollik', 'Munshi',
  'Naser', 'Noor', 'Quader', 'Rashid', 'Riyad', 'Saha', 'Sikder', 'Talukder', 'Ullah', 'Zaman'
];
const aliasNames = [
  'Raju', 'Babu', 'Tota', 'Kalu', 'Saju', 'Kamal', 'Biplob', 'Shuvo', 'Milon', 'Noman',
  'Rafi', 'Bikash', 'Jewel', 'Shanto', 'Rony', 'Limon', 'Santo', 'Bappa', 'Shawon', 'Sujon',
  'Tipu', 'Rasel', 'Bashar', 'Riad', 'Sohel', 'Kader', 'Tareq', 'Parvez', 'Masud', 'Hridoy'
];
const identifyingMarks = [
  'Scar on left cheek',
  'Tattoo on right forearm',
  'Mole near left eye',
  'Cut mark on chin',
  'Burn mark on neck',
  'Scar on right eyebrow',
  'Tattoo on left wrist',
  'Mole on right cheek'
];
const statuses = ['in_custody', 'on_bail', 'released', 'escaped', 'unknown', 'wanted'];

const randomNid = () => {
  let nid = '';
  for (let i = 0; i < 17; i++) {
    nid += Math.floor(Math.random() * 10).toString();
  }
  return nid;
};

const randomBirthDate = () => {
  // Age range 18-60
  const startYear = 1966;
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

const seedCriminals = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   🧾 SEEDING CRIMINALS DATA');
    console.log('═══════════════════════════════════════════════\n');

    const thanaResult = await pool.query(
      'SELECT thana_id, thana_name, district FROM thana ORDER BY thana_id'
    );

    if (thanaResult.rows.length === 0) {
      console.error('❌ No thanas found. Please seed thanas first.');
      process.exit(1);
    }

    const countsResult = await pool.query(
      'SELECT registered_thana_id, COUNT(*)::int AS count FROM criminal GROUP BY registered_thana_id'
    );
    const countMap = new Map(countsResult.rows.map((r) => [r.registered_thana_id, r.count]));

    let successCount = 0;
    let errorCount = 0;
    let targetCount = 0;

    for (const thana of thanaResult.rows) {
      const existing = countMap.get(thana.thana_id) || 0;
      const toInsert = Math.max(0, 10 - existing);
      targetCount += toInsert;

      for (let i = 0; i < toInsert; i++) {
        const gender = i < Math.ceil(toInsert * 0.2) ? 'female' : 'male';
        const fullName = buildName(gender);
        const fatherName = buildName('male');
        const motherName = buildName('female');
        const alias = pick(aliasNames);
        const status = pick(statuses);
        const riskLevel = Math.floor(Math.random() * 10) + 1;
        const imageUrl = `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 90)}.jpg`;
        const permanentAddress = `${thana.thana_name}, ${thana.district}`;
        const currentAddress = `Near ${thana.thana_name}, ${thana.district}`;
        const mark = pick(identifyingMarks);

        try {
          await pool.query(
            `
              INSERT INTO criminal (
                full_name, nid, status, risk_level, registered_thana_id, image_url,
                father_name, mother_name, birth_date, gender, aliases, nationality,
                permanent_address, current_address, identifying_marks
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
            `,
            [
              fullName,
              randomNid(),
              status,
              riskLevel,
              thana.thana_id,
              imageUrl,
              fatherName,
              motherName,
              randomBirthDate(),
              gender,
              alias,
              'Bangladeshi',
              permanentAddress,
              currentAddress,
              mark
            ]
          );
          successCount++;
          if (successCount % 100 === 0) {
            console.log(`✅ Inserted ${successCount} criminals...`);
          }
        } catch (error) {
          errorCount++;
          if (errorCount <= 5) {
            console.error(`❌ Failed to insert criminal for ${thana.thana_name}: ${error.message}`);
          }
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 INSERTION SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Successfully inserted: ${successCount}`);
    console.log(`❌ Failed insertions: ${errorCount}`);
    console.log(`🎯 Targeted insertions: ${targetCount}`);

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Criminal seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedCriminals();
