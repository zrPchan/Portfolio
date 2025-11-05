const { VAPID_PUBLIC_KEY } = require('./_lib');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ publicKey: VAPID_PUBLIC_KEY || '' }));
};
