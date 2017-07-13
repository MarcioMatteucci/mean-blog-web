// Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)
const crypto = require('crypto').randomBytes(256).toString('hex'); 

// Export config object
module.exports = {
  uri: 'mongodb://marcio:marcio@ds157342.mlab.com:57342/mean-blog', // Databse URI and database name
  secret: crypto, // Cryto-created secret
  db: 'mean-blog' // Database name
}