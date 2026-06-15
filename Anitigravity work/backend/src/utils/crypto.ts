import crypto from 'crypto';

// Use a fallback key for development if ENCRYPTION_KEY is not defined in .env
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // For GCM
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 10000;

const DEFAULT_SECRET = 'antigravity-super-secret-key-32-chars-long!'; // 32 bytes fallback

function getKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Encrypts a text string using AES-256-GCM
 */
export function encrypt(text: string): string {
  try {
    const secretKey = process.env.ENCRYPTION_KEY || DEFAULT_SECRET;
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    const key = getKey(secretKey, salt);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Return salt, iv, authtag, and ciphertext joined together
    return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    throw new Error('Encryption failed: ' + (err as Error).message);
  }
}

/**
 * Decrypts an encrypted hex string back into a raw string
 */
export function decrypt(encryptedText: string): string {
  try {
    const secretKey = process.env.ENCRYPTION_KEY || DEFAULT_SECRET;
    const parts = encryptedText.split(':');
    
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted text format');
    }
    
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const authTag = Buffer.from(parts[2], 'hex');
    const encrypted = parts[3];
    
    const key = getKey(secretKey, salt);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    throw new Error('Decryption failed: ' + (err as Error).message);
  }
}
