import { getDb } from '../config/database.js';

export async function getNotifications(req, res, next) {
  try {
    const db = getDb();
    const [notifications] = await db.query(
      'SELECT id, title, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { notificationId } = req.params;
    const db = getDb();
    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
