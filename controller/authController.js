const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/sendMail');
const expiresIn = process.env.EXPIRES_IN;
const expiresInMin = process.env.EXPIRES_IN_MIN;
const secret = process.env.TOKEN_SECRET;

const generateToken = async (payload, secret, expiresIn) => {
  return await promisify(jwt.sign)(payload, secret, {
    expiresIn,
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, phoneNo, city, college, gender } = req.body;
  if (!name || !email || !password || !phoneNo) {
    return next(new AppError('Please Fill all fields', 400));
  }

  const isUser = await User.findOne({ email, verified: true });

  if (isUser) {
    return next(new AppError('Email Already registered', 400));
  }

  const token = await generateToken({ email }, process.env.EMAIL_JWT, '1h');
  await sendEmail({
    email,
    subject: 'test',
    text: 'test',
    message: `${req.headers.origin}/activate?token=${token}`,
  });
  let hashedPassword;
  if (password) hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: hashedPassword,
      phoneNo,
      city,
      college,
      gender,
    },
    {
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
  return res.status(201).json({
    status: 'success',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please Fill all fields', 401));

  const user = await User.findOne({ email, verified: true }).select(
    'email password'
  );

  if (!user) return next(new AppError('Invalid credentials', 401));

  if (!(await user.comparePassword(password, user.password)))
    return next(new AppError('Invalid credentials', 401));

  const token = await generateToken(
    { userId: user._id, role: user.role },
    secret,
    expiresIn
  );

  return res
    .status(200)
    .cookie('wesettletoken', token, {
      expiresIn: expiresInMin,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .json({
      success: true,
      user,
      token,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies?.wesettletoken || req.headers['authorization'];
  if (!token) return next(new AppError('Please login', 401));
  const decoded = await promisify(jwt.verify)(token, secret);

  if (!decoded || !decoded?.userId) {
    return next(new AppError('Please login', 401));
  }

  const user = await User.findById(decoded?.userId);

  if (!user) return next(new AppError('Please login', 401));
  req.user = user;
  next();
});

exports.protectAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin')
    return next(new AppError('You are not authorized to access', 401));
  next();
});

exports.test = (req, res) => res.status(200).json({ user: req.user });

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  return res.status(200).json({
    status: 'success',
    user: user,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const token = req.cookies?.wesettletoken;
  if (!token) return res.status(404);
  return res
    .status(200)
    .cookie('wesettletoken', '', {
      expiresIn: 0,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .json({ status: 'success' });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    status: 'success',
    length: users.length,
    users,
  });
});

exports.protectAuthPage = async (req, res, next) => {
  try {
    const token = req.cookies?.wesettletoken || req.headers['authorization'];

    if (!token) return next();
    const decoded = await promisify(jwt.verify)(token, secret);

    if (!decoded || !decoded?.userId) {
      return next();
    }

    const user = await User.findById(decoded?.userId);
    if (user) return res.redirect('/');
    next();
  } catch (error) {
    res.cookie('wesettletoken', '', {
      expiresIn: 0,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return next();
  }
};

exports.protectPage = async (req, res, next) => {
  try {
    const token = req.cookies?.wesettletoken || req.headers['authorization'];

    if (!token) throw new Error();
    const decoded = await promisify(jwt.verify)(token, secret);

    if (!decoded || !decoded?.userId) {
      throw new Error();
    }

    const user = await User.findById(decoded?.userId);
    if (!user) throw new Error();
    next();
  } catch (error) {
    res.redirect('/login');
    return next();
  }
};

exports.activate = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError('Token is required', 400));
  const decoded = await promisify(jwt.verify)(token, process.env.EMAIL_JWT);

  if (!decoded || !decoded?.email) {
    return next(new AppError('Token expired,Please register again'));
  }

  const user = await User.findOneAndUpdate(
    { email: decoded.email },
    { verified: true },
    { new: true }
  );

  const loginToken = await generateToken(
    { userId: user._id, role: user.role },
    secret,
    expiresIn
  );

  return res
    .status(200)
    .cookie('wesettletoken', loginToken, {
      expiresIn: expiresInMin,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .json({
      success: true,
      user,
      token,
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Email is required', 400));

  const isUser = await User.findOne({ email });

  if (!isUser) return next(new AppError('Invalid credential', 400));

  const token = await generateToken({ email }, process.env.PASSWORD_JWT, '10m');

  await sendEmail({
    email,
    subject: 'Forgot Password',
    message: `Forgot Password${req.headers.origin}/change-password?token=${token}`,
  });

  return res.status(200).json({
    status: 'success',
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { password, token } = req.body;

  if (!token || !password)
    return next(new AppError('Token and Password is required', 400));

  const decoded = await promisify(jwt.verify)(token, process.env.PASSWORD_JWT);

  if (!decoded || !decoded?.email) {
    return next(new AppError('Token expired,Please register again'));
  }

  const user = await User.findOne({ email: decoded.email });

  if (!user) return next(new AppError('Token expired,Please register again'));

  user.password = password;

  await user.save();

  return res.status(200).json({
    status: 'success',
    message: 'Password Changed Successfully',
  });
});
