const jwt = require('jsonwebtoken');
const { trim } = require('lodash');
const moment = require('moment');
const axios = require('axios').default;

const User = require('../models/User');
const UserTransaction = require('../models/User-Transaction');
const Gift = require('../models/Gift');
const Pin = require('../models/Pin');

const { OTP } = require('../services/OTP');
const { ROLES } = require('../lib/roles');
const { uploadS3 } = require('../lib/upload');
const { GeneralError, BadRequest, NotFound } = require('../lib/error');

const singleUpload = uploadS3.single('image');

class UserController {
  async getUsers(req, res, next) {
    try {
      const users = await User.find();
      return res.status(200).json({ users });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createUser(req, res, next) {
    singleUpload(req, res, async (err) => {
      if (err) {
        return next(new GeneralError('network-error', err.message));
      }

      try {
        const { location } = req.file;
        const { mobile, role } = req.body;

        if (!mobile) {
          return next(new BadRequest('not-null', "mobile can't be blank."));
        }

        if (!role) {
          return next(new BadRequest('not-null', "role can't be blank."));
        }

        const isRoleCorrect = Object.values(ROLES).includes(role);
        if (!isRoleCorrect) {
          return next(new BadRequest('invalid', "role should be one of the 'admin' and 'user'"));
        }

        const { id } = await User.create({ ...req.body, image: location, role });
        return res.status(200).json({ id });
      } catch (error) {
        return next(new GeneralError('database-error', err.message));
      }
    });
  }

  async getUserById(req, res, next) {
    const { userid } = req.params;

    try {
      const user = await User.findOne({ id: userid });
      return res.status(200).json({ user });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updateUser(req, res, next) {
    singleUpload(req, res, async (err) => {
      if (err) {
        return next(new GeneralError('network-error', err.message));
      }

      try {
        const { id } = req.body;
        const userData = { ...req.body };

        if (req.file) {
          const { location: image } = req.file;
          userData.image = image;
        }

        if (!id) {
          return next(new BadRequest('not-null', "id can't be blank."));
        }

        const user = await User.findOneAndUpdate({ id }, userData, { new: true });
        return res.status(200).json({ user });
      } catch (error) {
        return next(new GeneralError('database-error', error.message));
      }
    });
  }

  async deleteUser(req, res, next) {
    const { userid } = req.params;

    try {
      await User.findOneAndDelete({ id: userid });
      return res.status(200);
    } catch (error) {
      return next(new GeneralError('database-error', error.message));
    }
  }

  async login(req, res, next) {
    const { mobile, password } = req.body;

    if (!mobile) {
      return next(new BadRequest('not-null', "mobile can't be blank."));
    }

    if (!password) {
      return next(new BadRequest('not-null', "password can't be blank."));
    }

    try {
      const user = await User.findOne({ mobile });

      if (!user) {
        return next(new NotFound('not-found', 'user not found.'));
      }

      const { id, status, password: userPassword, role } = user.toObject();

      if (password !== userPassword) {
        return next(new BadRequest('invalid', 'password not correct.'));
      }

      const today = new Date();
      const exp = new Date();
      exp.setDate(today.getDate() + 60);

      const token = jwt.sign(
        {
          mobile,
          role,
          exp: parseInt(exp.getTime() / 1000, 10),
        },
        process.env.JWT_SECRET
      );

      return res.status(200).json({ id, status, token });
    } catch (error) {
      return next(new GeneralError('database-error', error.message));
    }
  }

  async getAffiliate(req, res, next) {
    const { userid } = req.params;

    try {
      // TODO: ask affiliateid type & about url
      const user = await User.findOne({ id: userid });
      return res.status(200).json({ user });
    } catch (error) {
      return next(new GeneralError('database-error', error.message));
    }
  }

  async getForwardPin(req, res, next) {
    const { fromdate, todate, userid } = req.query;

    try {
      const pins = await Pin.find({ userid, createdAt: { $gte: moment(fromdate), $lte: moment(todate) } });
      return res.status(200).json({ pins });
    } catch (error) {
      return next(new GeneralError('database-error', error.message));
    }
  }

  async forwardPin(req, res, next) {
    return res.status(200).json({});
  }

  async getPins(req, res, next) {
    const { fromdate, todate, userid } = req.query;

    try {
      const pins = await Pin.find({ userid, createdAt: { $gte: moment(fromdate), $lte: moment(todate) } });
      return res.status(200).json({ pins });
    } catch (error) {
      return next(new GeneralError('database-error', error.message));
    }
  }

  async rewardPoint(req, res, next) {
    const { userid, points, giftid } = req.body;

    try {
      const user = await User.findOne({ id: userid });

      if (!user) {
        return next(new NotFound('not-found', 'user not found'));
      }

      // TODO: ask what to do with gift
      const gift = await Gift.findOne({ id: giftid });

      if (!gift) {
        return next(new NotFound('not-found', 'gift not found'));
      }

      const { balance = 0 } = user.toObject();
      const newBalance = balance + points;

      // update user balance
      await User.findOneAndUpdate({ id: userid }, { ...user.toObject(), balance: newBalance }, { new: true });

      // create user transaction
      const { details } = gift.toObject();
      const userTransaction = await UserTransaction.create({ userid, points, details, status: 'pending' });
      return res.status(200).json({ userTransaction });
    } catch (error) {
      return next(new GeneralError('database-error', error.message));
    }
  }

  async forgotPassword(req, res, next) {
    const otp = OTP.generate(4);
    const { mobile } = req.body;

    try {
      // send sms
      const { data } = await axios.get(
        `https://www.jawalbsms.ws/api.php/sendsms?user=adoodlz&pass=Adoodlz@2020&to=${mobile}&message=${otp}&sender=adoodlz`
      );
      const smsRes = data.split('|').map(trim);
      const transid = smsRes[0].split(':').map(trim).pop();

      const user = await User.findOne({ mobile });

      if (user) {
        await User.findOneAndUpdate(
          { mobile },
          { ...user.toObject(), otp, status: 'pending' },
          { new: true }
        );
      } else {
        await User.create({ mobile, otp, status: 'pending' });
      }

      return res.status(200).json({ transid, sent: true });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const userController = new UserController();

module.exports = { userController };
