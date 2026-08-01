const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

async function run() {
  try {
    const schemaPath = path.join(__dirname, '..', '..', 'db', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Run schema
    await db.query(sql);
    console.log('Schema applied');

    // Check admin user
    const adminEmail = 'admin@local';
    const res = await db.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (res.rowCount === 0) {
      const passwordHash = bcrypt.hashSync('password123', 10);
      await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Admin', adminEmail, passwordHash, 'admin']
      );
      console.log('Inserted admin user (email: admin@local, password: password123)');
    } else {
      console.log('Admin user already exists');
    }

    // Seed a sample customer
    const custRes = await db.query("SELECT id FROM customers WHERE name = $1", ['Sample Customer']);
    let customerId;
    if (custRes.rowCount === 0) {
      const r = await db.query(
        "INSERT INTO customers (name, contact_phone, address) VALUES ($1, $2, $3) RETURNING id",
        ['Sample Customer', '+201000000000', 'Cairo, Egypt']
      );
      customerId = r.rows[0].id;
      console.log('Inserted sample customer');
    } else {
      customerId = custRes.rows[0].id;
      console.log('Sample customer exists');
    }

    // Seed a device
    const devRes = await db.query('SELECT id FROM devices WHERE serial_number = $1', ['SN-0001']);
    let deviceId;
    if (devRes.rowCount === 0) {
      const r = await db.query(
        'INSERT INTO devices (customer_id, model, serial_number, location_description) VALUES ($1,$2,$3,$4) RETURNING id',
        [customerId, 'LG SuperCool 1.5T', 'SN-0001', 'Living room']
      );
      deviceId = r.rows[0].id;
      console.log('Inserted sample device');
    } else {
      deviceId = devRes.rows[0].id;
      console.log('Sample device exists');
    }

    // Seed a ticket
    const tickRes = await db.query('SELECT id FROM tickets WHERE title = $1', ['Sample inspection']);
    if (tickRes.rowCount === 0) {
      await db.query(
        'INSERT INTO tickets (customer_id, device_id, title, description, status) VALUES ($1,$2,$3,$4,$5)',
        [customerId, deviceId, 'Sample inspection', 'Routine inspection and cleaning', 'open']
      );
      console.log('Inserted sample ticket');
    } else {
      console.log('Sample ticket exists');
    }

    // Seed a part
    const partRes = await db.query('SELECT id FROM parts WHERE name = $1', ['Filter']);
    if (partRes.rowCount === 0) {
      await db.query('INSERT INTO parts (name, sku, quantity, threshold) VALUES ($1,$2,$3,$4)', ['Filter', 'PART-001', 10, 2]);
      console.log('Inserted sample part');
    } else {
      console.log('Sample part exists');
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during migration/seed:', err);
    process.exit(1);
  }
}

run();
