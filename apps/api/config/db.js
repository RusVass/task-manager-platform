import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

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
