import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fixnear_secret';
const JWT_EXPIRES_IN = '7d';

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const db = getDb();

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, email, passwordHash, role]
    );

    if (role === 'CUSTOMER') {
      await db.query('INSERT INTO customer_profiles (user_id, created_at, updated_at) VALUES (?, NOW(), NOW())', [result.insertId]);
    }

    if (role === 'PROVIDER') {
      await db.query(
        'INSERT INTO provider_profiles (user_id, display_name, verification_status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [result.insertId, name, 'REGISTERED']
      );
    }

    const user = { id: result.insertId, name, email, role };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const db = getDb();
    const [rows] = await db.query('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email]);

    if (!rows.length) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const tokenPayload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ success: true, data: { user: tokenPayload, token } });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const db = getDb();
    const [rows] = await db.query('SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}
