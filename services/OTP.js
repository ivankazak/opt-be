const { trim } = require('lodash');
const randomString = require('randomstring');

const { otp } = require('../lib/OTP');

class OTP {
  static generate(length) {
    return randomString.generate({ length, charset: 'numeric' });
  }

  static async sendSMS(mobile, message) {
    const { data } = await otp.sendSMS(mobile, message);
    const [sms] = data.split('|').map(trim);
    return sms.split(':').map(trim).pop();
  }
}

module.exports = { OTP };
