"use client";

import React, { useState, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from "next/router";

// INTERNAL IMPORTS
import Style from "./Filter.module.css";
import images from '../../assets';
import { ChatAppContext } from '../../Context/ChatAppContext';

const Filter = () => {

  const router = useRouter();
  const { account, addFriends } = useContext(ChatAppContext);

  return (
    <div className={Style.Filter}>
      <div className={Style.Filter_box}>
        <div className={Style.Filter_box_left}>
          <div className={Style.Filter_box_left_search}>
            <Image src={images.search} alt="search" width={20} height={20} />
            <input type="text" placeholder="Search.." />
          </div>
        </div>

        <div className={Style.Filter_box_right}>
          <button onClick={() => window.open("https://sepolia-faucet.pk910.de/","_blank")}>
            <Image src={images.addFaucet} alt="addFaucet" width={20} height={20}/>
            ADD FAUCET
          </button>

          <button onClick={() => router.push("/alluser")}>
            <Image src={images.user} alt="user" width={20} height={20}/>
            ADD FRIEND
          </button>
        </div>
      </div>
    </div>
  )
}

export default Filter;