export async function adminProtected(req, res) {
  res.json({ success: true, data: { message: 'Admin access granted', user: req.user } });
}
