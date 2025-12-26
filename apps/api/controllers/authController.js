import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const register = async (req, res) => {
    try {
        const { username, email, password: pass } = req.body;

        const adminCount = await User.countDocuments({ role: 'admin' });
        const isAdminEmail =
            process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
        const role = adminCount === 0 || isAdminEmail ? 'admin' : 'user';

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        const user = await User.create({
            username,
            email,
            password: hash,
            role,
        });

        const { password, ...userData } = user._doc;

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).json({ token, user: userData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password: pass } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.blocked) {
            return res.status(403).json({ message: 'User is blocked' });
        }

        const isValid = await bcrypt.compare(pass, user.password);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid password or email' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // токен живе 1 день
        );

        const { password: _password, ...userData } = user._doc;
        void _password;

        return res.status(200).json({
            token,
            user: userData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to login' });
    }
};

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unable to fetch profile' });
    }
};
