import React, {useState, useEffect} from 'react'
import Image from 'next/image'

//INTERNAL IMPORTS
import Style from "./UserCard.module.css";
import images from '../../assets';
import { getProfilePictureKey, PROFILE_PICTURE_OPTIONS } from '../../Utils/profilePicture';

const UserCard = ({el, i , addFriends, getProfilePictureFromContract}) => {
  // console.log(el);
  const [profilePicKey, setProfilePicKey] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!el.accountAddress) {
        setProfilePicKey(null);
        return;
      }

      // First check localStorage immediately (fast, works for current user)
      const localPic = typeof window !== 'undefined' ? getProfilePictureKey(el.accountAddress) : null;
      if (localPic && PROFILE_PICTURE_OPTIONS.includes(localPic)) {
        setProfilePicKey(localPic);
      }

      // Then try to get from contract (for all users) with timeout
      if (getProfilePictureFromContract) {
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Contract call timeout')), 5000)
          );
          
          const pic = await Promise.race([
            getProfilePictureFromContract(el.accountAddress),
            timeoutPromise
          ]);
          
          if (pic && pic.trim() !== "" && PROFILE_PICTURE_OPTIONS.includes(pic)) {
            setProfilePicKey(pic);
            return;
          }
        } catch (error) {
          // Silently fail - already have localStorage fallback or will use default
          // Only log unexpected errors
          if (!error.message?.includes('timeout') && !error.message?.includes('network')) {
            console.log(`Error fetching profile picture for ${el.accountAddress}:`, error.message);
          }
        }
      }
      
      // If no profile picture found at all, set to null (will show default placeholder)
      if (!localPic || !PROFILE_PICTURE_OPTIONS.includes(localPic)) {
        setProfilePicKey(null);
      }
    };
    fetchProfilePicture();
  }, [el.accountAddress, getProfilePictureFromContract]);

  // Use profile picture if available, otherwise use default placeholder (not sequential)
  const profileImage = profilePicKey && images[profilePicKey] ? images[profilePicKey] : images.accountName;
  
  return (
    <div className={Style.UserCard}>
      <div className={Style.UserCard_box}>
        <Image
        className={Style.UserCard_box_img}
        src={profileImage}
        alt="user"
        width={100}
        height={100}
        />

        <div className={Style.UserCard_box_info}>
          <h3>{el.name}</h3>
          <p>{el.accountAddress.slice(0,25)}</p>
          <button onClick={() => addFriends({name: el.name, accountAddress: el.accountAddress})}>Add Friend</button>
        </div>
      </div>

      <small className={Style.number}>{i + 1}</small>
    </div>
  )
}

export default UserCard
