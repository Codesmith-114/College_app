import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    portalId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    university: String,
    department: String,
    semester: Number,
    rollNumber: String,
    themePreferences: {
        primaryColor: {
            type: String,
            default: '#ec4899'
        },
        accentColor: {
            type: String,
            default: '#14b8a6'
        },
        animationsEnabled: {
            type: Boolean,
            default: true
        }
    },
    lastSynced: Date,
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'users'
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('encryptedPassword')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.encryptedPassword = await bcrypt.hash(this.encryptedPassword, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.encryptedPassword);
};

export const User = mongoose.model('User', UserSchema);
