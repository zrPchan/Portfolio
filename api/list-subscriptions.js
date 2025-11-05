const { db, requireAdminAuth } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');
  // Require admin auth
  const ok = requireAdminAuth(req, res);
  if(!ok) return; // response handled by helper
  try {
    if (!db) return res.status(500).json({ error: 'Deta not configured (DETA_PROJECT_KEY missing)' });
    const result = await db.fetch();
    return res.status(200).json({ items: result.items || [] });
  } catch (err) {
    console.error('list-subscriptions error:', err && err.stack || err);
    return res.status(500).json({ error: String(err) });
  }
};
