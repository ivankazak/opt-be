const axios = require('axios').default;

class OTP {
  constructor(user, pass, sender, baseURL) {
    this.user = user;
    this.pass = pass;
    this.sender = sender;
    this.axios = axios.create({ baseURL });
  }

  sendSMS(mobile, message) {
    return new Promise((resolve, reject) => {
      this.axios
        .get('', {
          params: { user: this.user, pass: this.pass, to: mobile, message, sender: this.sender },
        })
        .then((sm) => resolve(sm))
        .catch((err) => reject(err));
    });
  }
}

const otp = new OTP(
  process.env.SMS_USER,
  process.env.SMS_PASS,
  process.env.SMS_SENDER,
  process.env.SMS_BASE_URL
);

module.exports = { otp };
