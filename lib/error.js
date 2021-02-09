class GeneralError extends Error {
  constructor(errorCode, message) {
    super();
    this.errorCode = errorCode;
    this.message = message;
  }

  getCode() {
    // eslint-disable-next-line no-use-before-define
    if (this instanceof BadRequest) {
      return 400;
    }

    // eslint-disable-next-line no-use-before-define
    if (this instanceof NotFound) {
      return 404;
    }

    return 500;
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}

module.exports = {
  GeneralError,
  BadRequest,
  NotFound,
};
