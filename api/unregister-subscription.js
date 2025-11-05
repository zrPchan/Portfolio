const { db, idFromEndpoint } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { endpoint, id } = req.body || {};
    if (!db) return res.status(500).json({ error: 'Deta not configured (DETA_PROJECT_KEY missing)' });
    let key = id;
    if (!key) {
      if (!endpoint) return res.status(400).json({ error: 'endpoint or id required' });
      key = idFromEndpoint(endpoint);
    }
    await db.delete(key);
    return res.status(200).json({ ok: true, id: key });
  } catch (err) {
    console.error('unregister-subscription error:', err && err.stack || err);
    return res.status(500).json({ error: String(err) });
  }
};
