import User from '../models/userModel.js';

export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
};

export const setBlocked = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const { blocked } = req.body;

        if (typeof blocked === 'undefined') {
            return res.status(400).json({ message: 'Field "blocked" is required' });
        }

        if (targetUserId === req.user.id) {
            return res.status(400).json({ message: 'You cannot block yourself' });
        }

        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (targetUser.role === 'admin') {
            return res.status(403).json({ message: 'Cannot block another admin' });
        }

        targetUser.blocked = Boolean(blocked);
        await targetUser.save();

        const { password, ...userData } = targetUser._doc;
        void password;

        return res.status(200).json(userData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update user status' });
    }
};

