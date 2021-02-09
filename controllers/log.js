const { isValidObjectId } = require('mongoose');

const Log = require('../models/Log');
const { GeneralError, BadRequest } = require('../lib/error');

class LogController {
  async getLogs(req, res, next) {
    try {
      const logs = await Log.find();
      return res.status(200).json({ logs });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createLog(req, res, next) {
    try {
      const { _id } = await Log.create({ ...req.body });
      return res.status(200).json({ _id });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async getLogById(req, res, next) {
    const { logid } = req.params;

    if (!isValidObjectId(logid)) {
      return next(new BadRequest('invalid', 'logid is invalid objectId.'));
    }

    try {
      const log = await Log.findById(logid);
      return res.status(200).json({ log });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updateLog(req, res, next) {
    const { _id } = req.body;

    if (!_id) {
      return next(new BadRequest('not-null', "_id can't be blank."));
    }

    if (!isValidObjectId(_id)) {
      return next(new BadRequest('invalid', '_id is invalid objectId.'));
    }

    try {
      const log = await Log.findByIdAndUpdate({ _id }, { ...req.body }, { new: true });
      return res.status(200).json({ log });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deleteLog(req, res, next) {
    const { logid } = req.params;

    if (!isValidObjectId(logid)) {
      return next(new BadRequest('invalid', 'logid is invalid objectId.'));
    }

    try {
      await Log.findOneAndDelete({ _id: logid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const logController = new LogController();

module.exports = { logController };
