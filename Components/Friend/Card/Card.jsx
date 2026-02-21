import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";

//INTERNAL IMPORTS
import Style from "./Card.module.css";
import images from "../../../assets";
import { getProfilePictureKey } from "../../../Utils/profilePicture";

const Card = ({ readMessage, el, i, readUser, getProfilePictureFromContract }) => {
  const [profilePicKey, setProfilePicKey] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (el.pubkey && getProfilePictureFromContract) {
        try {
          const pic = await getProfilePictureFromContract(el.pubkey);
          if (pic && pic.trim() !== "") {
            setProfilePicKey(pic);
            return;
          }
        } catch (error) {
          console.log("Error fetching profile picture:", error);
        }
      }
      // Fallback to localStorage
      const localPic = typeof window !== 'undefined' && el.pubkey ? getProfilePictureKey(el.pubkey) : null;
      if (localPic) {
        setProfilePicKey(localPic);
      } else {
        setProfilePicKey(null);
      }
    };
    fetchProfilePicture();
  }, [el.pubkey, getProfilePictureFromContract]);

  // Use profile picture if available, otherwise use accountName as default
  const profileImage = profilePicKey && images[profilePicKey] ? images[profilePicKey] : images.accountName;

  return (
    <Link href={{pathname: '/', 
    query: { name:`${el.name}`, address: `${el.pubkey}` },
    }}>
    <div className={Style.Card} onClick={()=>(readMessage(el.pubkey), readUser(el.pubkey))}
    >

      <div className={Style.Card_box}>

        <div className={Style.Card_box_left}>
          {/* <Image src={images.accountName} */}
          <Image src={profileImage}
          alt="username"
          width={50}
          height={50}
          className={Style.Card_box_left_img}
          />
        </div>
        <div className={Style.Card_box_right}>
          <div className={Style.Card_box_right_middle}>
            <h4>{el.name}</h4>
            <small>{el.pubkey.slice(21)}..</small>
          </div>
          <div className={Style.Card_box_right_end}>
            <small>{i + 1}</small>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
};

export default Card;
