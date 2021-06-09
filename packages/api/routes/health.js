const health = async (_, reply, next) => {
  reply.send('up');
  next();
};

module.exports = health;
