import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.AUTH_SECRET || "fallback_secret_key_123456789012"; // Must be 32 chars hopefully, otherwise we hash it.

const getResizedKey = (key) => {
  return crypto.createHash('sha256').update(key).digest();
};

export function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const key = getResizedKey(SECRET_KEY);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(text) {
  if (!text) return null;
  const parts = text.split(':');
  if (parts.length !== 3) return text; // Not encrypted or invalid format
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = parts[2];
  const key = getResizedKey(SECRET_KEY);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
