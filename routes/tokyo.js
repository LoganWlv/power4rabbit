module.exports = (router) => {
  router.get('/ping', (req, res) => {
    res.send('pong');
  });
  return router;
};
