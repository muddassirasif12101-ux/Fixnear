import { getDb } from '../config/database.js';

export async function getAdminDashboard(req, res, next) {
  try {
    const db = getDb();
    const [[{ total_customers }]] = await db.query('SELECT COUNT(*) AS total_customers FROM users WHERE role = "CUSTOMER"');
    const [[{ total_providers }]] = await db.query('SELECT COUNT(*) AS total_providers FROM users WHERE role = "PROVIDER"');
    const [[{ active_bookings }]] = await db.query('SELECT COUNT(*) AS active_bookings FROM bookings WHERE status IN ("PENDING", "ACCEPTED", "PROVIDER_ON_THE_WAY", "IN_PROGRESS")');
    const [[{ completed_bookings }]] = await db.query('SELECT COUNT(*) AS completed_bookings FROM bookings WHERE status = "COMPLETED"');
    const [[{ cancelled_bookings }]] = await db.query('SELECT COUNT(*) AS cancelled_bookings FROM bookings WHERE status = "CANCELLED"');
    res.json({
      success: true,
      data: { total_customers, total_providers, active_bookings, completed_bookings, cancelled_bookings }
    });
  } catch (error) {
    next(error);
  }
}
