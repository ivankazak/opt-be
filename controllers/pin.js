const { isValidObjectId } = require('mongoose');

const Pin = require('../models/Pin');
const { GeneralError, BadRequest } = require('../lib/error');

class PinController {
  async getPins(req, res, next) {
    try {
      const pins = await Pin.find();
      return res.status(200).json({ pins });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createPin(req, res, next) {
    const { userid, postid } = req.body;

    if (!userid) {
      return next(new BadRequest('not-null', "userid can't be blank."));
    }

    if (!isValidObjectId(userid)) {
      return next(new BadRequest('invalid', 'userid is invalid objectId.'));
    }

    if (!postid) {
      return next(new BadRequest('not-null', "postid can't be blank."));
    }

    if (!isValidObjectId(postid)) {
      return next(new BadRequest('invalid', 'postid is invalid objectId.'));
    }

    try {
      const { _id } = await Pin.create({ ...req.body });
      return res.status(200).json({ _id });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async getPinById(req, res, next) {
    const { pinid } = req.params;

    if (!isValidObjectId(pinid)) {
      return next(new BadRequest('invalid', 'pinid is invalid objectId.'));
    }

    try {
      const pin = await Pin.findById(pinid);
      return res.status(200).json({ pin });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updatePin(req, res, next) {
    const { _id } = req.body;

    if (!_id) {
      return next(new BadRequest('not-null', "_id can't be blank."));
    }

    if (!isValidObjectId(_id)) {
      return next(new BadRequest('invalid', '_id is invalid objectId.'));
    }

    try {
      const pin = await Pin.findByIdAndUpdate({ _id }, { ...req.body }, { new: true });
      return res.status(200).json({ pin });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deletePin(req, res, next) {
    const { pinid } = req.params;

    if (!isValidObjectId(pinid)) {
      return next(new BadRequest('invalid', 'pinid is invalid objectId.'));
    }

    try {
      await Pin.findOneAndDelete({ _id: pinid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const pinController = new PinController();

module.exports = { pinController };
