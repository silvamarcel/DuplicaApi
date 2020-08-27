const router = require('express').Router();

const health = () => {
  router.get('/health', (req, res) => {
    res.send('OK');
  });
  return router;
};

module.exports = health;
