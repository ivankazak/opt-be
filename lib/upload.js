const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const multer = require('multer');
const multerS3 = require('multer-s3');

const env = process.env.NODE_ENV || 'dev';
const config = require('../config/config.json')[env];

const { aws: awsConfig } = config;
const AWS_ID = awsConfig['access-key-id'];
const AWS_KEY = awsConfig['secret-key'];
const BUCKET_NAME = awsConfig['bucket-name'];

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_KEY,
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const { mimetype } = file;
  const isImg = filetypes.test(mimetype);

  if (isImg) {
    cb(null, true);
    return;
  }

  cb(new Error('Only Images are allowed.'));
};

const uploadS3 = multer({
  fileFilter,
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const { originalname } = file;
      cb(null, `${uuid()}_${originalname}`);
    },
  }),
});

module.exports = { uploadS3 };
