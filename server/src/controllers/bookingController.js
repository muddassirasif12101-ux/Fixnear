import { getDb } from '../config/database.js';

export async function createBooking(req, res, next) {
  try {
    const { service_id, description, address_id, preferred_at, images } = req.body;
    const db = getDb();
    const [result] = await db.query(
      `INSERT INTO bookings (customer_id, service_id, description, address_id, preferred_at, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'PENDING', NOW(), NOW())`,
      [req.user.id, service_id, description, address_id, preferred_at]
    );

    if (images && images.length) {
      const insertImages = images.map((url) => [result.insertId, url, new Date()]);
      await db.query('INSERT INTO booking_images (booking_id, image_url, uploaded_at) VALUES ?', [insertImages]);
    }

    res.status(201).json({ success: true, data: { bookingId: result.insertId } });
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req, res, next) {
  try {
    const db = getDb();
    const [bookings] = await db.query(
      'SELECT id, service_id, status, preferred_at, created_at, updated_at FROM bookings WHERE customer_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const db = getDb();
    await db.query('UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?', [status, bookingId]);
    res.json({ success: true, data: { bookingId, status } });
  } catch (error) {
    next(error);
  }
}
