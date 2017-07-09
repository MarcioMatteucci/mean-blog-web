// Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)
const crypto = require('crypto').randomBytes(256).toString('hex'); 

// Export config object
module.exports = {
  uri: 'mongodb://localhost:27017/mean-blog-db', // Databse URI and database name
  secret: crypto, // Cryto-created secret
  db: 'mean-blog-db' // Database name
}