// Web Crypto API utilities for client-side encryption

// Convert string to ArrayBuffer
function str2ab(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert ArrayBuffer to string
function ab2str(ab) {
  const decoder = new TextDecoder();
  return decoder.decode(ab);
}

// Convert ArrayBuffer to base64
function ab2base64(ab) {
  return btoa(String.fromCharCode(...new Uint8Array(ab)));
}

// Convert base64 to ArrayBuffer
function base642ab(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive a key from password using PBKDF2
export async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Generate a random salt
export function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Hash password for authentication (not for encryption)
export async function hashPassword(password) {
  const salt = generateSalt();
  const passwordBuffer = str2ab(password);
  const saltBase64 = ab2base64(salt);

  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  const hashBase64 = ab2base64(hashBuffer);

  return {
    hash: hashBase64,
    salt: saltBase64
  };
}

// Verify password against stored hash
export async function verifyPassword(password, storedHash, storedSalt) {
  const passwordBuffer = str2ab(password);
  const salt = base642ab(storedSalt);

  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  const hashBase64 = ab2base64(hashBuffer);
  return hashBase64 === storedHash;
}

// Encrypt data using AES-GCM
export async function encryptData(data, password) {
  const salt = generateSalt();
  const key = await deriveKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const dataBuffer = str2ab(JSON.stringify(data));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    dataBuffer
  );

  return {
    encrypted: ab2base64(encryptedBuffer),
    iv: ab2base64(iv),
    salt: ab2base64(salt)
  };
}

// Decrypt data using AES-GCM
export async function decryptData(encryptedData, password) {
  const { encrypted, iv, salt } = encryptedData;

  const key = await deriveKey(password, base642ab(salt));
  const encryptedBuffer = base642ab(encrypted);
  const ivBuffer = base642ab(iv);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer
      },
      key,
      encryptedBuffer
    );

    const decryptedString = ab2str(decryptedBuffer);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Invalid password or corrupted data');
  }
}

// Generate a random pairing code (6 characters)
export function generatePairingCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const randomBytes = crypto.getRandomValues(new Uint8Array(6));

  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i] % chars.length];
  }

  return code;
}
