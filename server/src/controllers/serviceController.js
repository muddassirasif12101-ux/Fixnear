import { getDb } from '../config/database.js';

export async function getServices(req, res, next) {
  try {
    const db = getDb();
    const [services] = await db.query('SELECT id, name, category_id, description FROM services WHERE active = 1 ORDER BY name');
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
}

export async function getServiceCategories(req, res, next) {
  try {
    const db = getDb();
    const [categories] = await db.query('SELECT id, name, slug FROM service_categories WHERE active = 1 ORDER BY name');
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}
