// //0x5FbDB2315678afecb367f032d93F642f64180aa3
// import chatAppJSON from "./ChatApp.json";

// export const ChatAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// export const ChatAppABI = chatAppJSON.abi;
//old baby

//0x5FbDB2315678afecb367f032d93F642f64180aa3
import chatAppJSON from "./ChatApp.json";

// Sepolia testnet chain id
export const SEPOLIA_CHAIN_ID = 11155111;


export const ChatAppAddress =
  process.env.NEXT_PUBLIC_CHAT_APP_ADDRESS ||
  "0xYourSepoliaContractAddressHere";

export const ChatAppABI = chatAppJSON.abi;
