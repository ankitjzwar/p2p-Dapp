import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'

//INTERNAL IMPORT
import { 
    CheckIfWalletConnected,
     connectWallet,
      connectingWithContract,
      getReadOnlyContract,
    } from '../Utils/apiFeature';
    import { setProfilePictureKey } from '../Utils/profilePicture';

    export const ChatAppContext = React.createContext();

    //WRAP APP
    export const ChatAppProvider = ({children}) => {
        
    
        //USESTATE
        const [account, setAccount] = useState("");
        const [userName, setUserName] = useState("");
        const [friendLists, setFriendLists] = useState([]);
        const [friendMsg, setFriendMsg] = useState([]);
        const [loading, setLoading] = useState(false);
        const [userLists, setUserLists] = useState([]);
        const [error, setError] = useState("");

        //CHAT USER DATA
        const [currentUserName, setCurrentUserName] = useState("");
        const [currentUserAddress, setCurrentUserAddress] = useState("");

        const router = useRouter();

        //FETCH DATA AT TIME OF PAGE LOAD
        const fetchData = async () => {
            try {
                //GET THE CONTRACT
                const contract = await connectingWithContract();

                //GET ACCOUNT
                const connectedAccount = await connectWallet();
                setAccount(connectedAccount);

                // GET USERNAME
                const userName = await contract.getUsername(connectedAccount);
                setUserName(userName);
                
                //GET FRIEND LIST
                const friendLists = await contract.getMyFriendList();
                setFriendLists(friendLists);

                //GET ALL USER LIST
                const userList = await contract.getAllAppUser();
                setUserLists(userList);
            } catch (error) {
                // setError("Please Install And Connect Your Wallet");
                // console.log(error);

            }
        };

        useEffect(() => {
            fetchData();
        }, []);

        //READ MESSAGE
        const readMessage = async(friendAddress)=>{
            try {
                const contract = await connectingWithContract();
                const read = await contract.readMessage(friendAddress);
                setFriendMsg(read);

            } catch (error) {
                console.log("Currently You Have no Message");
            }
        }

        //CREATE ACCOUNT
        const createAccount = async({ name, accountAddress , ProfilePictureKey })=>{
            try {
                // if(name || accountAddress) return setError("Name and Account Address connot be empty");

                const contract = await connectingWithContract();
                const getCreatedUser = await contract.createAccount(name);
                setLoading(true);
                await getCreatedUser.wait();
                
                // Always set profile picture (even if it's the default "image1")
                const profilePicToSet = ProfilePictureKey || "image1";
                try {
                    // Store profile picture on-chain so it's visible to all users
                    if (contract.setProfilePicture) {
                        const setProfilePic = await contract.setProfilePicture(profilePicToSet);
                        await setProfilePic.wait();
                        console.log("Profile picture saved to contract:", profilePicToSet);
                    } else {
                        console.log("setProfilePicture function not found in contract - contract may need to be recompiled");
                    }
                } catch (profileError) {
                    console.error("Error setting profile picture on-chain:", profileError);
                    setError("Error saving profile picture. Please try updating it later.");
                    // Continue even if profile picture setting fails - will use localStorage
                }
                
                // Also store locally for faster access
                const connectedAccount = await connectWallet();
                if (connectedAccount) {
                    setProfilePictureKey(connectedAccount, profilePicToSet);
                    console.log("Profile picture saved to localStorage:", profilePicToSet);
                }
                setLoading(false);
                window.location.reload();
            } catch (error) {
                console.log("Error creating account:", error);
                setError("Error while creating your account Please reload the browser")
            }
        }

        //UPDATE PROFILE PICTURE
        const updateProfilePicture = async(profilePictureKey)=>{
            try {
                const contract = await connectingWithContract();
                const setProfilePic = await contract.setProfilePicture(profilePictureKey);
                setLoading(true);
                await setProfilePic.wait();
                
                // Also update localStorage
                const connectedAccount = await connectWallet();
                if (connectedAccount) {
                    setProfilePictureKey(connectedAccount, profilePictureKey);
                }
                setLoading(false);
                window.location.reload();
            } catch (error) {
                console.log("Error updating profile picture:", error);
                setError("Error updating profile picture. Please try again.")
            }
        }

        //ADD YOUR FRIEND
        const addFriends = async({name, accountAddress})=>{
            try {
                // if(name || accountAddress) return setError("Name and Account Address connot be empty");

                const contract = await connectingWithContract();
                const addMyFriend = await contract.addFriend(accountAddress, name);
                setLoading(true);
                await addMyFriend.wait();
                setLoading(false);
                router.push('/');
                window.location.reload();
            } catch (error) {
                setError("Error while adding friend Please reload the browser")
            }
        }    
        
        //SEND MESSAGE TO YOUR FRIEND
        const sendMessage = async({msg, address})=>{
            try {
                // if(msg || address) return setError("Please Type your Messag");

                const contract = await connectingWithContract();
                const addMessage = await contract.sendMessage(address, msg);
                setLoading(true);
                await addMessage.wait();
                setLoading(false);
                window.location.reload();
            } catch (error) {
                setError("Please reload and try again")
            }
        }

        //READ INFO
            const readUser = async(userAddress)=>{
                const contract = await connectingWithContract();
                const userName = await contract.getUsername(userAddress);
                setCurrentUserName(userName);
                setCurrentUserAddress(userAddress);
            }

        //GET PROFILE PICTURE FROM CONTRACT
        const getProfilePictureFromContract = async(userAddress)=>{
            try {
                if (!userAddress) return null;
                
                let contract = null;
                
                // Try connected contract first if wallet is available (more reliable)
                try {
                    if (account) {
                        contract = await connectingWithContract();
                    }
                } catch (err) {
                    // Wallet not connected or failed, continue to read-only
                }
                
                // Fallback to read-only contract if connected contract failed
                if (!contract) {
                    contract = getReadOnlyContract();
                }
                
                if (contract) {
                    try {
                        // Add timeout to prevent hanging
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Contract call timeout')), 3000)
                        );
                        
                        // Check if the function exists in the contract
                        if (contract.getProfilePicture) {
                            const profilePic = await Promise.race([
                                contract.getProfilePicture(userAddress),
                                timeoutPromise
                            ]);
                            
                            // Return null if empty string, otherwise return the pic
                            if (profilePic && profilePic.trim() !== "") {
                                return profilePic;
                            }
                            return null;
                        }
                    } catch (callError) {
                        // Contract call failed - silently return null, will use localStorage fallback
                        return null;
                    }
                }
                
                return null;
            } catch (error) {
                // Catch any unexpected errors - silently return null
                return null;
            }
        }

        return (

            <ChatAppContext.Provider value={{ readMessage, createAccount, addFriends, sendMessage, readUser, connectWallet, CheckIfWalletConnected, account, userName, friendLists, friendMsg, loading, userLists, error, setError, currentUserName, currentUserAddress, getProfilePictureFromContract, updateProfilePicture }}>
                {children}
            </ChatAppContext.Provider>
        )
    }
