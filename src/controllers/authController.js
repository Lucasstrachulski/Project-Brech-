const { ADMIN_PASSWORD } = require('../config');

function authenticate(req, res) {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Senha incorreta' });
  }
}

module.exports = { authenticate };
