const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'brecho2024',
  DATA_DIR: path.join(__dirname, '..', 'data'),
  PUBLIC_DIR: path.join(__dirname, '..', '..', 'public'),
  ADMIN_DIR: path.join(__dirname, '..', '..', 'admin'),
};
