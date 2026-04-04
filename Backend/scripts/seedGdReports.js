import pool from '../src/config/dbConnection.js';

const gdTypes = [
  'theft', 'lost_document', 'missing_person', 'accident', 'assault', 'robbery',
  'fraud', 'domestic_violence', 'property_dispute', 'suspicious_activity',
  'threat', 'noise_disturbance', 'other'
];

const statuses = ['submitted', 'assigned', 'approved', 'rejected'];

const gdTypeDescriptions = {
  theft: [
    'Mobile phone stolen from a rickshaw stand.',
    'Bicycle stolen from outside the shop.',
    'Wallet stolen from the bus terminal area.',
    'Bag stolen during crowded bazar hours.',
    'Motorcycle mirror stolen from roadside parking.'
  ],
  lost_document: [
    'Lost national ID card while traveling. Requesting GD entry.',
    'Driving license lost near the market area.',
    'Passport lost during commute to the district town.',
    'Birth certificate lost during relocation.',
    'Land deed documents lost after office visit.'
  ],
  missing_person: [
    'Missing person reported from the local bazar area.',
    'Family member did not return home since yesterday evening.',
    'Child went missing near the school premises.',
    'Elderly person missing since morning prayer time.',
    'Worker missing after leaving for work.'
  ],
  accident: [
    'Minor road accident reported, no serious injuries.',
    'Motorbike collision near the highway crossing.',
    'Bus and rickshaw collision reported at the intersection.',
    'Pedestrian hit by a speeding vehicle near the market.',
    'Bicycle accident reported at the bridge approach.'
  ],
  assault: [
    'Assault reported during a dispute in the neighborhood.',
    'Shopkeeper reported being attacked by unknown persons.',
    'Physical altercation reported near the bus stand.',
    'Assault reported during a property disagreement.',
    'Street fight reported late at night.'
  ],
  robbery: [
    'Robbery attempt reported at the roadside.',
    'Cash and valuables snatched near the market.',
    'House break-in reported at night; valuables missing.',
    'Shop burglary reported after closing hours.',
    'Robbery reported during a night bus journey.'
  ],
  fraud: [
    'Fraud incident involving mobile banking reported.',
    'Online payment scam reported by the complainant.',
    'Fake product delivery scam reported in the area.',
    'Impersonation fraud reported with bank account details.',
    'Loan scam reported with forged documents.'
  ],
  domestic_violence: [
    'Domestic dispute reported by neighbors; requesting intervention.',
    'Family conflict reported; requesting counseling and GD entry.',
    'Repeated harassment reported by a family member.',
    'Verbal and physical abuse reported at home.',
    'Threats reported by spouse; seeking legal record.'
  ],
  property_dispute: [
    'Property boundary dispute between two families.',
    'Land ownership dispute reported; requesting GD entry.',
    'Boundary wall conflict reported with neighbors.',
    'Dispute over inherited land reported by siblings.',
    'Tenant eviction dispute reported by landlord.'
  ],
  suspicious_activity: [
    'Unknown persons loitering around the area; residents feel unsafe.',
    'Suspicious vehicle parked for several hours near the school.',
    'Strange movements observed near the warehouse at night.',
    'Suspicious individuals seen near ATM booths.',
    'Unidentified package left near public place.'
  ],
  threat: [
    'Threat received over phone; requesting a GD for record.',
    'Extortion threat received by the shop owner.',
    'Anonymous threats sent via messaging app.',
    'Threats received regarding business dispute.',
    'Unknown person threatened by letter.'
  ],
  noise_disturbance: [
    'Noise disturbance reported late at night in the neighborhood.',
    'Loud music reported from a community event after midnight.',
    'Construction noise reported during prohibited hours.',
    'High volume sound system reported during religious event.',
    'Night-time generator noise reported by residents.'
  ],
  other: [
    'General complaint filed for record keeping.',
    'Public nuisance reported in the area.',
    'Miscellaneous incident reported for documentation.',
    'Local dispute reported; requesting police record.',
    'Incident reported for future reference.'
  ]
};

const districtPlaces = {
  Dhaka: ['Motijheel', 'Shahbagh', 'Farmgate', 'Sadarghat', 'Gulistan', 'Mirpur-10'],
  Gazipur: ['Tongi', 'Konabari', 'Board Bazar', 'Chowrasta', 'Sreepur', 'Kaliganj'],
  Tangail: ['Tangail Sadar', 'Santosh', 'Elenga', 'Ghatail', 'Mirzapur', 'Kalihati'],
  Munshiganj: ['Mawa', 'Sreenagar', 'Sirajdikhan', 'Louhajang', 'Tongibari', 'Mirkadim'],
  Chattogram: ['Agrabad', 'GEC', 'Nasirabad', 'Panchlaish', 'Patenga', 'Kotwali'],
  Rajshahi: ['Shaheb Bazar', 'Boalia', 'Motihar', 'Rajpara', 'Paba', 'Godagari'],
  Khulna: ['Sonadanga', 'Khalishpur', 'Daulatpur', 'Shib Bari', 'Boyra', 'Rupsha'],
  Barishal: ['Sadar Road', 'Nathullabad', 'Rupatali', 'Band Road', 'Kawnia', 'Battala'],
  Sylhet: ['Zindabazar', 'Amberkhana', 'Modina Market', 'Bandar Bazar', 'Jalalabad', 'South Surma'],
  Rangpur: ['Jahaj Company', 'Guptapara', 'Modern', 'Shapla Chattar', 'Haragach', 'Mithapukur'],
  Narayanganj: ['Chashara', 'Bandar', 'Fatullah', 'Shiddhirganj', 'Sonargaon', 'Rupganj'],
  Narsingdi: ['Palash', 'Shibpur', 'Raipura', 'Belabo', 'Monohardi', 'Sadar'],
  Manikganj: ['Sadar', 'Singair', 'Saturia', 'Harirampur', 'Ghior', 'Shibalaya'],
  Faridpur: ['Sadar', 'Bhanga', 'Nagarkanda', 'Boalmari', 'Madhukhali', 'Alfadanga'],
  Rajbari: ['Sadar', 'Goalanda', 'Pangsha', 'Kalukhali', 'Baliakandi', 'Banshpara'],
  Madaripur: ['Sadar', 'Shibchar', 'Rajoir', 'Kalkini', 'Dasar', 'Charmuguria'],
  Shariatpur: ['Sadar', 'Naria', 'Zajira', 'Bhedarganj', 'Damudya', 'Gosairhat'],
  Gopalganj: ['Sadar', 'Kotalipara', 'Kashiani', 'Muksudpur', 'Tungipara', 'Ulpur'],
  Kishoreganj: ['Sadar', 'Bhairab', 'Bajitpur', 'Itna', 'Kuliarchar', 'Tarail'],
  Mymensingh: ['Sadar', 'Ganginar Par', 'Muktagacha', 'Trishal', 'Gouripur', 'Ishwarganj']
};

const fallbackPlaces = [
  'Bus Stand', 'Railway Station', 'Market Area', 'College Gate', 'Hospital Road',
  'Court Road', 'New Town', 'Old Town', 'City Center', 'Bazar Road',
  'Town Hall', 'Stadium Road', 'River Ghat', 'Industrial Area'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDateWithinYears = (years) => {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - years);
  const time = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(time).toISOString().split('T')[0];
};

const seedGdReports = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   🧾 SEEDING GD REPORTS DATA');
    console.log('═══════════════════════════════════════════════\n');

    const thanasResult = await pool.query(
      'SELECT thana_id, thana_name, district FROM thana ORDER BY thana_id'
    );
    const usersResult = await pool.query('SELECT user_id FROM "user" ORDER BY user_id');
    const officersResult = await pool.query('SELECT officer_id, thana_id FROM officer ORDER BY officer_id');
    const existingGdResult = await pool.query('SELECT COUNT(*)::int AS count FROM gd_report');
    const existingCount = existingGdResult.rows[0].count;

    if (thanasResult.rows.length === 0) {
      console.error('❌ No thanas found. Please seed thanas first.');
      process.exit(1);
    }
    if (usersResult.rows.length === 0) {
      console.error('❌ No users found. Please seed users first.');
      process.exit(1);
    }
    if (officersResult.rows.length === 0) {
      console.error('❌ No officers found. Please seed officers first.');
      process.exit(1);
    }

    const userIds = usersResult.rows.map((r) => r.user_id);
    const officersByThana = new Map();
    for (const row of officersResult.rows) {
      if (!officersByThana.has(row.thana_id)) {
        officersByThana.set(row.thana_id, []);
      }
      officersByThana.get(row.thana_id).push(row.officer_id);
    }

    let successCount = 0;
    let errorCount = 0;

    if (existingCount > 0) {
      console.log(`🔁 Found ${existingCount} existing GD reports. Updating entries...\n`);

      const gdRows = await pool.query(
        'SELECT gd_id, thana_id FROM gd_report ORDER BY gd_id'
      );

      const thanaMap = new Map(thanasResult.rows.map((t) => [t.thana_id, t]));

      for (const gd of gdRows.rows) {
        const thana = thanaMap.get(gd.thana_id);
        if (!thana) {
          continue;
        }

        const status = pick(statuses);
        const gdType = pick(gdTypes);
        const description = pick(gdTypeDescriptions[gdType]);
        const placeList = districtPlaces[thana.district] || fallbackPlaces;
        const incidentPlace = pick(placeList);
        const assignedOfficer = (officersByThana.get(thana.thana_id) || []).length
          ? pick(officersByThana.get(thana.thana_id))
          : null;
        const approvedOfficer = status === 'approved' ? assignedOfficer : null;

        try {
          await pool.query(
            `
              UPDATE gd_report
              SET user_id = $1,
                  gd_type = $2,
                  description = $3,
                  incident_date = $4,
                  incident_location = $5,
                  status = $6,
                  approved_by_officer_id = $7,
                  assigned_officer_id = $8
              WHERE gd_id = $9
            `,
            [
              pick(userIds),
              gdType,
              description,
              randomDateWithinYears(2),
              `${incidentPlace}, ${thana.thana_name}, ${thana.district}`,
              status,
              approvedOfficer,
              assignedOfficer,
              gd.gd_id
            ]
          );
          successCount++;
          if (successCount % 200 === 0) {
            console.log(`✅ Updated ${successCount} GD reports...`);
          }
        } catch (error) {
          errorCount++;
          if (errorCount <= 5) {
            console.error(`❌ Failed to update GD ${gd.gd_id}: ${error.message}`);
          }
        }
      }

      console.log('\n═══════════════════════════════════════════════');
      console.log('📊 UPDATE SUMMARY');
      console.log('═══════════════════════════════════════════════');
      console.log(`✅ Successfully updated: ${successCount}`);
      console.log(`❌ Failed updates: ${errorCount}`);

      console.log('\n═══════════════════════════════════════════════');
      console.log('✅ GD update completed successfully!');
      console.log('═══════════════════════════════════════════════\n');

      process.exit(0);
    }

    for (const thana of thanasResult.rows) {
      const officers = officersByThana.get(thana.thana_id) || [];

      for (let i = 0; i < 20; i++) {
        const status = pick(statuses);
        const gdType = pick(gdTypes);
        const description = pick(gdTypeDescriptions[gdType]);
        const placeList = districtPlaces[thana.district] || fallbackPlaces;
        const incidentPlace = pick(placeList);
        const assignedOfficer = officers.length ? pick(officers) : null;
        const approvedOfficer = status === 'approved' ? assignedOfficer : null;

        try {
          await pool.query(
            `
              INSERT INTO gd_report (
                user_id, thana_id, gd_type, description, incident_date,
                incident_location, status, approved_by_officer_id, assigned_officer_id
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            `,
            [
              pick(userIds),
              thana.thana_id,
              gdType,
              description,
              randomDateWithinYears(2),
              `${incidentPlace}, ${thana.thana_name}, ${thana.district}`,
              status,
              approvedOfficer,
              assignedOfficer
            ]
          );
          successCount++;
          if (successCount % 200 === 0) {
            console.log(`✅ Inserted ${successCount} GD reports...`);
          }
        } catch (error) {
          errorCount++;
          if (errorCount <= 5) {
            console.error(`❌ Failed to insert GD for ${thana.thana_name}: ${error.message}`);
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
    console.log('✅ GD seeding completed successfully!');
    console.log('═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedGdReports();
