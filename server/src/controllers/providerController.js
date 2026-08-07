export async function providerProtected(req, res) {
  res.json({ success: true, data: { message: 'Provider access granted', user: req.user } });
}
