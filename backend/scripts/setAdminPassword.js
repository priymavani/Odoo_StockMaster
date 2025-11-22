// scripts/setAdminPassword.js
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function main() {
  await connectDB();
  const email = 'priy.mavani.cg@gmail.com';
  const newPassword = process.env.ADMIN_PWD || 'SuperSecret123!';
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error('Admin user not found.');
    process.exit(1);
  }
  user.password = newPassword; // pre-save hook will hash it
  await user.save();
  console.log('Admin password set to:', newPassword);
  await mongoose.disconnect();
  process.exit(0);
}
main().catch(err => { console.error(err); process.exit(1); });
