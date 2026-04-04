import pool from '../src/config/dbConnection.js';

const zones = [
  'Sadar', 'North', 'South', 'East', 'West', 'Central', 'Uposhahar', 'New Town',
  'Station Road', 'College Road', 'Bazar Area', 'Court Road', 'Railway Colony',
  'Hospital Road', 'Bus Terminal', 'Cantonment', 'Industrial Area', 'Riverside',
  'Municipal Area', 'Town Hall', 'Shapla Chattar', 'Zero Point', 'Airport Road',
  'Highway Zone', 'College Para', 'Staff Quarter', 'City Center'
];

const streets = [
  'Main Road', 'College Road', 'Station Road', 'Market Road', 'Court Road',
  'Hospital Road', 'Railway Road', 'Bus Stand Road', 'Kazipara', 'Uttara',
  'Shantinagar', 'New Market', 'Old Town', 'Jail Road', 'Shahid Minar Road',
  'Shapla Road', 'Pouro Road', 'Circuit House Road', 'Madrasa Road',
  'Post Office Road', 'Nurani Road', 'BSCIC Road', 'Bypass Road',
  'Kazi Nazrul Road', 'Bangabandhu Road', 'Lalbagh Road', 'Hazrat Road'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedLocations = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   📍 SEEDING LOCATIONS DATA');
    console.log('═══════════════════════════════════════════════\n');

    const districtResult = await pool.query(
      'SELECT DISTINCT district FROM thana ORDER BY district'
    );

    if (districtResult.rows.length === 0) {
      console.error('❌ No districts found. Please seed thanas first.');
      process.exit(1);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const row of districtResult.rows) {
      const district = row.district;

      for (let i = 0; i < 50; i++) {
        const zone = zones[i % zones.length];
        const street = pick(streets);
        const address = `${street}, ${zone}, ${district}`;

        try {
          await pool.query(
            `
              INSERT INTO location (district, address, zone)
              VALUES ($1, $2, $3)
            `,
            [district, address, zone]
          );
          successCount++;
          if (successCount % 200 === 0) {
            console.log(`✅ Inserted ${successCount} locations...`);
          }
        } catch (error) {
          errorCount++;
          if (errorCount <= 5) {
            console.error(`❌ Failed to insert location for ${district}: ${error.message}`);
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
    console.log('✅ Location seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedLocations();
