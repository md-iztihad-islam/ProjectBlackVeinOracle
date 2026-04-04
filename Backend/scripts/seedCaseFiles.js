import pool from '../src/config/dbConnection.js';

const caseTypes = [
  'theft', 'robbery', 'murder', 'assault', 'kidnapping',
  'fraud', 'cyber_crime', 'drug_offense', 'domestic_violence',
  'extortion', 'illegal_firearms', 'human_trafficking', 'other'
];

const statuses = ['open', 'closed', 'under_investigation'];

const titlesByType = {
  theft: ['Theft at market', 'Stolen mobile report', 'Household theft case'],
  robbery: ['Roadside robbery', 'Night robbery case', 'Armed robbery report'],
  murder: ['Homicide investigation', 'Suspicious death case', 'Murder inquiry'],
  assault: ['Assault complaint', 'Physical attack report', 'Violence complaint'],
  kidnapping: ['Kidnapping allegation', 'Missing child case', 'Abduction report'],
  fraud: ['Fraudulent transaction', 'Banking fraud case', 'Fraud complaint'],
  cyber_crime: ['Social media hacking', 'Online scam report', 'Cyber fraud case'],
  drug_offense: ['Drug trafficking case', 'Narcotics seizure', 'Drug possession'],
  domestic_violence: ['Domestic violence report', 'Family abuse case', 'Household dispute'],
  extortion: ['Extortion threat', 'Demand for ransom', 'Extortion complaint'],
  illegal_firearms: ['Illegal firearm possession', 'Unlicensed gun report', 'Arms recovery'],
  human_trafficking: ['Human trafficking probe', 'Trafficking complaint', 'Suspicious transport'],
  other: ['General case file', 'Miscellaneous incident', 'Other complaint']
};

const descriptions = [
  'Complainant provided a detailed statement and witnesses were listed.',
  'Initial investigation completed; evidence collected from the scene.',
  'Suspects identified and statements recorded for further inquiry.',
  'Case filed based on victim statement and preliminary verification.',
  'Investigation assigned to officer with follow-up scheduled.'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedCaseFiles = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   📁 SEEDING CASE FILES DATA');
    console.log('═══════════════════════════════════════════════\n');

    const thanasResult = await pool.query(
      'SELECT thana_id FROM thana ORDER BY thana_id'
    );

    if (thanasResult.rows.length === 0) {
      console.error('❌ No thanas found. Please seed thanas first.');
      process.exit(1);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const thana of thanasResult.rows) {
      const criminalsResult = await pool.query(
        'SELECT criminal_id FROM criminal WHERE registered_thana_id = $1 ORDER BY criminal_id',
        [thana.thana_id]
      );

      if (criminalsResult.rows.length === 0) {
        console.log(`⏭️  No criminals found for thana ${thana.thana_id}. Skipping.`);
        continue;
      }

      const existingCountResult = await pool.query(
        'SELECT COUNT(*)::int AS count FROM case_file WHERE thana_id = $1',
        [thana.thana_id]
      );
      const existingCount = existingCountResult.rows[0].count;
      const toInsert = Math.max(0, 20 - existingCount);

      for (let i = 0; i < toInsert; i++) {
        const caseType = pick(caseTypes);
        const caseTitle = pick(titlesByType[caseType]);
        const criminalId = criminalsResult.rows[i % criminalsResult.rows.length].criminal_id;

        try {
          await pool.query(
            `
              INSERT INTO case_file (
                case_title, criminal_id, thana_id, case_type, status, description
              )
              VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [
              caseTitle,
              criminalId,
              thana.thana_id,
              caseType,
              pick(statuses),
              pick(descriptions)
            ]
          );
          successCount++;
          if (successCount % 200 === 0) {
            console.log(`✅ Inserted ${successCount} case files...`);
          }
        } catch (error) {
          errorCount++;
          if (errorCount <= 5) {
            console.error(`❌ Failed to insert case file for thana ${thana.thana_id}: ${error.message}`);
          }
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 INSERTION SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Successfully inserted: ${successCount}`);
    console.log(`❌ Failed insertions: ${errorCount}`);

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Case file seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedCaseFiles();
