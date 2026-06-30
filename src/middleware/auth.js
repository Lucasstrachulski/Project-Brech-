const { ADMIN_PASSWORD } = require('../config');

function requireAuth(req, res, next) {
  const password = req.headers['x-admin-password'] || req.query.password;
  if (password === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ error: 'Acesso não autorizado' });
}

module.exports = { requireAuth };
