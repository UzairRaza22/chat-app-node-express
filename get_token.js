require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const connectDB = require('./src/config/db');
const User = require('./src/Models/UserModel');
const Token = require('./src/Models/TokenModel');

async function run() {
    await connectDB();
    const user = await User.findOne();
    if (!user) { console.log("NO_USERS_FOUND"); process.exit(1); }
    const accessToken = crypto.randomBytes(32).toString('hex');
    await Token.create({ userId: user._id, token: accessToken });
    console.log(`\n=== TOKEN ===\n${accessToken}\n=============\n`);
    process.exit(0);
}
run();
