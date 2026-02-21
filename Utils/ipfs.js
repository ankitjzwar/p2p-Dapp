// Pinata IPFS integration
// Note: We use fetch API directly instead of pinataSDK to avoid SSR issues in Next.js

/**
 * Upload file to IPFS via Pinata
 * @param {File} file - The file to upload
 * @param {string} encryptedData - The encrypted file data (base64)
 * @returns {Promise<string>} - IPFS hash (CID)
 */
export const uploadToIPFS = async (file, encryptedData) => {
  try {
    // Create a JSON object with file metadata and encrypted data
    const fileData = {
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      encryptedData: encryptedData,
      timestamp: new Date().toISOString()
    };

    // Convert to JSON string and create a Blob
    const jsonString = JSON.stringify(fileData);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create FormData for Pinata
    const formData = new FormData();
    formData.append('file', blob, `${file.name}.json`);

    // Pinata options
    const options = {
      pinataMetadata: {
        name: file.name,
      },
      pinataOptions: {
        cidVersion: 0,
      }
    };

    formData.append('pinataOptions', JSON.stringify(options.pinataOptions));
    formData.append('pinataMetadata', JSON.stringify(options.pinataMetadata));

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || '',
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.IpfsHash; // This is the CID
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

/**
 * Retrieve file from IPFS
 * @param {string} ipfsHash - The IPFS hash (CID)
 * @returns {Promise<Object>} - File data object with encryptedData
 */
export const retrieveFromIPFS = async (ipfsHash) => {
  try {
    // Use Pinata gateway or public IPFS gateway
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    
    const response = await fetch(gatewayUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve from IPFS: ${response.statusText}`);
    }

    const fileData = await response.json();
    return fileData;
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw error;
  }
};
