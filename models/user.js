const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 4,
  },
  avatar: {
    type: String,
    required: true,
    minlength: 4,
  },
});

module.exports = mongoose.model('user', userSchema);
