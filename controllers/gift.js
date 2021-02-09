const Gift = require('../models/Gift');
const { uploadS3 } = require('../lib/upload');
const { GeneralError, BadRequest } = require('../lib/error');

const singleUpload = uploadS3.single('image');

class GiftController {
  async getGifts(req, res, next) {
    try {
      const gifts = await Gift.find();
      return res.status(200).json({ gifts });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createGift(req, res, next) {
    singleUpload(req, res, async (err) => {
      if (err) {
        return next(new GeneralError('network-error', err.message));
      }

      const { location } = req.file;
      const { vendor, points } = req.body;

      if (!vendor) {
        return next(new BadRequest('not-null', "vendor can't be blank"));
      }

      if (!points) {
        return next(new BadRequest('not-null', "points can't be blank"));
      }

      try {
        const { id } = await Gift.create({ ...req.body, image: location });
        return res.status(200).json({ id });
      } catch (error) {
        return next(new GeneralError('database-error', err.message));
      }
    });
  }

  async getGiftById(req, res, next) {
    const { giftid } = req.params;

    try {
      const gift = await Gift.findOne({ id: giftid });
      return res.status(200).json({ gift });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updateGift(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(new BadRequest('not-null', "id can't be blank."));
    }

    try {
      const gift = await Gift.findOneAndUpdate({ id }, { ...req.body }, { new: true });
      return res.status(200).json({ gift });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deleteGift(req, res, next) {
    const { giftid } = req.params;

    try {
      await Gift.findOneAndDelete({ id: giftid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const giftController = new GiftController();

module.exports = { giftController };
