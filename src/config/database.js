const { Redis } = require('@upstash/redis');

let redis;

try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} catch (err) {
  console.error('Erro ao conectar Redis:', err.message);
}

module.exports = redis;
