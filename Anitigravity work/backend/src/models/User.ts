import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  college: { type: String, required: true }, // SRM IST, IIT Bombay, etc.
  portalCredentials: {
    username: { type: String, default: '' },
    passwordEncrypted: { type: String, default: '' } // Encrypted portal credentials for background sync
  },
  themePreferences: {
    accentColor: { 
      type: String, 
      default: 'teal', 
      enum: ['teal', 'pink', 'purple', 'emerald', 'cyan'] 
    },
    animationIntensity: { 
      type: String, 
      default: 'normal', 
      enum: ['none', 'normal', 'high'] 
    },
    compactMode: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = model('User', UserSchema);
