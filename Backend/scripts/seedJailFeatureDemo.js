import pool from "../src/config/dbConnection.js";
import bcrypt from "bcryptjs";

const DEMO_JAIL_ID = "JAL-9000001";
const DEMO_JAIL_PASSWORD = "12345678";
const DEST_JAIL_ID = "JAL-9000002";
const DEMO_THANA_ID = "THN-9000001";

async function ensureAdmin(client) {
  const existing = await client.query("SELECT admin_id FROM admin WHERE username = $1 LIMIT 1", ["admin"]);
  if (existing.rows[0]) return existing.rows[0].admin_id;

  const hashed = await bcrypt.hash("admin123", 10);
  const created = await client.query(
    `INSERT INTO admin (admin_id, full_name, username, email, password)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (admin_id) DO UPDATE SET full_name = EXCLUDED.full_name
     RETURNING admin_id`,
    ["ADM-9000001", "System Admin", "admin", "admin@demo.local", hashed]
  );
  return created.rows[0].admin_id;
}

async function ensureThana(client, adminId) {
  await client.query(
    `INSERT INTO thana (thana_id, thana_name, district, zone, address, phone, email, password, created_by_admin_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (thana_id) DO UPDATE SET thana_name = EXCLUDED.thana_name`,
    [
      DEMO_THANA_ID,
      "Demo Central Thana",
      "Dhaka",
      "Zone-9",
      "Demo Police Line, Dhaka",
      "01990000001",
      "demo-thana@demo.local",
      await bcrypt.hash("12345678", 10),
      adminId,
    ]
  );
}

async function ensureJails(client) {
  const jailPass = await bcrypt.hash(DEMO_JAIL_PASSWORD, 10);
  const jailPass2 = await bcrypt.hash(DEMO_JAIL_PASSWORD, 10);

  await client.query(
    `INSERT INTO jail (jail_id, jail_name, district, zone, address, capacity, email, password)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (jail_id) DO UPDATE SET
       jail_name = EXCLUDED.jail_name,
       district = EXCLUDED.district,
       zone = EXCLUDED.zone,
       address = EXCLUDED.address,
       capacity = EXCLUDED.capacity,
       email = EXCLUDED.email`,
    [
      DEMO_JAIL_ID,
      "Demo Feature Jail",
      "Dhaka",
      "North",
      "Demo Jail Complex, Dhaka",
      220,
      "jail-demo-feature@demo.local",
      jailPass,
    ]
  );

  await client.query(
    `INSERT INTO jail (jail_id, jail_name, district, zone, address, capacity, email, password)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (jail_id) DO UPDATE SET
       jail_name = EXCLUDED.jail_name,
       district = EXCLUDED.district,
       zone = EXCLUDED.zone,
       address = EXCLUDED.address,
       capacity = EXCLUDED.capacity,
       email = EXCLUDED.email`,
    [
      DEST_JAIL_ID,
      "Demo Transfer Destination Jail",
      "Dhaka",
      "South",
      "Demo Destination Jail, Dhaka",
      180,
      "jail-demo-destination@demo.local",
      jailPass2,
    ]
  );
}

async function ensureBlocksAndCells(client) {
  const blocks = [
    { id: "CLB-9100001", jailId: DEMO_JAIL_ID, name: "Alpha", capacity: 90 },
    { id: "CLB-9100002", jailId: DEMO_JAIL_ID, name: "Bravo", capacity: 70 },
    { id: "CLB-9100003", jailId: DEMO_JAIL_ID, name: "Charlie", capacity: 60 },
    { id: "CLB-9200001", jailId: DEST_JAIL_ID, name: "Delta", capacity: 80 },
    { id: "CLB-9200002", jailId: DEST_JAIL_ID, name: "Echo", capacity: 60 },
  ];

  for (const b of blocks) {
    await client.query(
      `INSERT INTO cell_block (block_id, jail_id, block_name, capacity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (block_id) DO UPDATE SET
         jail_id = EXCLUDED.jail_id,
         block_name = EXCLUDED.block_name,
         capacity = EXCLUDED.capacity`,
      [b.id, b.jailId, b.name, b.capacity]
    );
  }

  const cells = [
    ["CEL-9100001", "CLB-9100001", "A-101", 4],
    ["CEL-9100002", "CLB-9100001", "A-102", 4],
    ["CEL-9100003", "CLB-9100001", "A-103", 6],
    ["CEL-9100004", "CLB-9100001", "A-104", 6],
    ["CEL-9100005", "CLB-9100002", "B-201", 5],
    ["CEL-9100006", "CLB-9100002", "B-202", 5],
    ["CEL-9100007", "CLB-9100002", "B-203", 4],
    ["CEL-9100008", "CLB-9100003", "C-301", 3],
    ["CEL-9100009", "CLB-9100003", "C-302", 3],
    ["CEL-9100010", "CLB-9100003", "C-303", 3],
    ["CEL-9200001", "CLB-9200001", "D-101", 5],
    ["CEL-9200002", "CLB-9200001", "D-102", 5],
    ["CEL-9200003", "CLB-9200002", "E-201", 4],
    ["CEL-9200004", "CLB-9200002", "E-202", 4],
  ];

  for (const [cellId, blockId, cellNumber, capacity] of cells) {
    await client.query(
      `INSERT INTO cell (cell_id, block_id, cell_number, capacity, status, number_of_people)
       VALUES ($1, $2, $3, $4, 'available', 0)
       ON CONFLICT (cell_id) DO UPDATE SET
         block_id = EXCLUDED.block_id,
         cell_number = EXCLUDED.cell_number,
         capacity = EXCLUDED.capacity`,
      [cellId, blockId, cellNumber, capacity]
    );
  }
}

async function ensureCriminalsArrestsIncarcerations(client) {
  const criminals = [
    ["CRM-9100001", "Rakib Hasan", "199001000001", "male", "in_custody", "Father-1", "Mother-1", "1988-03-11"],
    ["CRM-9100002", "Nayeem Kabir", "199001000002", "male", "in_custody", "Father-2", "Mother-2", "1991-07-18"],
    ["CRM-9100003", "Sabbir Ahmed", "199001000003", "male", "in_custody", "Father-3", "Mother-3", "1989-01-22"],
    ["CRM-9100004", "Mahfuz Rahman", "199001000004", "male", "in_custody", "Father-4", "Mother-4", "1994-05-09"],
    ["CRM-9100005", "Tania Sultana", "199001000005", "female", "in_custody", "Father-5", "Mother-5", "1992-09-13"],
    ["CRM-9100006", "Farzana Akter", "199001000006", "female", "in_custody", "Father-6", "Mother-6", "1990-12-01"],
    ["CRM-9100007", "Mizanur Alam", "199001000007", "male", "in_custody", "Father-7", "Mother-7", "1987-02-15"],
    ["CRM-9100008", "Sajid Bin Noor", "199001000008", "male", "in_custody", "Father-8", "Mother-8", "1993-08-30"],
  ];

  for (const [id, name, nid, gender, status, father, mother, birthDate] of criminals) {
    await client.query(
      `INSERT INTO criminal (
        criminal_id, full_name, nid, status, risk_level, registered_thana_id,
        father_name, mother_name, birth_date, gender, nationality, permanent_address, current_address
      ) VALUES ($1, $2, $3, $4, 4, $5, $6, $7, $8, $9, 'Bangladeshi', $10, $11)
      ON CONFLICT (criminal_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        status = EXCLUDED.status,
        registered_thana_id = EXCLUDED.registered_thana_id`,
      [
        id,
        name,
        nid,
        status,
        DEMO_THANA_ID,
        father,
        mother,
        birthDate,
        gender,
        `Village ${id.slice(-2)}, Dhaka`,
        `Holding ${id.slice(-2)}, Dhaka`,
      ]
    );
  }

  const arrestData = criminals.map(([criminalId], idx) => [
    `ARS-910000${idx + 1}`,
    criminalId,
    `2025-0${(idx % 8) + 1}-15`,
    DEMO_THANA_ID,
    `CASE-DFJ-${idx + 1}`,
  ]);

  for (const [arrestId, criminalId, arrestDate, thanaId, caseRef] of arrestData) {
    await client.query(
      `INSERT INTO arrest_record (arrest_id, criminal_id, arrest_date, custody_status, thana_id, case_reference)
       VALUES ($1, $2, $3, 'in_custody', $4, $5)
       ON CONFLICT (arrest_id) DO UPDATE SET
         custody_status = 'in_custody',
         thana_id = EXCLUDED.thana_id`,
      [arrestId, criminalId, arrestDate, thanaId, caseRef]
    );
  }

  const incarcerationRows = [
    ["INC-9100001", "ARS-9100001", "CEL-9100001"],
    ["INC-9100002", "ARS-9100002", "CEL-9100001"],
    ["INC-9100003", "ARS-9100003", "CEL-9100002"],
    ["INC-9100004", "ARS-9100004", "CEL-9100003"],
    ["INC-9100005", "ARS-9100005", "CEL-9100004"],
    ["INC-9100006", "ARS-9100006", "CEL-9100005"],
    ["INC-9100007", "ARS-9100007", "CEL-9100006"],
    ["INC-9100008", "ARS-9100008", "CEL-9100008"],
  ];

  for (const [incId, arrestId, cellId] of incarcerationRows) {
    await client.query(
      `INSERT INTO incarceration (incarceration_id, jail_id, arrest_id, cell_id, admitted_at)
       VALUES ($1, $2, $3, $4, NOW() - INTERVAL '10 days')
       ON CONFLICT (incarceration_id) DO UPDATE SET
         jail_id = EXCLUDED.jail_id,
         arrest_id = EXCLUDED.arrest_id,
         cell_id = EXCLUDED.cell_id,
         released_at = NULL`,
      [incId, DEMO_JAIL_ID, arrestId, cellId]
    );
  }

  await client.query(
    `UPDATE cell ce
     SET number_of_people = COALESCE(src.cnt, 0),
         status = CASE
           WHEN COALESCE(src.cnt, 0) <= 0 THEN 'available'
           WHEN COALESCE(src.cnt, 0) >= ce.capacity THEN 'occupied'
           ELSE 'available'
         END
     FROM (
       SELECT i.cell_id, COUNT(*)::INT AS cnt
       FROM incarceration i
       WHERE i.released_at IS NULL
       GROUP BY i.cell_id
     ) src
     WHERE ce.cell_id = src.cell_id OR ce.cell_id LIKE 'CEL-91%' OR ce.cell_id LIKE 'CEL-92%'`
  );
}

async function normalizeCriminalDataAndOccupancy(client) {
  const fallbackThana = await client.query("SELECT thana_id FROM thana ORDER BY thana_id LIMIT 1");
  const fallbackThanaId = fallbackThana.rows[0]?.thana_id || DEMO_THANA_ID;

  await client.query(
    `
    UPDATE criminal c
    SET
      registered_thana_id = COALESCE(c.registered_thana_id, $1),
      gender = CASE
        WHEN LOWER(COALESCE(c.gender, '')) = 'female' THEN 'female'
        ELSE 'male'
      END,
      birth_date = COALESCE(
        c.birth_date,
        (DATE '1982-01-01' + ((ABS(hashtext(c.criminal_id)) % 7000)::TEXT || ' days')::INTERVAL)::DATE
      ),
      father_name = COALESCE(NULLIF(TRIM(c.father_name), ''), 'Md. Rahman ' || RIGHT(c.criminal_id, 3)),
      mother_name = COALESCE(NULLIF(TRIM(c.mother_name), ''), 'Amena Khatun ' || RIGHT(c.criminal_id, 3)),
      aliases = COALESCE(NULLIF(TRIM(c.aliases), ''), 'Alias-' || RIGHT(c.criminal_id, 4)),
      nationality = COALESCE(NULLIF(TRIM(c.nationality), ''), 'Bangladeshi'),
      permanent_address = COALESCE(NULLIF(TRIM(c.permanent_address), ''), 'Permanent Address ' || c.criminal_id || ', Dhaka'),
      current_address = COALESCE(NULLIF(TRIM(c.current_address), ''), 'Current Address ' || c.criminal_id || ', Dhaka'),
      identifying_marks = COALESCE(NULLIF(TRIM(c.identifying_marks), ''), 'Scar on left hand'),
      image_url = COALESCE(NULLIF(TRIM(c.image_url), ''), 'https://ui-avatars.com/api/?name=' || REPLACE(COALESCE(c.full_name, c.criminal_id), ' ', '+')),
      status = CASE
        WHEN EXISTS (
          SELECT 1
          FROM incarceration i
          JOIN arrest_record ar ON ar.arrest_id = i.arrest_id
          WHERE ar.criminal_id = c.criminal_id
            AND i.released_at IS NULL
        ) THEN 'in_custody'
        WHEN c.status IN ('on_bail', 'wanted', 'escaped') THEN c.status
        ELSE 'released'
      END
    `,
    [fallbackThanaId]
  );

  await client.query(
    `
    UPDATE arrest_record ar
    SET custody_status = CASE
      WHEN EXISTS (
        SELECT 1 FROM incarceration i
        WHERE i.arrest_id = ar.arrest_id
          AND i.released_at IS NULL
      ) THEN 'in_custody'
      WHEN ar.custody_status = 'on_bail' THEN 'on_bail'
      ELSE 'released'
    END
    `
  );

  await client.query(
    `
    UPDATE cell ce
    SET
      number_of_people = COALESCE(src.cnt, 0),
      status = CASE
        WHEN ce.status = 'maintenance' THEN 'maintenance'
        WHEN COALESCE(src.cnt, 0) >= ce.capacity THEN 'occupied'
        ELSE 'available'
      END
    FROM (
      SELECT c2.cell_id, COALESCE(ai.cnt, 0)::INT AS cnt
      FROM cell c2
      LEFT JOIN (
        SELECT cell_id, COUNT(*)::INT AS cnt
        FROM incarceration
        WHERE released_at IS NULL AND cell_id IS NOT NULL
        GROUP BY cell_id
      ) ai ON ai.cell_id = c2.cell_id
    ) src
    WHERE ce.cell_id = src.cell_id
    `
  );
}

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const adminId = await ensureAdmin(client);
    await ensureThana(client, adminId);
    await ensureJails(client);
    await ensureBlocksAndCells(client);
    await ensureCriminalsArrestsIncarcerations(client);
    await normalizeCriminalDataAndOccupancy(client);

    await client.query("COMMIT");

    console.log("\n✅ Demo jail feature data ready.");
    console.log(`Jail Login ID: ${DEMO_JAIL_ID}`);
    console.log(`Jail Password: ${DEMO_JAIL_PASSWORD}`);
    console.log(`Destination Jail ID for transfer tests: ${DEST_JAIL_ID}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to seed demo data:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
