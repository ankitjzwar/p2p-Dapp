import React, {useState, useEffect, useRef} from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import EmojiPicker from 'emoji-picker-react';

//INTERNAL IMPORT
import Style from "./Chat.module.css";
import images from '../../../assets';
import {convertTime} from '../../../Utils/apiFeature';
import {Loader} from '../../index';
import { uploadToIPFS, retrieveFromIPFS } from '../../../Utils/ipfs';
import { encryptFileShared, decryptFileShared } from '../../../Utils/encryption';
import { getProfilePictureKey } from "../../../Utils/profilePicture";

const Chat = ({functonName, readMessage, friendMsg, account, userName, loading, currentUserName, currentUserAddress, readUser, setError, getProfilePictureFromContract}) => {

  //USE STATE
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [showDownloadNotification, setShowDownloadNotification] = useState(false);
  
  
  // Maximum file size: 50MB (IPFS can handle larger files)
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
  const [chatData, setChatData] = useState({
    name: "",
    address: "",
  })
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState(null);
  const [friendProfilePic, setFriendProfilePic] = useState(null);
  const [accountProfilePic, setAccountProfilePic] = useState(null);

  const router =useRouter()
  const inputRef = useRef(null);

  useEffect(()=>{
    if(!router.isReady) return
    setChatData(router.query);
   
  },[router.isReady]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Inject styles for emoji picker search fix
  useEffect(() => {
    if (showEmojiPicker) {
      const styleId = 'emoji-picker-search-fix';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .emoji_picker input,
          .emoji_picker input[type="text"],
          .emoji_picker input[type="search"],
          .emoji_picker .epr-search input,
          .emoji_picker .epr-search-container input {
            padding-left: 2.5rem !important;
            padding-right: 1rem !important;
            box-sizing: border-box !important;
          }
          .emoji_picker .epr-search-container,
          .emoji_picker .epr-search,
          .emoji_picker [class*="epr-header"] {
            position: relative !important;
          }
          .emoji_picker .epr-search-container svg,
          .emoji_picker .epr-search svg,
          .emoji_picker .epr-header svg,
          .emoji_picker [class*="epr"] svg {
            position: absolute !important;
            left: 0.75rem !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 10 !important;
            pointer-events: none !important;
            width: 1rem !important;
            height: 1rem !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [showEmojiPicker]);

  // Handle emoji selection from library
  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    // Don't close picker - allow multiple selections
  };

  // Close emoji picker when input is focused
  const handleInputFocus = () => {
    setShowEmojiPicker(false);
  };

  // Close emoji picker when sending message
  const handleSendMessage = () => {
    if (message.trim()) {
      functonName({msg: message, address: chatData.address});
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  useEffect(()=>{
    if(!router.isReady) return;
    if(chatData.address){
      // When switching between friends, re-fetch messages + selected user info
      readMessage(chatData.address);
      readUser(chatData.address);
    }
  },[router.isReady, chatData.address]);

  // Fetch profile pictures from contract
  useEffect(() => {
    const fetchProfilePictures = async () => {
      if (currentUserAddress && getProfilePictureFromContract) {
        try {
          const pic = await getProfilePictureFromContract(currentUserAddress);
          if (pic && pic.trim() !== "") {
            setCurrentUserProfilePic(pic);
          } else {
            // Fallback to localStorage
            const localPic = typeof window !== 'undefined' ? getProfilePictureKey(currentUserAddress) : null;
            setCurrentUserProfilePic(localPic);
          }
        } catch (error) {
          console.log("Error fetching current user profile:", error);
          const localPic = typeof window !== 'undefined' ? getProfilePictureKey(currentUserAddress) : null;
          setCurrentUserProfilePic(localPic);
        }
      }
      if (chatData.address && getProfilePictureFromContract) {
        try {
          const pic = await getProfilePictureFromContract(chatData.address);
          if (pic && pic.trim() !== "") {
            setFriendProfilePic(pic);
          } else {
            // Fallback to localStorage
            const localPic = typeof window !== 'undefined' ? getProfilePictureKey(chatData.address) : null;
            setFriendProfilePic(localPic);
          }
        } catch (error) {
          console.log("Error fetching friend profile:", error);
          const localPic = typeof window !== 'undefined' ? getProfilePictureKey(chatData.address) : null;
          setFriendProfilePic(localPic);
        }
      }
      if (account && getProfilePictureFromContract) {
        try {
          const pic = await getProfilePictureFromContract(account);
          if (pic && pic.trim() !== "") {
            setAccountProfilePic(pic);
          } else {
            // Fallback to localStorage
            const localPic = typeof window !== 'undefined' ? getProfilePictureKey(account) : null;
            setAccountProfilePic(localPic);
          }
        } catch (error) {
          console.log("Error fetching account profile:", error);
          const localPic = typeof window !== 'undefined' ? getProfilePictureKey(account) : null;
          setAccountProfilePic(localPic);
        }
      }
    };
    fetchProfilePictures();
  }, [currentUserAddress, chatData.address, account, getProfilePictureFromContract]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        if (setError) {
          setError(`File size too large. Maximum size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        } else {
          alert(`File size too large. Maximum size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        }
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  // Convert file to base64, encrypt, upload to IPFS, and send hash
  const handleFileUpload = async (file) => {
    try {
      if (!account || !chatData.address) {
        if (setError) {
          setError("Please connect your wallet and select a friend.");
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result.split(',')[1]; // Remove data:type;base64, prefix
          
          // Encrypt the file data using shared key (both sender and receiver can decrypt)
          const encryptedData = encryptFileShared(base64Data, account, chatData.address);
          
          // Upload encrypted file to IPFS
          const ipfsHash = await uploadToIPFS(file, encryptedData);
          
          // Format: IPFS|filename|type|ipfshash (store only hash on-chain)
          const fileMessage = `IPFS|${file.name}|${file.type || 'application/octet-stream'}|${ipfsHash}`;
          
          // Send only the IPFS hash to blockchain (much smaller!)
          await functonName({msg: fileMessage, address: chatData.address});
          setSelectedFile(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error("Error sending file:", error);
          if (setError) {
            if (error.message.includes('IPFS')) {
              setError("Failed to upload file to IPFS. Please check your Pinata API keys.");
            } else {
              setError("Failed to send file: " + error.message);
            }
          }
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.onerror = () => {
        if (setError) {
          setError("Error reading file. Please try again.");
        }
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (setError) {
        setError("Error uploading file. Please try again.");
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Check if message is a file (supports both old FILE format and new IPFS format)
  const isFileMessage = (msg) => {
    return msg && (msg.startsWith('FILE|') || msg.startsWith('IPFS|'));
  };

  // Parse file message (supports both formats)
  const parseFileMessage = (msg) => {
    if (!isFileMessage(msg)) return null;
    const parts = msg.split('|');
    if (parts.length >= 4) {
      if (msg.startsWith('IPFS|')) {
        // New IPFS format: IPFS|filename|type|ipfshash
        return {
          fileName: parts[1],
          fileType: parts[2],
          ipfsHash: parts.slice(3).join('|'), // Rejoin in case hash contains pipes
          isIPFS: true
        };
      } else {
        // Old format: FILE|filename|type|base64data (for backward compatibility)
        return {
          fileName: parts[1],
          fileType: parts[2],
          base64Data: parts.slice(3).join('|'),
          isIPFS: false
        };
      }
    }
    return null;
  };

  // Download file (handles both IPFS and direct base64)
  const downloadFile = async (fileData, fileName, fileType, isIPFS = false, ipfsHash = null, senderAddress = null) => {
    try {
      let decryptedData;
      
      if (isIPFS && ipfsHash) {
        // Retrieve from IPFS and decrypt
        if (!account || !chatData.address) {
          if (setError) {
            setError("Please connect your wallet to download encrypted files.");
          }
          return;
        }

        // Show download notification
        setShowDownloadNotification(true);

        // Retrieve file from IPFS
        const ipfsData = await retrieveFromIPFS(ipfsHash);
        
        // Determine sender and receiver addresses
        // senderAddress parameter is the address of the person who sent the message
        // When encrypting, we use: encryptFileShared(base64Data, account, chatData.address)
        // So we need to use the same two addresses (account and chatData.address) for decryption
        // The shared key works regardless of order since we sort addresses in generateSharedKey
        const senderAddr = senderAddress || chatData.address;
        const receiverAddr = account;
        
        // IMPORTANT: Use the two chat participants' addresses, not sender/receiver roles
        // The encryption was done with (account, chatData.address), so decryption needs the same pair
        const addr1 = account;
        const addr2 = chatData.address;
        
        // Decrypt the file data (shared key works for both sender and receiver)
        decryptedData = decryptFileShared(ipfsData.encryptedData, addr1, addr2);
        
        // Clear loading message
        if (setError) {
          setError("");
        }
      } else {
        // Direct base64 data (old format)
        decryptedData = fileData;
      }

      // Validate and convert decrypted base64 to blob and download
      // Ensure decryptedData is valid base64 before decoding
      if (!decryptedData || typeof decryptedData !== 'string') {
        throw new Error('Invalid decrypted data format');
      }
      
      // Clean the base64 string
      let cleanBase64 = decryptedData.trim()
        .replace(/\s/g, '')           // Remove whitespace
        .replace(/\0/g, '')           // Remove null bytes
        .replace(/\n/g, '')           // Remove newlines
        .replace(/\r/g, '')          // Remove carriage returns
        .replace(/[^A-Za-z0-9+/=]/g, ''); // Keep only base64 characters
      
      // Ensure proper padding
      const paddingNeeded = (4 - (cleanBase64.length % 4)) % 4;
      cleanBase64 = cleanBase64 + '='.repeat(paddingNeeded);
      
      // Try to decode base64
      let byteCharacters;
      try {
        byteCharacters = atob(cleanBase64);
      } catch (atobError) {
        console.error('Base64 decode error:', atobError);
        console.error('Base64 string length:', cleanBase64.length);
        console.error('Base64 preview:', cleanBase64.substring(0, 100));
        throw new Error('Failed to decode base64 data. The file may be corrupted or the decryption key is incorrect.');
      }
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Hide notification after download completes
      setShowDownloadNotification(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Hide notification on error
      setShowDownloadNotification(false);
      if (setError) {
        if (error.message.includes('Decryption')) {
          setError("Failed to decrypt file. Make sure you're the intended recipient.");
        } else if (error.message.includes('IPFS')) {
          setError("Failed to retrieve file from IPFS. Please try again.");
        } else {
          setError("Error downloading file: " + error.message);
        }
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // console.log(chatData.address, chatData.name);
  
  return (
    <div className={Style.Chat}>
      {currentUserName && currentUserAddress ? (
        <div className={Style.Chat_user_info}>
          {(() => {
            // Try contract first, then localStorage, then default
            let profilePicKey = currentUserProfilePic;
            if (!profilePicKey && typeof window !== 'undefined' && currentUserAddress) {
              profilePicKey = getProfilePictureKey(currentUserAddress);
            }
            const profileImage = profilePicKey && images[profilePicKey] ? images[profilePicKey] : images.accountName;
            return (
              <Image 
                src={profileImage}
                alt="image"
                width={70}
                height={70}
                className={Style.Chat_user_avatar}
              />
            );
          })()}
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      ): (
        ""
      )}

      <div className={Style.Chat_box_box}>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {
              friendMsg.map((el, i)=>(
                <div key={i}>
                  {el.sender == chatData.address? (
                    <div className={Style.Chat_box_left_title}>
                      {(() => {
                        const profilePicKey = friendProfilePic || (typeof window !== 'undefined' && chatData.address ? getProfilePictureKey(chatData.address) : null);
                        const profileImage = profilePicKey && images[profilePicKey] ? images[profilePicKey] : images.accountName;
                        return (
                          <Image 
                            src={profileImage}
                            alt="image"
                            width={50}
                            height={50}
                            className={Style.Chat_message_avatar}
                          />
                        );
                      })()}
                      <span>
                        {chatData.name} {""}
                        <small>Time: {convertTime(el.timestamp)}</small>
                      </span>
                    </div>
                  ) : (
                    <div className={Style.Chat_box_left_title}>
                      {(() => {
                        const profilePicKey = accountProfilePic || (typeof window !== 'undefined' && account ? getProfilePictureKey(account) : null);
                        const profileImage = profilePicKey && images[profilePicKey] ? images[profilePicKey] : images.accountName;
                        return (
                          <Image 
                            src={profileImage}
                            alt="image"
                            width={50}
                            height={50}
                            className={Style.Chat_message_avatar}
                          />
                        );
                      })()}
                      <span>
                        {userName} {""}
                        <small>Time: {convertTime(el.timestamp)}</small>
                      </span>
                    </div>
                  )}
                  {isFileMessage(el.msg) ? (
                    <div className={Style.file_message}>
                      {(() => {
                        const fileData = parseFileMessage(el.msg);
                        if (fileData) {
                          const isImage = fileData.fileType.startsWith('image/');
                          // For IPFS files, we can't calculate size without downloading
                          // For old format, calculate from base64
                          const fileSize = fileData.isIPFS ? null : (fileData.base64Data ? Math.round((fileData.base64Data.length * 3) / 4) : null);
                          
                          return (
                            <div className={Style.file_container}>
                              {isImage && !fileData.isIPFS && fileData.base64Data ? (
                                <div className={Style.file_preview}>
                                  <img 
                                    src={`data:${fileData.fileType};base64,${fileData.base64Data}`}
                                    alt={fileData.fileName}
                                    className={Style.file_image}
                                  />
                                </div>
                              ) : (
                                <div className={Style.file_icon_container}>
                                  <Image src={images.file} alt="file" width={40} height={40} />
                                  {fileData.isIPFS && (
                                    <span style={{fontSize: '0.7rem', marginTop: '0.25rem', display: 'block'}}>🔒 IPFS</span>
                                  )}
                                </div>
                              )}
                              <div className={Style.file_info}>
                                <p className={Style.file_name}>{fileData.fileName}</p>
                                {fileSize && <p className={Style.file_size}>{formatFileSize(fileSize)}</p>}
                                {fileData.isIPFS && <p className={Style.file_size}>Encrypted & Stored on IPFS</p>}
                                <button 
                                  className={Style.download_btn}
                                  onClick={() => downloadFile(
                                    fileData.base64Data || '', 
                                    fileData.fileName, 
                                    fileData.fileType,
                                    fileData.isIPFS,
                                    fileData.ipfsHash,
                                    el.sender // Pass sender address for decryption
                                  )}
                                >
                                  {fileData.isIPFS ? 'Download & Decrypt' : 'Download'}
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return <p>{el.msg}</p>;
                      })()}
                    </div>
                  ) : (
                    <p>{el.msg}
                      {""} {""}
                    </p>
                  )}
                </div>
              ))
            }
          </div>
        </div>

        {currentUserName && currentUserAddress ? (

          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              <div className={Style.emoji_wrapper} ref={emojiPickerRef}>
                <Image 
                  src={images.smile} 
                  alt="smile" 
                  width={50} 
                  height={50}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                {showEmojiPicker && (
                  <div className={Style.emoji_picker}>
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width="100%"
                      height="350px"
                      previewConfig={{ showPreview: false }}
                      searchDisabled={false}
                      skinTonesDisabled={true}
                    />
                  </div>
                )}
              </div>
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Type your Message"
                onChange={(e)=> setMessage(e.target.value)}
                value={message}
                onFocus={handleInputFocus}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    handleSendMessage();
                  }
                }}
              />
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <Image 
                src={images.file} 
                alt="file" 
                width={50} 
                height={50}
                style={{ cursor: 'pointer' }}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              />
              {
                loading == true ? (
                  <Loader/>
                ) : (
                  <Image 
                    src={images.send} 
                    alt="file" 
                    width={50} 
                    height={50}
                    style={{ cursor: 'pointer' }}
                    onClick={handleSendMessage}
                  />
                )
              }
            </div>
          </div>
        ) :""}
      </div>
      
      {/* Download Notification */}
      {showDownloadNotification && (
        <div className={Style.download_notification}>
          <div className={Style.download_notification_content}>
            <span className={Style.download_icon}>📥</span>
            <p className={Style.download_text}>File Downloading from IPFS...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
