const { db, webpush, requireAdminAuth } = require('./_lib');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  // Require admin auth for send endpoint
  const ok = requireAdminAuth(req, res);
  if(!ok) return; // response already sent
  try {
    const { id, endpoint, payload } = req.body || {};
    if (!db) return res.status(500).json({ error: 'Deta not configured (DETA_PROJECT_KEY missing)' });
    const sendPayload = typeof payload === 'string' ? payload : JSON.stringify(payload || { title: 'Timer', body: '⏰ Timer ended' });

    const sendToSub = async (sub) => {
      try {
        await webpush.sendNotification(sub, sendPayload);
        return { ok: true };
      } catch (err) {
        console.error('web-push send error:', err && err.statusCode, err && err.body || err && err.stack || err);
        return { ok: false, error: String(err) };
      }
    };

    if (id || endpoint) {
      const key = id || (endpoint && crypto.createHash('sha256').update(String(endpoint)).digest('hex'));
      const item = await db.get(key);
      if (!item || !item.subscription) return res.status(404).json({ error: 'subscription not found' });
      const result = await sendToSub(item.subscription);
      return res.status(200).json({ results: [result] });
    }

    // send to all
    const results = [];
    let iter = await db.fetch();
    while (iter) {
      for (const it of iter.items || []) {
        if (it.subscription) {
          const r = await sendToSub(it.subscription);
          results.push({ id: it.id, ...r });
        }
      }
      if (!iter.last) break;
      iter = await db.fetch({ last: iter.last });
    }
    return res.status(200).json({ results });
  } catch (err) {
    console.error('send error:', err && err.stack || err);
    return res.status(500).json({ error: String(err) });
  }
};
