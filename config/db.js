import 'dotenv/config';
import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
}

// const URI =
//     'mongodb+srv://mbglobalink_db_user:w5K8YTt85gb7gRo3@cluster0.fgrujud.mongodb.net/?appName=Cluster0';

mongoose
    .connect(MONGODB_URI)
    // .connect(URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((e) => {
        console.error(e);
    });
