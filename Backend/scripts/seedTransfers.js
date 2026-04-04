import pool from '../src/config/dbConnection.js';

const reasons = [
  'Security risk assessment',
  'Overcrowding adjustment',
  'Court hearing transfer',
  'Medical treatment required',
  'Investigation requirement',
  'Administrative transfer'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedTransfers = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   🔁 SEEDING JAIL TRANSFERS');
    console.log('═══════════════════════════════════════════════\n');

    const jailsResult = await pool.query('SELECT jail_id FROM jail ORDER BY jail_id');
    const criminalsResult = await pool.query('SELECT criminal_id FROM criminal ORDER BY criminal_id');
    const cellsResult = await pool.query(
      `
        SELECT ce.cell_id, cb.jail_id
        FROM cell ce
        JOIN cell_block cb ON cb.block_id = ce.block_id
        ORDER BY ce.cell_id
      `
    );

    if (jailsResult.rows.length < 2) {
      console.error('❌ Not enough jails found. Please seed jails first.');
      process.exit(1);
    }
    if (criminalsResult.rows.length === 0) {
      console.error('❌ No criminals found. Please seed criminals first.');
      process.exit(1);
    }

    const cellsByJail = new Map();
    for (const row of cellsResult.rows) {
      if (!cellsByJail.has(row.jail_id)) {
        cellsByJail.set(row.jail_id, []);
      }
      cellsByJail.get(row.jail_id).push(row.cell_id);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const jail of jailsResult.rows) {
      const fromJailId = jail.jail_id;
      const otherJails = jailsResult.rows.filter((j) => j.jail_id !== fromJailId);
      const fromCells = cellsByJail.get(fromJailId) || [];

      for (let i = 0; i < 20; i++) {
        const toJailId = pick(otherJails).jail_id;
        const toCells = cellsByJail.get(toJailId) || [];
        const criminalId = pick(criminalsResult.rows).criminal_id;
        const fromCellId = fromCells.length ? pick(fromCells) : null;
        const toCellId = toCells.length ? pick(toCells) : null;

        try {
          await pool.query(
            `
              INSERT INTO criminal_transfer (
                criminal_id, from_jail_id, to_jail_id, from_cell_id, to_cell_id,
                transfer_reason, authorized_by, transferred_at
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            `,
            [
              criminalId,
              fromJailId,
              toJailId,
              fromCellId,
              toCellId,
              pick(reasons),
              'Admin'
            ]
          );
          successCount++;
          if (successCount % 100 === 0) {
            console.log(`✅ Inserted ${successCount} transfers...`);
          }
        } catch (error) {
          errorCount++;
          if (errorCount <= 5) {
            console.error(`❌ Failed to insert transfer from ${fromJailId}: ${error.message}`);
          }
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Transfers inserted: ${successCount}`);
    console.log(`❌ Failed insertions: ${errorCount}`);

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Transfer seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedTransfers();
