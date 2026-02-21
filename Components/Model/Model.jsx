// import React, { useState, useContext } from 'react';
// import Image from "next/image";

// //INTERNAL IMPORTS
// import Style from "./Model.module.css";
// import images from "../../assets";
// import { ChatAppContext } from '../../Context/ChatAppContext';
// import { Loader } from '../../Components/index';


// const Model = ({ openBox, title, address, head, info, smallInfo, image, functionName }) => {

//     //USESTATE
//     const [name, setName] = useState("");
//     const [accountAddress, setAccountAddress] = useState("");

//     const {loading} = useContext(ChatAppContext);
//   return (
//     <div className={Style.Model}>
//       <div className={Style.Model_box}>
//         <div className={Style.Model_box_left}>
//           <Image src={image} alt="hero" width={700} height={700} />
//         </div>
//         <div className={Style.Model_box_right}>
//           <h1>{title} <span>{head}</span></h1>
//           <p>{info}</p>
//           <small>{smallInfo}</small>

//           {
//             loading == true ? (
//               <Loader />
//             ) : (
//               <div className={Style.Model_box_right_name}>
//             <div className={Style.Model_box_right_name_info}>
//               <Image src={images.username} alt="user" width={30} height={30}/>
//               <input type="text"
//               placeholder="Your Name"
//               onChange={(e)=> setName(e.target.value)}
//               />
//             </div>
//             <div className={Style.Model_box_right_name_info}>
//               <Image src={images.account} alt="user" width={30} height={30}/>
//               <input type="text"
//               placeholder={address || "Enter Address..."}
//               onChange={(e)=> setAccountAddress(e.target.value)}
//               />
//             </div>

//             <div className={Style.Model_box_right_name_btn}>
//               <button
//               onClick={() => functionName({name, accountAddress})}>
//                 {""}
//                 <Image src={images.send} alt="send" width={30} height={30} />
//                 {""}
//                 Submit
//               </button>

//               <button
//               onClick={() => openBox(false)}>
//                 {""}
//                 <Image src={images.close} alt="send" width={30} height={30} />
//                 {""}
//                 Cancle
//               </button>
//             </div>
//           </div>
//             )
//           }

          
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Model
//old baby

import React, { useState, useContext } from 'react';
import Image from "next/image";

//INTERNAL IMPORTS
import Style from "./Model.module.css";
import images from "../../assets";
import { ChatAppContext } from '../../Context/ChatAppContext';
import { Loader } from '../../Components/index';
import { PROFILE_PICTURE_OPTIONS } from '../../Utils/profilePicture';

const Model = ({ openBox, title, address, head, info, smallInfo, image, functionName, showProfilePicture = false, onlyProfilePicture = false }) => {

    //USESTATE
    const [name, setName] = useState("");
    const [accountAddress, setAccountAddress] = useState("");
    const [selectedProfilePicture, setSelectedProfilePicture] = useState("image1");

    const {loading} = useContext(ChatAppContext);

    const handleSubmit = () => {
      if (showProfilePicture && onlyProfilePicture) {
        // Update profile picture mode
        functionName(selectedProfilePicture);
        return;
      }

      if (showProfilePicture) {
        functionName({ name, accountAddress, ProfilePictureKey: selectedProfilePicture });
      } else {
        functionName({ name, accountAddress });
      }
    };

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_left}>
          <Image src={image} alt="hero" width={700} height={700} />
        </div>
        <div className={Style.Model_box_right}>
          <h1>{title} <span>{head}</span></h1>
          <p>{info}</p>
          <small>{smallInfo}</small>

          {
            loading == true ? (
              <Loader />
            ) : (
              <div className={Style.Model_box_right_name}>
            {!onlyProfilePicture && (
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.username} alt="user" width={30} height={30}/>
                <input type="text"
                placeholder="Your Name"
                onChange={(e)=> setName(e.target.value)}
                />
              </div>
            )}
            {showProfilePicture && (
              <div className={Style.Model_box_right_profile}>
                <small className={Style.Model_profile_label}>Choose your profile picture</small>
                <div className={Style.Model_profile_grid}>
                  {PROFILE_PICTURE_OPTIONS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`${Style.Model_profile_thumb} ${selectedProfilePicture === key ? Style.Model_profile_thumb_selected : ""}`}
                      onClick={() => setSelectedProfilePicture(key)}
                    >
                      <Image src={images[key]} alt={key} width={48} height={48} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!onlyProfilePicture && (
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.account} alt="user" width={30} height={30}/>
                <input type="text"
                placeholder={address || "Enter Address..."}
                onChange={(e)=> setAccountAddress(e.target.value)}
                />
              </div>
            )}

            <div className={Style.Model_box_right_name_btn}>
              <button
              onClick={handleSubmit}>
                {""}
                <Image src={images.send} alt="send" width={30} height={30} />
                {""}
                Submit
              </button>

              <button
              onClick={() => openBox(false)}>
                {""}
                <Image src={images.close} alt="send" width={30} height={30} />
                {""}
                Cancle
              </button>
            </div>
          </div>
            )
          }

          
        </div>
      </div>
    </div>
  )
}

export default Model

