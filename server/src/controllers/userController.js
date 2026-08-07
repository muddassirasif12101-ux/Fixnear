import { getDb } from '../config/database.js';

export async function getProfile(req, res, next) {
  try {
    const db = getDb();
    const [rows] = await db.query('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name } = req.body;
    const db = getDb();
    await db.query('UPDATE users SET name = ?, updated_at = NOW() WHERE id = ?', [name, req.user.id]);
    res.json({ success: true, data: { name } });
  } catch (error) {
    next(error);
  }
}
