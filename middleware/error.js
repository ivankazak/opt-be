const { GeneralError } = require('../lib/error');

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: err.errorCode,
      message: err.message,
    });
  }

  return res.status(500).json({ error: err.errorCode, message: err.message });
};

module.exports = { errorMiddleware };
