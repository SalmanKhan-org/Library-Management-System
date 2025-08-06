const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image:{
        type: String,
        default: 'default.jpg'
    },
    phoneNo:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;