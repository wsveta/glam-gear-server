const { default: mongoose, Schema } = require("mongoose");

const usersSchema = new Schema({
    avatarURL: String,
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },
    token: {
        type: String,
        default: null,
    },
}, { versionKey: false });

const User = mongoose.model('User', usersSchema);

module.exports = User;