import pool from '../src/config/dbConnection.js';

const custodyStatuses = ['in_custody', 'on_bail', 'released', 'transferred'];
const courtNames = [
  'District Court', 'Sessions Court', 'Chief Judicial Magistrate Court',
  'Metropolitan Magistrate Court', 'Special Tribunal'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDateWithinYears = (years) => {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - years);
  const time = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(time).toISOString().split('T')[0];
};

const seedArrests = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   🚓 SEEDING ARRESTS, BAILS & INCARCERATIONS');
    console.log('═══════════════════════════════════════════════\n');

    const thanasResult = await pool.query('SELECT thana_id FROM thana ORDER BY thana_id');
    const jailsResult = await pool.query('SELECT jail_id FROM jail ORDER BY jail_id');
    const cellsResult = await pool.query(
      `
        SELECT ce.cell_id, cb.jail_id
        FROM cell ce
        JOIN cell_block cb ON cb.block_id = ce.block_id
        ORDER BY ce.cell_id
      `
    );

    if (thanasResult.rows.length === 0) {
      console.error('❌ No thanas found. Please seed thanas first.');
      process.exit(1);
    }
    if (jailsResult.rows.length === 0 || cellsResult.rows.length === 0) {
      console.error('❌ No jails/cells found. Please seed jails first.');
      process.exit(1);
    }

    const cellsByJail = new Map();
    for (const row of cellsResult.rows) {
      if (!cellsByJail.has(row.jail_id)) {
        cellsByJail.set(row.jail_id, []);
      }
      cellsByJail.get(row.jail_id).push(row.cell_id);
    }

    let arrestCount = 0;
    let bailCount = 0;
    let incarcerationCount = 0;
    let errorCount = 0;

    for (const thana of thanasResult.rows) {
      const criminalsResult = await pool.query(
        'SELECT criminal_id FROM criminal WHERE registered_thana_id = $1 ORDER BY criminal_id',
        [thana.thana_id]
      );

      if (criminalsResult.rows.length === 0) {
        console.log(`⏭️  No criminals for thana ${thana.thana_id}. Skipping.`);
        continue;
      }

      const existingCountResult = await pool.query(
        'SELECT COUNT(*)::int AS count FROM arrest_record WHERE thana_id = $1',
        [thana.thana_id]
      );
      const existingCount = existingCountResult.rows[0].count;
      const toInsert = Math.max(0, 20 - existingCount);

      for (let i = 0; i < toInsert; i++) {
        const criminalId = criminalsResult.rows[i % criminalsResult.rows.length].criminal_id;
        const arrestDate = randomDateWithinYears(2);
        const status = pick(custodyStatuses);

        try {
          const arrestRes = await pool.query(
            `
              INSERT INTO arrest_record (
                criminal_id, arrest_date, bail_due_date, custody_status, thana_id, case_reference
              )
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING arrest_id
            `,
            [
              criminalId,
              arrestDate,
              null,
              status,
              thana.thana_id,
              `CASE-${Math.floor(Math.random() * 900000 + 100000)}`
            ]
          );

          arrestCount++;
          const arrestId = arrestRes.rows[0].arrest_id;

          // Incarceration for in_custody / transferred
          if (status === 'in_custody' || status === 'transferred') {
            const jailId = pick(jailsResult.rows).jail_id;
            const jailCells = cellsByJail.get(jailId) || [];
            const cellId = jailCells.length ? pick(jailCells) : null;

            await pool.query(
              `
                INSERT INTO incarceration (jail_id, arrest_id, cell_id, admitted_at, released_at)
                VALUES ($1, $2, $3, NOW(), NULL)
              `,
              [jailId, arrestId, cellId]
            );
            incarcerationCount++;
          }

          // Bail records for some arrests
          if (status === 'on_bail' || (status === 'released' && Math.random() < 0.5)) {
            const bailStatus = status === 'on_bail' ? 'granted' : pick(['granted', 'rejected', 'pending']);
            await pool.query(
              `
                INSERT INTO bail_record (arrest_id, court_name, bail_amount, granted_at, surety_name, status)
                VALUES ($1, $2, $3, $4, $5, $6)
              `,
              [
                arrestId,
                pick(courtNames),
                Math.floor(Math.random() * 90000) + 10000,
                bailStatus === 'granted' ? arrestDate : null,
                bailStatus === 'granted' ? 'Local Surety' : null,
                bailStatus
              ]
            );
            bailCount++;
          }

          if (arrestCount % 200 === 0) {
            console.log(`✅ Inserted ${arrestCount} arrest records...`);
          }
        } catch (error) {
          errorCount++;
          if (errorCount <= 5) {
            console.error(`❌ Failed to insert arrest for thana ${thana.thana_id}: ${error.message}`);
          }
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Arrest records inserted: ${arrestCount}`);
    console.log(`✅ Bail records inserted: ${bailCount}`);
    console.log(`✅ Incarcerations inserted: ${incarcerationCount}`);
    console.log(`❌ Failed insertions: ${errorCount}`);

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Arrest seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedArrests();
