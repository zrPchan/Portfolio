const webpush = require('web-push');
const { Deta } = require('deta');
const crypto = require('crypto');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:example@example.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.error('web-push setVapidDetails failed:', err && err.message);
  }
} else {
  console.warn('VAPID keys not set in env; push sending will fail until configured.');
}

let db = null;
if (process.env.DETA_PROJECT_KEY) {
  try {
    const deta = Deta(process.env.DETA_PROJECT_KEY);
    db = deta.Base('subscriptions');
  } catch (err) {
    console.error('Failed to initialize Deta:', err && err.message);
  }
} else {
  console.warn('DETA_PROJECT_KEY not provided; subscription persistence disabled.');
}

function idFromEndpoint(endpoint) {
  return crypto.createHash('sha256').update(String(endpoint)).digest('hex');
}

module.exports = {
  webpush,
  db,
  idFromEndpoint,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
};
