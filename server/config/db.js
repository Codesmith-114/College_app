import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB connected successfully');
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log('✅ MongoDB disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
    }
}
