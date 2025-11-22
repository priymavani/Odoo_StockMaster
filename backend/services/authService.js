const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require("nodemailer");
require("dotenv").config();

function getSaltRounds() {
  return Number(process.env.BCRYPT_SALT_ROUNDS || 10);
}

function signToken(user) {
  const payload = { userId: user._id.toString(), role: user.role };
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

async function registerUser({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }

  const hash = await bcrypt.hash(password, getSaltRounds());

  // Basic rule: first user can be admin, others default to staff unless admin explicitly allowed.
  let finalRole = 'staff';
  const hasAnyUser = await User.exists({});
  if (!hasAnyUser && role === 'admin') {
    finalRole = 'admin';
  } else if (role === 'admin') {
    finalRole = 'admin';
  } else {
    finalRole = 'staff';
  }

  const user = await User.create({ name, email, password: hash, role: finalRole });
  const token = signToken(user);
  const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role };

  return { user: safeUser, token };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  console.log('Comparing password for user:', email);
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user);
  const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role };
  return { user: safeUser, token };
}

async function getCurrentUser(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// async function requestPasswordReset(email) {
//   const user = await User.findOne({ email });
//   if (!user) {
//     // Do not reveal whether email exists
//     return;
//   }

//   const otp = generateOtp();
//   const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

//   user.resetOtp = otp;
//   user.resetOtpExpiresAt = expiresAt;
//   await user.save();

//   // In real app, send via email/SMS. For this MVP, log to server console.
//   console.log(`Password reset OTP for ${email}: ${otp}`);
// }

async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether email exists
    return;
  }

  const otp = generateOtp(); // Example: 6 digit OTP
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetOtp = otp;
  user.resetOtpExpiresAt = expiresAt;
  await user.save();

  // ---------------------------
  // 🔹 EMAIL SENDING (Nodemailer)
  // ---------------------------
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      unifiedTopology: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your Password Reset OTP",
    text: `Hi ${user.name || "User"},  

You requested to reset your password.

Your OTP is: ${otp}

This OTP is valid for 15 minutes.

If you didn’t request a password reset, simply ignore this email.

Thanks,
Stock Master `,
  };

  await transporter.sendMail(mailOptions);

  console.log(`Password reset OTP sent to email: ${email}`);

  return { message: "OTP sent to email" };
}

async function resetPassword({ email, otp, newPassword }) {
  const user = await User.findOne({ email });
  if (!user || !user.resetOtp || !user.resetOtpExpiresAt) {
    const err = new Error('Invalid reset request');
    err.statusCode = 400;
    throw err;
  }

  if (user.resetOtp !== otp || user.resetOtpExpiresAt < new Date()) {
    const err = new Error('Invalid or expired OTP');
    err.statusCode = 400;
    throw err;
  }

  user.password = await bcrypt.hash(newPassword, getSaltRounds());
  user.resetOtp = undefined;
  user.resetOtpExpiresAt = undefined;
  await user.save();
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
};
