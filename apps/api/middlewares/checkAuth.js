import jwt from 'jsonwebtoken';
import { firebaseAuth } from '../config/firebase.js';
import User from '../models/userModel.js';

export default async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization required' });
        }

        const token = authHeader.split(' ')[1];

        // 1) Спроба перевірки як Firebase ID Token
        try {
            const decoded = await firebaseAuth.verifyIdToken(token);
            const { uid, email, name } = decoded;
            const normalizedEmail = email?.toLowerCase() ?? null;

            const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
            const desiredRole =
                adminEmail && normalizedEmail && normalizedEmail === adminEmail ? 'admin' : 'user';

            let user = await User.findOne({ firebaseUid: uid });

            if (!user && normalizedEmail) {
                user = await User.findOne({ email: normalizedEmail });
            }

            if (!user) {
                const fallbackUsername =
                    name?.trim() ||
                    (normalizedEmail ? normalizedEmail.split('@')[0] : `user-${uid.substring(0, 6)}`) ||
                    `user-${uid.substring(0, 6)}`;

                user = await User.create({
                    username: fallbackUsername,
                    email: normalizedEmail ?? undefined,
                    firebaseUid: uid,
                    role: desiredRole,
                });
            } else {
                let shouldSave = false;

                if (!user.firebaseUid) {
                    user.firebaseUid = uid;
                    shouldSave = true;
                }

                if (desiredRole === 'admin' && user.role !== 'admin') {
                    user.role = 'admin';
                    shouldSave = true;
                }

                if (shouldSave) {
                    await user.save();
                }
            }

            if (user.blocked) {
                return res.status(403).json({ message: 'User is blocked' });
            }

            req.user = {
                id: user._id.toString(),
                role: user.role,
                firebaseUid: uid,
                email: user.email,
            };

            return next();
        } catch (firebaseErr) {
            // Якщо не Firebase токен — пробуємо як локальний JWT
        }

        // 2) Спроба перевірки як локальний JWT
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (user.blocked) {
                return res.status(403).json({ message: 'User is blocked' });
            }

            req.user = {
                id: user._id.toString(),
                role: user.role,
                email: user.email,
            };

            return next();
        } catch (jwtErr) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
