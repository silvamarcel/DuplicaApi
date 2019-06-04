const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = this.encryptPassword(this.password);
  return next();
});

UserSchema.methods = {
  authenticate: function auth(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  encryptPassword: function encrypt(plainTextPassword) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainTextPassword, salt);
  },
};

module.exports = mongoose.model('users', UserSchema);
