import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

const User = mongoose.model('User', userSchema);

export default User;