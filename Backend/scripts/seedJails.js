import pool from '../src/config/dbConnection.js';
import bcrypt from 'bcryptjs';

const zoneNames = [
  'Sadar', 'North', 'South', 'East', 'West', 'Central', 'Uposhahar', 'New Town',
  'Town Hall', 'Bus Terminal', 'Station Road', 'College Road'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedJails = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   🏢 SEEDING JAILS, BLOCKS & CELLS');
    console.log('═══════════════════════════════════════════════\n');

    const districtResult = await pool.query(
      'SELECT DISTINCT district FROM thana ORDER BY district'
    );

    if (districtResult.rows.length === 0) {
      console.error('❌ No districts found. Please seed thanas first.');
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash('jail@123', 10);

    let jailCount = 0;
    let blockCount = 0;
    let cellCount = 0;

    for (const row of districtResult.rows) {
      const district = row.district;
      const jailName = `${district} District Jail`;
      const emailLocal = jailName.toLowerCase().replace(/[^a-z]/g, '');
      const email = `${emailLocal}@jail.gov.bd`;
      const zone = pick(zoneNames);
      const address = `${zone}, ${district}`;
      const capacity = Math.floor(Math.random() * 2000) + 800;

      const jailRes = await pool.query(
        `
          INSERT INTO jail (jail_name, district, zone, address, capacity, email, password)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING jail_id
        `,
        [jailName, district, zone, address, capacity, email, passwordHash]
      );

      jailCount++;
      const jailId = jailRes.rows[0].jail_id;

      for (let b = 1; b <= 5; b++) {
        const blockName = `Block ${String.fromCharCode(64 + b)}`;
        const blockCapacity = Math.floor(Math.random() * 300) + 150;

        const blockRes = await pool.query(
          `
            INSERT INTO cell_block (jail_id, block_name, capacity)
            VALUES ($1, $2, $3)
            RETURNING block_id
          `,
          [jailId, blockName, blockCapacity]
        );

        blockCount++;
        const blockId = blockRes.rows[0].block_id;

        for (let c = 1; c <= 5; c++) {
          const cellNumber = `${blockName}-${c}`;
          const cellCapacity = Math.floor(Math.random() * 6) + 2;

          await pool.query(
            `
              INSERT INTO cell (block_id, cell_number, capacity, status, number_of_people)
              VALUES ($1, $2, $3, 'available', 0)
            `,
            [blockId, cellNumber, cellCapacity]
          );

          cellCount++;
        }
      }

      if (jailCount % 5 === 0) {
        console.log(`✅ Inserted ${jailCount} jails...`);
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Jails inserted: ${jailCount}`);
    console.log(`✅ Cell blocks inserted: ${blockCount}`);
    console.log(`✅ Cells inserted: ${cellCount}`);

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Jail seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedJails();
