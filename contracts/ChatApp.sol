// SPDX-License-Identifier: MIT

pragma solidity  >=0.7.0 <0.9.0;

contract ChatApp{

    //USER STRUCTURE
    struct User{
        string name;
        string profilePicture;
        friend[] friendList;
    }

    struct friend{
        address pubkey;
        string name;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;

    }

    struct AllUserStruct{
        string name;
        address accountAddress;
    }

    AllUserStruct[] getAllUser;

    mapping(address => User) userList; //evey user personal data
    mapping(bytes32 => message[]) allMessages; //this arry contain msg btw two users

    //CHECK USER EXIST OR NOT
    function checkUserExist(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0;
    }

    //CREATE ACCCOUNT FUNCTION
    function createAccount(string calldata name) external{
        require(checkUserExist(msg.sender) == false, "User already exist");
        require(bytes(name).length > 0, "Name can't be empty");

        userList[msg.sender].name = name;
        userList[msg.sender].profilePicture = ""; // Initialize empty profile picture

        getAllUser.push(AllUserStruct(name, msg.sender));
    }

    //SET PROFILE PICTURE FUNCTION
    function setProfilePicture(string calldata profilePictureKey) external{
        require(checkUserExist(msg.sender), "Create your account first");
        userList[msg.sender].profilePicture = profilePictureKey;
    }

    //GET PROFILE PICTURE FUNCTION
    function getProfilePicture(address pubkey) external view returns(string memory){
        require(checkUserExist(pubkey), "User not exist");
        return userList[pubkey].profilePicture;
    }

    //GET USER NAME
    function getUsername(address pubkey) external view returns(string memory){
        require(checkUserExist(pubkey), "User not exist");
        return userList[pubkey].name;
    }

    //ADD FRIEND FUNCTION
    function addFriend(address friend_key, string calldata name) external{
        require(checkUserExist(msg.sender), "Create your account first");
        require(checkUserExist(friend_key), "Friend not exist");
        require(msg.sender != friend_key, "You can't add yourself");
        require(checkAlreadyFriends(msg.sender, friend_key) == false, "User already in your friend list");

        _addFriend(msg.sender, friend_key, name);
        _addFriend(friend_key, msg.sender, userList[msg.sender].name); //Ankit adds Rahul → Rahul automatically added
    }

    //check already friends or not
    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool){
        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
            address temp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = temp;
        }

        for(uint256 i=0; i<userList[pubkey1].friendList.length; i++){
            if(userList[pubkey1].friendList[i].pubkey == pubkey2) return true;
        }
        return false;
    }

    //push data to friendlist
    function _addFriend(address me, address friend_key, string memory name) internal{
        friend memory newFriend = friend(friend_key, name);
        userList[me].friendList.push(newFriend);
    }

    //GET MY FRIEND (return frindlist)
    function getMyFriendList() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    //GET CHAT CODE( in bytes32 hash )
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        }else{
            return keccak256(abi.encodePacked(pubkey2, pubkey1));
        }
    }


    //SEND MESSAGE
    function sendMessage(address friend_key, string calldata _msg) external{
        require(checkUserExist(msg.sender), "Create your account first");
        require(checkUserExist(friend_key), "Friend not exist");
        require(checkAlreadyFriends(msg.sender, friend_key), "You are not friend with this user");
        require(bytes(_msg).length > 0, "Message can't be empty");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    //READ MESSAGES
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    function getAllAppUser() external view returns(AllUserStruct[] memory){
        return getAllUser;
    }
}

