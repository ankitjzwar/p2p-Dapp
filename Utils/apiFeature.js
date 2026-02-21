// import { ethers } from "ethers";
// import web3Modal from "web3modal";

// import { ChatAppAddress, ChatAppABI } from "../Context/constants";

// export const CheckIfWalletConnected = async () => {
//     try {
//         if (!window.ethereum) return console.log("Install MetaMask");

//         const accounts = await window.ethereum.request({ 
//             method: "eth_accounts"
//         });

//         const firstAccount = accounts[0];
//         return firstAccount;
//     } catch (error) {
//         // console.log(error);
//     }
// };

// export const connectWallet = async () => {
//     try {
//         if (!window.ethereum) return console.log("Install MetaMask");

//         const accounts = await window.ethereum.request({ 
//             method: "eth_requestAccounts"
//         });
//         const firstAccount = accounts[0];
//         return firstAccount;
        
//     } catch (error) {
//         // console.log(error);
//     }
// };

// const fetchContract = (signerOrProvider) => 
//     new ethers.Contract(ChatAppAddress, ChatAppABI, signerOrProvider);

// export const connectingWithContract = async () => {
//     try {
//         const web3modal = new web3Modal();
//         const connection = await web3modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchContract(signer);

//         return contract;
//     } catch (error) {
//         // console.log(error);
//     }
// }

// // export const convertTime = (time) => {
// //     const newTime = new Date(time.toNumber());

// //     const realTime = 
// //         newTime.getHours() + 
// //         ":" + 
// //         newTime.getMinutes() + 
// //         ":" + 
// //         newTime.getSeconds()+
// //         " Date:" +
// //         newTime.getDate() +
// //         "/"+
// //         (newTime.getMonth() + 1) +
// //         "/"+
// //         newTime.getFullYear();
        
// //         return realTime;
// // }
// export const convertTime = (time) => {
//     const newTime = new Date(time.toNumber() * 1000);

//     const realTime = 
//         "Time: " +
//         newTime.getHours().toString().padStart(2, "0") + ":" +
//         newTime.getMinutes().toString().padStart(2, "0") + ":" +
//         newTime.getSeconds().toString().padStart(2, "0") +
//         " Date: " +
//         newTime.getDate() + "/" +
//         (newTime.getMonth() + 1) + "/" +
//         newTime.getFullYear();

//     return realTime;
// };
// old baby

import { ethers } from "ethers";
import web3Modal from "web3modal";

import {
  ChatAppAddress,
  ChatAppABI,
  SEPOLIA_CHAIN_ID,
} from "../Context/constants";

export const CheckIfWalletConnected = async () => {
    try {
        if (!window.ethereum) return console.log("Install MetaMask");

        const accounts = await window.ethereum.request({ 
            method: "eth_accounts"
        });

        const firstAccount = accounts[0];
        return firstAccount;
    } catch (error) {
        // console.log(error);
    }
};

export const connectWallet = async () => {
    try {
        if (!window.ethereum) return console.log("Install MetaMask");

        const accounts = await window.ethereum.request({ 
            method: "eth_requestAccounts"
        });
        const firstAccount = accounts[0];
        return firstAccount;
        
    } catch (error) {
        // console.log(error);
    }
};

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ChatAppAddress, ChatAppABI, signerOrProvider);

export const connectingWithContract = async () => {
  try {
    const web3modalInstance = new web3Modal();
    const connection = await web3modalInstance.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // Ensure user is connected to Sepolia testnet
    const network = await provider.getNetwork();
    if (network.chainId !== SEPOLIA_CHAIN_ID) {
      window.alert("Please switch your wallet network to Sepolia testnet.");
      throw new Error(
        'Kuch Gadbad hai daya'
      );
    }
      const signer = provider.getSigner();
    const contract = fetchContract(signer);

    return contract;
  } catch (error) {
    // console.log(error);
  }
};

// Get read-only contract instance (no wallet connection needed)
export const getReadOnlyContract = () => {
  try {
    // Use public RPC providers for Sepolia testnet (no API key required)
    const publicRpcUrls = [
      "https://rpc.sepolia.org", // Public Sepolia RPC
      "https://ethereum-sepolia-rpc.publicnode.com", // PublicNode
      "https://sepolia.gateway.tenderly.co", // Tenderly public RPC
    ];
    
    const network = {
      name: "sepolia",
      chainId: SEPOLIA_CHAIN_ID
    };
    
    // Try the first public RPC endpoint
    // If it fails, the calling code will handle the fallback
    const provider = new ethers.providers.JsonRpcProvider(publicRpcUrls[0], network);
    const contract = fetchContract(provider);
    return contract;
  } catch (error) {
    // Silently fail - will fall back to connected contract or localStorage
    return null;
  }
};

// export const convertTime = (time) => {
//     const newTime = new Date(time.toNumber());

//     const realTime = 
//         newTime.getHours() + 
//         ":" + 
//         newTime.getMinutes() + 
//         ":" + 
//         newTime.getSeconds()+
//         " Date:" +
//         newTime.getDate() +
//         "/"+
//         (newTime.getMonth() + 1) +
//         "/"+
//         newTime.getFullYear();
        
//         return realTime;
// }
export const convertTime = (time) => {
    const newTime = new Date(time.toNumber() * 1000);

    const realTime = 
              
        newTime.getHours().toString().padStart(2, "0") + ":" +
        newTime.getMinutes().toString().padStart(2, "0") + ":" +
        newTime.getSeconds().toString().padStart(2, "0") +
        " Date: " +
        newTime.getDate() + "/" +
        (newTime.getMonth() + 1) + "/" +
        newTime.getFullYear();

    return realTime;
};