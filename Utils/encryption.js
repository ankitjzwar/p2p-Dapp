import CryptoJS from 'crypto-js';

/**
 * Generate encryption key from user's wallet address
 * This ensures each user has a unique key based on their wallet
 * @param {string} walletAddress - User's wallet address
 * @returns {string} - Encryption key
 */
const generateKey = (walletAddress) => {
  // Use wallet address to generate a consistent key
  // In production, you might want to use a more secure method
  return CryptoJS.SHA256(walletAddress + 'chat-app-secret').toString();
};

/**
 * Encrypt file data
 * @param {string} data - Base64 encoded file data
 * @param {string} walletAddress - User's wallet address for key generation
 * @returns {string} - Encrypted data (base64)
 */
export const encryptFile = (data, walletAddress) => {
  try {
    const key = generateKey(walletAddress);
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Error encrypting file:', error);
    throw error;
  }
};

/**
 * Decrypt file data
 * @param {string} encryptedData - Encrypted data (base64)
 * @param {string} walletAddress - User's wallet address for key generation
 * @returns {string} - Decrypted data (base64)
 */
export const decryptFile = (encryptedData, walletAddress) => {
  try {
    const key = generateKey(walletAddress);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
    
    return decryptedData;
  } catch (error) {
    console.error('Error decrypting file:', error);
    throw error;
  }
};

/**
 * Generate a shared encryption key for two users
 * This allows both sender and receiver to decrypt the file
 * @param {string} senderAddress - Sender's wallet address
 * @param {string} receiverAddress - Receiver's wallet address
 * @returns {string} - Shared encryption key
 */
// export const generateSharedKey = (senderAddress, receiverAddress) => {
//   // Sort addresses to ensure consistent key generation
//   const addresses = [senderAddress, receiverAddress].sort();
//   return CryptoJS.SHA256(addresses[0] + addresses[1] + 'shared-secret').toString();
// };
const normalizeAddress = (address) => {
  return address?.trim().toLowerCase();
};

export const generateSharedKey = (senderAddress, receiverAddress) => {
  const addresses = [
    normalizeAddress(senderAddress),
    normalizeAddress(receiverAddress)
  ].sort();

  return CryptoJS.SHA256(
    addresses[0] + addresses[1] + "shared-secret"
  ).toString();
};



/**
 * Encrypt file with shared key (for peer-to-peer sharing)
 * @param {string} data - Base64 encoded file data
 * @param {string} senderAddress - Sender's wallet address
 * @param {string} receiverAddress - Receiver's wallet address
 * @returns {string} - Encrypted data (base64)
 */
// export const encryptFileShared = (data, senderAddress, receiverAddress) => {
//   try {
//     const key = generateSharedKey(senderAddress, receiverAddress);
//     // Encrypt the base64 string - CryptoJS will handle it as UTF-8 by default
//     const encrypted = CryptoJS.AES.encrypt(data, key).toString();
//     return encrypted;
//   } catch (error) {
//     console.error('Error encrypting file with shared key:', error);
//     throw error;
//   }
  
// };


export const encryptFileShared = (data, senderAddress, receiverAddress) => {
  try {
    const key = generateSharedKey(senderAddress, receiverAddress);

    console.log("Encrypt Key:", key);

    

    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

/**
 * Decrypt file with shared key
 * @param {string} encryptedData - Encrypted data (base64)
 * @param {string} senderAddress - Sender's wallet address
 * @param {string} receiverAddress - Receiver's wallet address
 * @returns {string} - Decrypted data (base64)
 */
// export const decryptFileShared = (encryptedData, senderAddress, receiverAddress) => {
//   try {
//     const key = generateSharedKey(senderAddress, receiverAddress);
//     const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    
//     // Use Latin1 encoding - base64 strings are ASCII-compatible
//     // Latin1 maps 1:1 with ASCII for the first 128 characters (includes all base64 chars)
//     let decryptedData = decrypted.toString(CryptoJS.enc.Latin1);
    
//     if (!decryptedData || decryptedData.length === 0) {
//       throw new Error('Decryption failed - invalid key or corrupted data');
//     }
    
//     // Clean the decrypted data - extract only valid base64 characters
//     // Base64 uses: A-Z, a-z, 0-9, +, /, and = for padding
//     decryptedData = decryptedData.replace(/[^A-Za-z0-9+/=]/g, '');
    
//     // Ensure proper base64 padding (base64 strings must be multiple of 4)
//     const paddingNeeded = (4 - (decryptedData.length % 4)) % 4;
//     decryptedData = decryptedData + '='.repeat(paddingNeeded);
    
//     if (decryptedData.length === 0) {
//       throw new Error('Decrypted data is empty after cleaning');
//     }
    
//     return decryptedData;
//   } catch (error) {
//     console.error('Error decrypting file with shared key:', error);
//     // Provide more helpful error message
//     if (error.message && (error.message.includes('Malformed') || error.message.includes('invalid key') || error.message.includes('empty') || error.message.includes('Empty'))) {
//       throw new Error('Decryption failed - the encryption key does not match. Make sure you are the intended recipient.');
//     }
//     throw error;
//   }
// };

// export const decryptFileShared = (encryptedData, senderAddress, receiverAddress) => {
//   try {
//     const key = generateSharedKey(senderAddress, receiverAddress);
//     console.log("Generated shared key:", key);

//     const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
//     const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

//     if (!decryptedData) {
//       throw new Error('Decryption failed - key mismatch.');
//     }

//     return decryptedData;
//   } catch (error) {
//     console.error('Error decrypting file with shared key:', error);
//     throw error;
//   }
// };

export const decryptFileShared = (encryptedData, senderAddress, receiverAddress) => {
  try {
    const key = generateSharedKey(senderAddress, receiverAddress);

    console.log("Decrypt Key:", key);

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Key mismatch or corrupted data");
    }

    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};


