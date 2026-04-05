import pool from '../src/config/dbConnection.js';

const statusCycle = [
  'in_custody',
  'in_custody',
  'on_bail',
  'released',
  'wanted',
  'escaped',
  'unknown',
];

async function rebalanceStatuses() {
  try {
    const criminalsRes = await pool.query('SELECT criminal_id FROM criminal ORDER BY criminal_id');
    const criminals = criminalsRes.rows || [];

    if (!criminals.length) {
      console.log('No criminals found.');
      process.exit(0);
    }

    let updated = 0;
    for (let i = 0; i < criminals.length; i += 1) {
      const row = criminals[i];
      const nextStatus = statusCycle[i % statusCycle.length];
      await pool.query('UPDATE criminal SET status = $1 WHERE criminal_id = $2', [nextStatus, row.criminal_id]);
      updated += 1;
    }

    const summary = await pool.query(`
      SELECT status, COUNT(*)::INT AS total
      FROM criminal
      GROUP BY status
      ORDER BY total DESC;
    `);

    console.log(`Updated statuses for ${updated} criminals.`);
    console.table(summary.rows);
    process.exit(0);
  } catch (error) {
    console.error('Failed to rebalance criminal statuses:', error.message);
    process.exit(1);
  }
}

rebalanceStatuses();
