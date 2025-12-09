import 'dotenv/config';
import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
}


mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((e) => {
        console.error(e);
    });
