import pool from '../src/config/dbConnection.js';

const ideologies = [
  'Financial Gain',
  'Political Influence',
  'Smuggling Network',
  'Extortion Ring',
  'Cyber Syndicate',
  'Local Gang',
  'Organized Crime',
  'Drug Trafficking',
  'Property Grabbing',
  'Arms Dealing'
];

const orgNamePrefixes = [
  'Shadow', 'Red', 'Golden', 'Silent', 'Iron', 'Black', 'Silver', 'Royal',
  'Eastern', 'Northern', 'Southern', 'Western', 'River', 'Hill', 'Coastal'
];

const orgNameNouns = [
  'Union', 'Crew', 'Circle', 'Alliance', 'Group', 'Network', 'Syndicate',
  'Brotherhood', 'Faction', 'League', 'Squad'
];

const relationTypes = ['associate', 'family', 'financial', 'accomplice'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildOrgName = () => `${pick(orgNamePrefixes)} ${pick(orgNameNouns)}`;

const seedOrganizations = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   🧩 SEEDING ORGANIZATIONS & RELATIONS');
    console.log('═══════════════════════════════════════════════\n');

    const criminalsResult = await pool.query(
      'SELECT criminal_id FROM criminal ORDER BY criminal_id'
    );

    if (criminalsResult.rows.length < 2) {
      console.error('❌ Not enough criminals found. Please seed criminals first.');
      process.exit(1);
    }

    const existingOrgResult = await pool.query('SELECT COUNT(*)::int AS count FROM organization');
    const existingOrgCount = existingOrgResult.rows[0].count;
    const targetOrgCount = 200;
    const toInsert = Math.max(0, targetOrgCount - existingOrgCount);

    let orgInserted = 0;
    for (let i = 0; i < toInsert; i++) {
      const name = `${buildOrgName()} ${existingOrgCount + i + 1}`;
      const ideology = pick(ideologies);
      const threatLevel = Math.floor(Math.random() * 10) + 1;

      await pool.query(
        `
          INSERT INTO organization (name, ideology, threat_level)
          VALUES ($1, $2, $3)
        `,
        [name, ideology, threatLevel]
      );
      orgInserted++;
      if (orgInserted % 50 === 0) {
        console.log(`✅ Inserted ${orgInserted} organizations...`);
      }
    }

    const orgsResult = await pool.query('SELECT org_id FROM organization ORDER BY org_id');
    const orgIds = orgsResult.rows.map((r) => r.org_id);
    const criminalIds = criminalsResult.rows.map((r) => r.criminal_id);

    let coInserted = 0;
    let crInserted = 0;

    // Link criminals to organizations (2 per criminal)
    for (const criminalId of criminalIds) {
      const org1 = pick(orgIds);
      const org2 = pick(orgIds);
      const role1 = pick(['member', 'associate', 'leader', 'enforcer']);
      const role2 = pick(['member', 'associate', 'financier', 'scout']);

      await pool.query(
        `
          INSERT INTO criminal_organization (criminal_id, org_id, role)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
        `,
        [criminalId, org1, role1]
      );
      await pool.query(
        `
          INSERT INTO criminal_organization (criminal_id, org_id, role)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
        `,
        [criminalId, org2, role2]
      );
      coInserted += 2;
      if (coInserted % 200 === 0) {
        console.log(`✅ Inserted ${coInserted} criminal_organization links...`);
      }
    }

    // Add criminal relations (2 per criminal)
    for (let i = 0; i < criminalIds.length; i++) {
      const criminalId1 = criminalIds[i];
      for (let j = 0; j < 2; j++) {
        let criminalId2 = pick(criminalIds);
        if (criminalId2 === criminalId1) {
          criminalId2 = pick(criminalIds);
        }
        const relationType = pick(relationTypes);

        await pool.query(
          `
            INSERT INTO criminal_relation (criminal_id_1, criminal_id_2, relation_type)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
          `,
          [criminalId1, criminalId2, relationType]
        );
        crInserted++;
        if (crInserted % 200 === 0) {
          console.log(`✅ Inserted ${crInserted} criminal_relation rows...`);
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Organizations inserted: ${orgInserted}`);
    console.log(`✅ criminal_organization links inserted: ${coInserted}`);
    console.log(`✅ criminal_relation rows inserted: ${crInserted}`);

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Organization seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedOrganizations();
