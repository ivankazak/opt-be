const { isValidObjectId } = require('mongoose');
const { isObject, isArray } = require('lodash');

const Hit = require('../models/Hit');
const { GeneralError, BadRequest } = require('../lib/error');

class HitController {
  async getHits(req, res, next) {
    try {
      const hits = await Hit.find();
      return res.status(200).json({ hits });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createHit(req, res, next) {
    const { userid, corpid, goal, source } = req.body;

    if (!userid) {
      return next(new BadRequest('not-null', "userid can't be blank."));
    }

    if (!corpid) {
      return next(new BadRequest('not-null', "corpid can't be blank."));
    }

    if (!source) {
      return next(new BadRequest('not-null', "source can't be blank."));
    }

    if (!isValidObjectId(userid)) {
      return next(new BadRequest('invalid', 'userid is invalid objectId.'));
    }

    if (!isValidObjectId(corpid)) {
      return next(new BadRequest('invalid', 'corpid is invalid objectId.'));
    }

    if (!isObject(goal) || isArray(goal)) {
      return next(new BadRequest('invalid', 'goal should be object.'));
    }

    if (!isObject(source) || isArray(source)) {
      return next(new BadRequest('invalid', 'source should be object.'));
    }

    try {
      const { _id } = await Hit.create({ ...req.body });
      return res.status(200).json({ _id });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async getHitById(req, res, next) {
    const { hitid } = req.params;

    if (!isValidObjectId(hitid)) {
      return next(new BadRequest('invalid', 'hitid is invalid objectId.'));
    }

    try {
      const hit = await Hit.findById(hitid);
      return res.status(200).json({ hit });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updateHit(req, res, next) {
    const { _id } = req.body;

    if (!_id) {
      return next(new BadRequest('not-null', "_id can't be blank."));
    }

    if (!isValidObjectId(_id)) {
      return next(new BadRequest('invalid', '_id is invalid objectId.'));
    }

    try {
      const hit = await Hit.findByIdAndUpdate({ _id }, { ...req.body }, { new: true });
      return res.status(200).json({ hit });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deleteHit(req, res, next) {
    const { hitid } = req.params;

    if (!isValidObjectId(hitid)) {
      return next(new BadRequest('invalid', 'hitid is invalid objectId.'));
    }

    try {
      await Hit.findOneAndDelete({ _id: hitid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const hitController = new HitController();

module.exports = { hitController };
