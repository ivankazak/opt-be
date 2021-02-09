const Corporate = require('../models/Corporate');
const CorporationTransaction = require('../models/Corporation-Transaction');

const { Validator } = require('../services/Validator');
const { GeneralError, BadRequest, NotFound } = require('../lib/error');

class CorporateController {
  async getCorps(req, res, next) {
    try {
      const corps = await Corporate.find();
      return res.status(200).json({ corps });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createCorps(req, res, next) {
    const { email } = req.body;

    if (!email) {
      return next(new BadRequest('not-null', "email can't be blank"));
    }

    if (!Validator.email(email)) {
      return next(new BadRequest('invalid', 'email is invalid'));
    }

    try {
      const { id } = await Corporate.create({ ...req.body });
      return res.status(200).json({ id });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async getCorpById(req, res, next) {
    const { corpid } = req.params;

    try {
      const corporate = await Corporate.findOne({ id: corpid });
      return res.status(200).json({ corporate });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updateCorp(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(new BadRequest('not-null', "id can't be blank"));
    }

    try {
      const corporate = await Corporate.findOneAndUpdate({ id }, { ...req.body }, { new: true });
      return res.status(200).json({ corporate });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deleteCorp(req, res, next) {
    const { corpid } = req.params;

    try {
      await Corporate.findOneAndDelete({ id: corpid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async addPointsToCorporate(req, res, next) {
    const { corpid, points, payment } = req.body;

    if (!corpid) {
      return next(new BadRequest('not-null', "corpid can't be blank"));
    }

    try {
      const corp = (await Corporate.findById(corpid)).toObject();

      if (!corp) {
        return next(new NotFound('not-found', 'corp does not exist with this id.'));
      }

      // update balance of corporation
      const balance = corp.balance || 0 + points;
      await Corporate.findByIdAndUpdate(corpid, { corp, balance }, { new: true });

      // create new corp transaction
      const corpTrans = await CorporationTransaction.create({ corpid, points, details: payment.details });
      return res.status(200).json({ corpTrans });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const corpController = new CorporateController();

module.exports = { corpController };
