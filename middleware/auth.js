const jwt = require('jsonwebtoken');
const { ROLES } = require('../lib/roles');

const authMiddleware = (allowedRoles = []) =>
  // eslint-disable-next-line func-names
  async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'unauthorized', message: 'token not provided.' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const { role, mobile } = decoded;

      if (!role || !mobile) {
        return res.status(401).json({ error: 'unauthorized', message: 'invalid token provided.' });
      }

      if (role === ROLES.ADMIN) {
        return next();
      }

      if (allowedRoles.includes(role)) {
        return next();
      }

      return res
        .status(401)
        .json({ error: 'unauthorized', message: 'you do not have role for this endpoint.' });
    } catch (err) {
      return res.status(401).json({ error: 'unauthorized', message: 'invalid token provided.' });
    }
  };

module.exports = { authMiddleware };
