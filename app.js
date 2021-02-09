const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// enable process.env
require('dotenv').config();

const env = process.env.NODE_ENV || 'dev';
const config = require('./config/config.json')[env];

mongoose
  .connect(config.mongodb.url, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    ...config.mongodb.options,
  })
  // eslint-disable-next-line no-console
  .then(() => console.log('Database Connected Successfully!'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));

// add mongoose auto increment plugin
autoIncrement.initialize(mongoose.connection);

const indexRouter = require('./routes/index');
const { errorMiddleware } = require('./middleware/error');

const app = express();

const store = new MongoStore({ mongooseConnection: mongoose.connection });

// add sessions to express
const sessionOptions = {
  name: 'sessionid',
  secret: config.session.secret,
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
  },
};

if (process.env.NODE_ENV === 'prod') {
  const cookie = {
    ...sessionOptions.cookie,
    secure: true,
  };
  sessionOptions.cookie = cookie;
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(cors());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorMiddleware);

module.exports = app;
