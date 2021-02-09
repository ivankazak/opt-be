const { isValidObjectId } = require('mongoose');

const UserTransaction = require('../models/User-Transaction');
const { GeneralError, BadRequest } = require('../lib/error');

class UserTransactionController {
  async getUserTransactions(req, res, next) {
    try {
      const userTrans = await UserTransaction.find();
      return res.status(200).json({ userTrans });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createUserTransaction(req, res, next) {
    const { userid } = req.body;

    if (!userid) {
      return next(new BadRequest('not-null', "userid can't be blank."));
    }

    if (!isValidObjectId(userid)) {
      return next(new BadRequest('invalid', 'userid is invalid objectId.'));
    }

    try {
      const { _id } = await UserTransaction.create({ ...req.body });
      return res.status(200).json({ _id });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async getUserTransactionById(req, res, next) {
    const { usertranid } = req.params;

    if (!isValidObjectId(usertranid)) {
      return next(new BadRequest('invalid', 'usertranid is invalid objectId.'));
    }

    try {
      const userTrans = await UserTransaction.findById(usertranid);
      return res.status(200).json({ userTrans });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updateUserTransaction(req, res, next) {
    const { _id } = req.body;

    if (!_id) {
      return next(new BadRequest('not-null', "_id can't be blank."));
    }

    if (!isValidObjectId(_id)) {
      return next(new BadRequest('invalid', '_id is invalid objectId.'));
    }

    try {
      const userTrans = await UserTransaction.findByIdAndUpdate({ _id }, { ...req.body }, { new: true });
      return res.status(200).json({ userTrans });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deleteUserTransaction(req, res, next) {
    const { usertranid } = req.params;

    if (!isValidObjectId(usertranid)) {
      return next(new BadRequest('invalid', 'usertranid is invalid objectId.'));
    }

    try {
      await UserTransaction.findOneAndDelete({ _id: usertranid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const userTransactionController = new UserTransactionController();

module.exports = { userTransactionController };
