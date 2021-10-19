const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

const globalError = require('./controller/errorController');
const AppError = require('./utils/AppError');

const userPageRoute = require('./routes/userPage');
const authRoute = require('./routes/auth');
const amenityRoute = require('./routes/amenity');
const cityRoute = require('./routes/city');
const areaRoute = require('./routes/area');
const residenceRoute = require('./routes/residence');
const seoRoute = require('./routes/seo');
const companyRoute = require('./routes/company');
const scriptRoute = require('./routes/script');
const wishlistRoute = require('./routes/wishlist');
const requestRoute = require('./routes/request');

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

const whitelist = [
  'http://localhost:3000',
  'https://we-settle-main.vercel.app',
];
app.use(
  cors({
    // origin: [
    // 'http://localhost:3000',
    // 'https://we-settle-main.vercel.app',
    //   'https://we-settle-main-*.vercel.app',
    // ],
    origin: function (origin, callback) {
      if (whitelist.includes(origin)) return callback(null, true);
      if (
        origin &&
        origin.startsWith('https://we-settle-main') &&
        origin.endsWith('vercel.app')
      )
        return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(mongoSanitize());
app.use(xss());

app.use('/', userPageRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/amenity', amenityRoute);
app.use('/api/v1/city', cityRoute);
app.use('/api/v1/area', areaRoute);
app.use('/api/v1/residence', residenceRoute);
app.use('/api/v1/seo', seoRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/script', scriptRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/api/v1/request', requestRoute);

app.all('*', (req, _, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError);

module.exports = app;
