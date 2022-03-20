const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    passWord: String,
    createdAt: {type: Date, default: Date.now},
    isApproved: {type: Boolean, default: false},
    passCode: Number
});


module.exports = mongoose.model('user', userSchema);