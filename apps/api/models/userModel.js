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
        required: false,
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true,
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