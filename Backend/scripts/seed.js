import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import pool from '../src/config/dbConnection.js';

const seed = async () => {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting Massive Seed Process...');
        
        // --- PRE-HASH PASSWORDS ---
        console.log('🔐 Hashing passwords...');
        const SALT_ROUNDS = 10;
        const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
        const userPassword = await bcrypt.hash('password123', SALT_ROUNDS);
        const officerPassword = await bcrypt.hash('police123', SALT_ROUNDS);
        const thanaPassword = await bcrypt.hash('thana123', SALT_ROUNDS);

        await client.query('BEGIN');

        // --- 0. Clean Slate ---
        console.log('🧹 Clearing existing data...');
        // We truncate id_sequences too, so we must re-populate it immediately after
        await client.query(`
            TRUNCATE TABLE 
            criminal_location, bail_record, incarceration, arrest_record, 
            cell, cell_block, jail, case_file, criminal_relation, 
            criminal_organization, organization, criminal, gd_report, 
            "user", officer, thana, admin, location, id_sequences
            RESTART IDENTITY CASCADE;
        `);

        // --- 1. Re-Initialize ID Sequences (CRITICAL FIX) ---
        console.log('🔄 Re-initializing ID Sequences...');
        await client.query(`
            INSERT INTO id_sequences (prefix, current_value) VALUES
            ('ADM', 0), ('USR', 0), ('OFC', 0), ('THN', 0), ('CRM', 0),
            ('ORG', 0), ('CFS', 0), ('JAL', 0), ('ARS', 0), ('INC', 0),
            ('BAL', 0), ('GDR', 0), ('LOC', 0), ('CLB', 0), ('CEL', 0);
        `);

        // --- 2. Ranks ---
        console.log('...Seeding Ranks');
        await client.query(`
            INSERT INTO rank (rank_code, rank_name, level) VALUES
            ('constable', 'Constable', 1),
            ('si', 'Sub-Inspector', 2),
            ('inspector', 'Inspector', 3),
            ('oc', 'Officer-in-Charge', 4)
            ON CONFLICT DO NOTHING;
        `);

        // --- 3. Admins (20 rows) ---
        console.log('...Seeding 20 Admins');
        const adminIds = [];
        for (let i = 0; i < 20; i++) {
            const res = await client.query(`
                INSERT INTO admin (full_name, username, email, password)
                VALUES ($1, $2, $3, $4) RETURNING admin_id;
            `, [
                faker.person.fullName(),
                faker.internet.username() + Math.floor(Math.random() * 10000), 
                faker.internet.email(),
                adminPassword 
            ]);
            adminIds.push(res.rows[0].admin_id);
        }

        // --- 4. Locations (20 rows) ---
        console.log('...Seeding 20 Locations');
        const locationIds = [];
        for (let i = 0; i < 20; i++) {
            const res = await client.query(`
                INSERT INTO location (district, zone, address)
                VALUES ($1, $2, $3) RETURNING location_id;
            `, [
                faker.location.city(), 
                faker.location.state(),
                faker.location.streetAddress()
            ]);
            locationIds.push(res.rows[0].location_id);
        }

        // --- 5. Thanas (20 rows) ---
        console.log('...Seeding 20 Thanas');
        const thanaIds = [];
        for (let i = 0; i < 20; i++) {
            const res = await client.query(`
                INSERT INTO thana (thana_name, district, zone, address, phone, email, password, created_by_admin_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING thana_id;
            `, [
                faker.location.city() + ' Model Thana',
                'Dhaka', 
                faker.location.county(),
                faker.location.streetAddress(),
                faker.phone.number().slice(0, 15), 
                'thana_' + i + '@police.gov.bd', 
                thanaPassword, 
                adminIds[Math.floor(Math.random() * adminIds.length)]
            ]);
            thanaIds.push(res.rows[0].thana_id);
        }

        // --- 6. Officers (40 rows) ---
        console.log('...Seeding 40 Officers');
        const officerIds = [];
        const ranks = ['constable', 'si', 'inspector', 'oc'];
        
        for (let i = 0; i < 40; i++) {
            const assignedThana = thanaIds[i % thanaIds.length];
            const rank = (i < 20) ? 'oc' : ranks[Math.floor(Math.random() * ranks.length)];

            const res = await client.query(`
                INSERT INTO officer (badge_no, full_name, rank_code, thana_id, phone, email, password)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING officer_id;
            `, [
                'BD-' + faker.string.alphanumeric(6).toUpperCase(),
                faker.person.fullName(),
                rank,
                assignedThana,
                faker.phone.number().slice(0, 15),
                'officer_' + i + '_' + faker.internet.email(),
                officerPassword
            ]);
            officerIds.push(res.rows[0].officer_id);
        }

        // --- 7. Assign Head Officers ---
        console.log('...Assigning Head Officers');
        for (let i = 0; i < 20; i++) {
            await client.query(`
                UPDATE thana SET head_officer_id = $1 WHERE thana_id = $2
            `, [officerIds[i], thanaIds[i]]);
        }

        // --- 8. Users (25 rows) ---
        console.log('...Seeding 25 Users');
        const userIds = [];
        for (let i = 0; i < 25; i++) {
            const res = await client.query(`
                INSERT INTO "user" (full_name, nid_number, phone, email, address, password)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id;
            `, [
                faker.person.fullName(),
                faker.string.numeric(13),
                faker.phone.number().slice(0, 15),
                'user_' + i + '_' + faker.internet.email(),
                faker.location.streetAddress(),
                userPassword
            ]);
            userIds.push(res.rows[0].user_id);
        }

        // --- 9. GD Reports ---
        console.log('...Seeding GD Reports');
        for (let i = 0; i < 30; i++) {
            await client.query(`
                INSERT INTO gd_report (user_id, thana_id, description, status, assigned_officer_id)
                VALUES ($1, $2, $3, $4, $5);
            `, [
                userIds[Math.floor(Math.random() * userIds.length)],
                thanaIds[Math.floor(Math.random() * thanaIds.length)],
                faker.lorem.paragraph(),
                ['pending', 'approved', 'rejected', 'submitted'][Math.floor(Math.random() * 4)],
                officerIds[Math.floor(Math.random() * officerIds.length)]
            ]);
        }

        // --- 10. Criminals ---
        console.log('...Seeding Criminals');
        const criminalIds = [];
        for (let i = 0; i < 25; i++) {
            const res = await client.query(`
                INSERT INTO criminal (full_name, nid, status, risk_level, registered_thana_id)
                VALUES ($1, $2, $3, $4, $5) RETURNING criminal_id;
            `, [
                faker.person.fullName(),
                faker.string.numeric(17),
                ['in_custody', 'on_bail', 'released', 'escaped', 'unknown'][Math.floor(Math.random() * 5)],
                Math.floor(Math.random() * 10) + 1,
                thanaIds[Math.floor(Math.random() * thanaIds.length)]
            ]);
            criminalIds.push(res.rows[0].criminal_id);
        }

        // --- 11. Organizations ---
        console.log('...Seeding Organizations');
        const orgIds = [];
        for (let i = 0; i < 20; i++) {
            const res = await client.query(`
                INSERT INTO organization (name, ideology, threat_level)
                VALUES ($1, $2, $3) RETURNING org_id;
            `, [
                faker.company.name() + ' Gang',
                faker.company.buzzPhrase(),
                Math.floor(Math.random() * 10) + 1
            ]);
            orgIds.push(res.rows[0].org_id);
        }

        // --- 12. Jails ---
        console.log('...Seeding Jails');
        const jailIds = [];
        for (let i = 0; i < 20; i++) {
            const res = await client.query(`
                INSERT INTO jail (jail_name, district, zone, address, capacity)
                VALUES ($1, $2, $3, $4, $5) RETURNING jail_id;
            `, [
                faker.location.city() + ' Central Jail',
                'Dhaka',
                faker.location.county(),
                faker.location.streetAddress(),
                faker.number.int({ min: 500, max: 5000 })
            ]);
            jailIds.push(res.rows[0].jail_id);
        }

        // --- 13. Cell Blocks & Cells ---
        console.log('...Seeding Cells');
        const cellIds = [];
        for (const jailId of jailIds) {
            const blockRes = await client.query(`
                INSERT INTO cell_block (jail_id, block_name, capacity)
                VALUES ($1, $2, $3) RETURNING block_id;
            `, [jailId, 'Block ' + faker.string.alpha(1).toUpperCase(), 100]);
            
            const blockId = blockRes.rows[0].block_id;

            for (let k = 0; k < 2; k++) {
                const cellRes = await client.query(`
                    INSERT INTO cell (block_id, cell_number, capacity, status)
                    VALUES ($1, $2, $3, 'available') RETURNING cell_id;
                `, [blockId, 'C-' + faker.number.int({min:100, max:999}), 4]);
                cellIds.push(cellRes.rows[0].cell_id);
            }
        }

        // --- 14. Arrests ---
        console.log('...Seeding Arrests');
        const arrestIds = [];
        for (let i = 0; i < 20; i++) {
            const res = await client.query(`
                INSERT INTO arrest_record (criminal_id, arrest_date, custody_status, thana_id, case_reference)
                VALUES ($1, $2, 'in_custody', $3, $4) RETURNING arrest_id;
            `, [
                criminalIds[i % criminalIds.length],
                faker.date.past(),
                thanaIds[Math.floor(Math.random() * thanaIds.length)],
                'CASE-' + faker.string.alphanumeric(5).toUpperCase()
            ]);
            arrestIds.push(res.rows[0].arrest_id);
        }

        // --- 15. Incarceration ---
        console.log('...Seeding Incarceration');
        for (let i = 0; i < 20; i++) {
            await client.query(`
                INSERT INTO incarceration (jail_id, arrest_id, cell_id, admitted_at)
                VALUES ($1, $2, $3, NOW());
            `, [
                jailIds[i % jailIds.length],
                arrestIds[i],
                cellIds[i % cellIds.length]
            ]);
        }

        // --- 16. Cases ---
        console.log('...Seeding Cases');
        for (let i = 0; i < 20; i++) {
            await client.query(`
                INSERT INTO case_file (case_number, criminal_id, thana_id, case_type, status, description)
                VALUES ($1, $2, $3, $4, $5, $6);
            `, [
                'FILE-' + faker.string.alphanumeric(8).toUpperCase(),
                criminalIds[i % criminalIds.length],
                thanaIds[Math.floor(Math.random() * thanaIds.length)],
                ['Robbery', 'Murder', 'Fraud', 'Cybercrime'][Math.floor(Math.random() * 4)],
                ['open', 'closed', 'under_investigation'][Math.floor(Math.random() * 3)],
                faker.lorem.paragraph()
            ]);
        }

        await client.query('COMMIT');
        console.log('✅ DATABASE SEEDED WITH HASHED PASSWORDS!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Seeding Failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
};

seed();