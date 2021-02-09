const { isValidObjectId } = require('mongoose');

const CorpTrans = require('../models/Corporation-Transaction');
const { GeneralError, BadRequest } = require('../lib/error');

class CorpTransController {
  async getCropTrans(req, res, next) {
    try {
      const corpTrans = await CorpTrans.find();
      return res.status(200).json({ corpTrans });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createCropTrans(req, res, next) {
    const { corpid } = req.body;

    if (!corpid) {
      return next(new BadRequest('not-null', "corpid can't be blank."));
    }

    if (!isValidObjectId(corpid)) {
      return next(new BadRequest('invalid', 'corpid is invalid objectId'));
    }

    try {
      const { _id } = await CorpTrans.create({ ...req.body });
      return res.status(200).json({ _id });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async getCropTransById(req, res, next) {
    const { corptranid } = req.params;

    if (!isValidObjectId(corptranid)) {
      return next(new BadRequest('invalid', 'corptranid is invalid objectId'));
    }

    try {
      const corpTrans = await CorpTrans.findById(corptranid);
      return res.status(200).json({ corpTrans });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updateCropTrans(req, res, next) {
    const { _id } = req.body;

    if (!_id) {
      return next(new BadRequest('not-null', "_id can't be blank."));
    }

    if (!isValidObjectId(_id)) {
      return next(new BadRequest('invalid', '_id is invalid objectId'));
    }

    try {
      const corpTrans = await CorpTrans.findByIdAndUpdate({ _id }, { ...req.body }, { new: true });
      return res.status(200).json({ corpTrans });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deleteCropTrans(req, res, next) {
    const { corptranid } = req.params;

    if (!isValidObjectId(corptranid)) {
      return next(new BadRequest('invalid', 'corptranid is invalid objectId'));
    }

    try {
      await CorpTrans.findOneAndDelete({ _id: corptranid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const corpTransController = new CorpTransController();

module.exports = { corpTransController };
