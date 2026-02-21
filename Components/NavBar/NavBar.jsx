import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/router";

//INTERNAL IMPORTS
import Style from "./NavBar.module.css";
import { ChatAppContext } from '../../Context/ChatAppContext';
import { Model, Error } from '../index';
import images from '../../assets';
import { getProfilePictureKey } from '../../Utils/profilePicture';


const NavBar = () => {
  const menuItems = [
    {
      menu: "ALL USERS",
      link: "/alluser"
    },
    {
      menu: "CHAT",
      link: "/",
    },
    {
      menu: "CONTACT",
      link: "/contact",
    },
    {
      menu: "ABOUT",
      link: "/about",
    },
    {
      menu: "FAQS",
      link: "/faq",
    },
    {
      menu: "TERMS OF USE",
      link: "/termofuse",
    }
  ]

  //USESTATE
  // const [active, setActive] = useState(2);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [profilePicKey, setProfilePicKey] = useState(null);

  const { account, userName, connectWallet, createAccount, updateProfilePicture, error, getProfilePictureFromContract } = useContext(ChatAppContext);
  const router = useRouter();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (account && getProfilePictureFromContract) {
        try {
          const pic = await getProfilePictureFromContract(account);
          if (pic && pic.trim() !== "") {
            setProfilePicKey(pic);
            return;
          }
        } catch (error) {
          console.log("Error fetching profile picture:", error);
        }
      }
      // Fallback to localStorage
      const localPic = typeof window !== 'undefined' && account ? getProfilePictureKey(account) : null;
      setProfilePicKey(localPic);
    };
    fetchProfilePicture();
  }, [account, getProfilePictureFromContract]);

  const profileImage = profilePicKey && images[profilePicKey] ? images[profilePicKey] : (userName ? images.accountName : images.create2);
  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          <Image src={images.logo} alt='logo' width={50} height={50}></Image>
        </div>
        <div className={Style.NavBar_box_right}>
          {/* FOR DESKTOP */}
          <div className={Style.NavBar_box_right_menu}>
            {/* {menuItems.map((el, i) => (
              <div
                onClick={() => setActive(i + 1)}
                key={i + 1}
                className={`${Style.NavBar_box_right_menu_items} ${
                 active == i + 1 ? Style.active_btn : ""}`}
                 >
                <Link className={Style.NavBar_box_right_menu_items_link} href={el.link}>
                {el.menu}
                </Link>
              </div>
            ))} */}
            {menuItems.map((el, i) => (
  <div
    key={i}
    className={`${Style.NavBar_box_right_menu_items} ${
      router.pathname === el.link ? Style.active_btn : ""
    }`}
  >
    <Link
      className={Style.NavBar_box_right_menu_items_link}
      href={el.link}
    >
      {el.menu}
    </Link>
  </div>
))}
          </div>

          {/* FOR MOBILE */}
          {open && (
             <div className={Style.mobile_menu}>
            {menuItems.map((el, i) => (
              <div
                onClick={() => setActive(i + 1)}
                key={i + 1} 
                className={`${Style.mobile_menu_items} ${
                 active == i + 1 ? Style.active_btn : ""}`}
                 >
                <Link className={Style.mobile_menu_items_link} href={el.link}>
                {el.menu}
                </Link>
              </div>
            ))}

            <p className={Style.mobile_menu_btn}>
              <Image src={images.close} alt="close" width={50} height={50}
              onClick={() => setOpen(false)} 
              />
            </p>
          </div>
          )}

          {/*CONNECT WALLET*/}
          <div className={Style.NavBar_box_right_connect}>
            {account == "" ? (
              <button onClick={()=> connectWallet()}>
                {""}
                <span>Connect Wallet</span>
              </button>
            ) : (
              <button onClick={()=> setOpenModel(true)}>
                {""}
                <Image 
                  // src={userName ? images.accountName : images.create2}
                  src={profileImage}
                  alt="Account image"
                  width={30}
                  height={30}
                  className={Style.NavBar_profileImg}
                />
                {''}
                <small>{userName || "Create Account"}</small>
              </button>
            )}
          </div>

          <div
            className={Style.NavBar_box_right_open}
            onClick={() => setOpen(true)}
          >
            <Image src={images.open} alt="open"
            width={30}
            height={30} />
          </div>
        </div>
      </div>

      {/* MODEL COMPONENT */}
      {openModel && (
        <div className={Style.modelBox}>
          <Model 
          openBox={setOpenModel} 
          title={userName ? "UPDATE YOUR" : "WELCOME TO"}
          head="P2P BUDDY"
          info="No sign-ups, no servers, no middlemen just you, your wallet, and pure peer-to-peer magic. Register yourself once, and you’re officially off the grid but always connected."
          smallInfo={userName ? "Choose a new profile picture..." : "Kindly select your name..."}
          image={images.hero}
          functionName={userName ? updateProfilePicture : createAccount}
          address={account}
          showProfilePicture={true}
          onlyProfilePicture={!!userName}
          />
        </div>
      )}
      {error === "" ? "" : <Error error={error} />}
    </div>
  );
};

export default NavBar
