const User = require('../models/User');
const { OTP } = require('../services/OTP');
const { GeneralError, BadRequest, NotFound } = require('../lib/error');

class OTPController {
  async generate(req, res, next) {
    const otp = OTP.generate(4);
    const { mobile } = req.body;

    if (!mobile) {
      return next(new BadRequest('not-null', "mobile can't be blank."));
    }

    try {
      const transid = await OTP.sendSMS(mobile, otp);
      const user = await User.findOne({ mobile });

      if (user) {
        await User.findOneAndUpdate(
          { mobile },
          { ...user.toObject(), otp, status: 'pending' },
          { new: true }
        );
        const { _id, id } = user;
        return res.status(200).json({ transid, sent: true, _id, id });
      }

      const { _id, id } = await User.create({ mobile, otp, status: 'pending' });
      return res.status(200).json({ transid, sent: true, _id, id });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async verify(req, res, next) {
    const { mobile, code } = req.body;

    if (!mobile) {
      return next(new NotFound('not-null', "mobile can't be blank."));
    }

    if (!code) {
      return next(new NotFound('not-null', "code can't be blank."));
    }

    try {
      const user = await User.findOne({ mobile });

      if (!user) {
        return next(new NotFound('not-found', 'user not find.'));
      }

      const { otp } = user.toObject();
      const valid = otp === code;

      if (valid) {
        await User.findOneAndUpdate(
          { mobile },
          { ...user.toObject(), otp: '', status: 'verified' },
          { new: true }
        );
      }

      return res.status(200).json({ valid });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const otpController = new OTPController();

module.exports = { otpController };
