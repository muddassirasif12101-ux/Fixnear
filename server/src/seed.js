import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { connectDatabase } from './config/database.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seed = async () => {
  const schemaSql = fs.readFileSync(path.resolve(__dirname, '..', '..', 'database', 'schema.sql'), 'utf8');

  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });
  await tempConnection.query(schemaSql);
  await tempConnection.end();

  const db = await connectDatabase();

  const passwordCustomer = await bcrypt.hash('Customer@123', 10);
  const passwordProvider = await bcrypt.hash('Provider@123', 10);
  const passwordAdmin = await bcrypt.hash('Admin@123', 10);

  await db.query(`INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
    VALUES
    ('Demo Customer', 'customer@fixnear.local', ?, 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
    ('Demo Provider', 'provider@fixnear.local', ?, 'PROVIDER', 'ACTIVE', NOW(), NOW()),
    ('Demo Admin', 'admin@fixnear.local', ?, 'ADMIN', 'ACTIVE', NOW(), NOW())
    ON DUPLICATE KEY UPDATE email = email`, [passwordCustomer, passwordProvider, passwordAdmin]);

  await db.query(`INSERT IGNORE INTO customer_profiles (user_id, phone) SELECT id, '03001234567' FROM users WHERE email = 'customer@fixnear.local'`);
  await db.query(`INSERT IGNORE INTO provider_profiles (user_id, display_name, verification_status, experience_years, profile_photo_url, service_area_description)
    SELECT id, 'Ali Ahmad', 'VERIFIED', 5, 'https://via.placeholder.com/200', 'Islamabad, Rawalpindi' FROM users WHERE email = 'provider@fixnear.local'`);

  await db.query(`INSERT IGNORE INTO service_categories (name, slug, description)
    VALUES
      ('AC & Refrigeration', 'ac-refrigeration', 'Air conditioning and refrigeration services.'),
      ('Electrical', 'electrical', 'Electrical repairs, wiring and troubleshooting.'),
      ('Plumbing', 'plumbing', 'Plumbing and drainage solutions.'),
      ('General Maintenance', 'general-maintenance', 'Home maintenance and handyman support.')`);

  await db.query(`INSERT IGNORE INTO services (category_id, name, slug, description, base_price_min, base_price_max)
    SELECT id, 'AC Repair & Maintenance', 'ac-repair-maintenance', 'Repair, servicing and maintenance for AC systems.', 2500, 5500 FROM service_categories WHERE slug = 'ac-refrigeration'
    UNION ALL
    SELECT id, 'Electrician', 'electrician', 'Electrical repairs, outlets, switches and wiring.', 1200, 3500 FROM service_categories WHERE slug = 'electrical'
    UNION ALL
    SELECT id, 'Plumbing', 'plumbing', 'Plumbing repairs, leaks, and pipe installations.', 1000, 4200 FROM service_categories WHERE slug = 'plumbing'
    UNION ALL
    SELECT id, 'Home Repair & Handyman', 'home-repair-handyman', 'Minor home repairs, furniture assembly, and general maintenance.', 900, 3200 FROM service_categories WHERE slug = 'general-maintenance'`);

  await db.query(`INSERT INTO provider_services (provider_id, service_id, price_min, price_max, description)
    SELECT p.id, s.id, 2800, 5200, 'Experienced AC technician available across Islamabad and Rawalpindi.'
    FROM users p
    JOIN services s ON s.slug = 'ac-repair-maintenance'
    WHERE p.email = 'provider@fixnear.local'
      AND NOT EXISTS (SELECT 1 FROM provider_services ps WHERE ps.provider_id = p.id AND ps.service_id = s.id)`);

  await db.query(`INSERT INTO service_areas (provider_id, city, area, postal_code)
    SELECT u.id, 'Islamabad', 'F-10', '44000' FROM users u WHERE u.email = 'provider@fixnear.local'
      AND NOT EXISTS (SELECT 1 FROM service_areas sa WHERE sa.provider_id = u.id AND sa.area = 'F-10')
    UNION ALL
    SELECT u.id, 'Rawalpindi', 'Gulzar-e-Quaid', '46000' FROM users u WHERE u.email = 'provider@fixnear.local'
      AND NOT EXISTS (SELECT 1 FROM service_areas sa WHERE sa.provider_id = u.id AND sa.area = 'Gulzar-e-Quaid')`);

  await db.query(`INSERT INTO addresses (customer_id, label, street, area, city, postal_code, latitude, longitude)
    SELECT u.id, 'Home', '123 Blue Area Road', 'Blue Area', 'Islamabad', '44000', 33.6938, 73.0652
    FROM users u WHERE u.email = 'customer@fixnear.local'
      AND NOT EXISTS (SELECT 1 FROM addresses a WHERE a.customer_id = u.id AND a.label = 'Home')`);

  await db.query(`INSERT INTO bookings (customer_id, provider_id, service_id, description, address_id, preferred_at, status, requested_price, final_price, created_at, updated_at)
    SELECT c.id, p.id, s.id, 'My AC is running but not cooling the room.', a.id, DATE_ADD(NOW(), INTERVAL 2 DAY), 'COMPLETED', 3200, 3200, NOW(), NOW()
    FROM users c
    JOIN users p ON p.email = 'provider@fixnear.local'
    JOIN services s ON s.slug = 'ac-repair-maintenance'
    JOIN addresses a ON a.customer_id = c.id
    WHERE c.email = 'customer@fixnear.local'
      AND NOT EXISTS (SELECT 1 FROM bookings b WHERE b.customer_id = c.id AND b.provider_id = p.id AND b.status = 'COMPLETED')`);

  await db.query(`INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment)
    SELECT b.id, b.customer_id, b.provider_id, 5, 'Very professional and the AC is now cooling perfectly.'
    FROM bookings b
    WHERE b.customer_id = (SELECT id FROM users WHERE email = 'customer@fixnear.local')
      AND b.provider_id = (SELECT id FROM users WHERE email = 'provider@fixnear.local')
      AND b.status = 'COMPLETED'
      AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.booking_id = b.id)`);

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
