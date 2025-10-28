import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Get encryption key from environment variable
 * Must be 32 bytes (64 hex characters)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted text in format: IV (32 hex) + AuthTag (32 hex) + Ciphertext
 */
export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: IV (32 hex) + AuthTag (32 hex) + Ciphertext
  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

/**
 * Decrypt encrypted data using AES-256-GCM
 * @param encrypted - Encrypted text from encrypt() function
 * @returns Decrypted plain text
 */
export function decrypt(encrypted: string): string {
  const key = getEncryptionKey();

  // Extract components
  const iv = Buffer.from(encrypted.slice(0, IV_LENGTH * 2), 'hex');
  const authTag = Buffer.from(
    encrypted.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2),
    'hex'
  );
  const cipherText = encrypted.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
