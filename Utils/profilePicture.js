export const PROFILE_PICTURE_OPTIONS = [
  "image1",
  "image2",
  "image3",
  "image4",
  "image5",
  "image6",
  "image7",
  "image8",
  "image9",
  "image10",
];

const STORAGE_PREFIX = "profilePicture_";
const PROFILE_PICTURE_CACHE = {}; // Cache for profile pictures fetched from contract

export const getProfilePictureKey = (account) => {
  if (typeof window === "undefined" || !account) return null;
  const key = localStorage.getItem(`${STORAGE_PREFIX}${account}`);
  return PROFILE_PICTURE_OPTIONS.includes(key) ? key : null;
};

export const setProfilePictureKey = (account, key) => {
  if (typeof window === "undefined" || !account) return;
  if (PROFILE_PICTURE_OPTIONS.includes(key)) {
    localStorage.setItem(`${STORAGE_PREFIX}${account}`, key);
    // Also update cache
    PROFILE_PICTURE_CACHE[account] = key;
  }
};

// Get profile picture from contract (async)
export const getProfilePictureFromContract = async (account, getProfilePictureFromContractFn) => {
  if (!account || !getProfilePictureFromContractFn) return null;
  
  // Check cache first
  if (PROFILE_PICTURE_CACHE[account]) {
    return PROFILE_PICTURE_OPTIONS.includes(PROFILE_PICTURE_CACHE[account]) ? PROFILE_PICTURE_CACHE[account] : null;
  }
  
  try {
    const profilePic = await getProfilePictureFromContractFn(account);
    if (profilePic && PROFILE_PICTURE_OPTIONS.includes(profilePic)) {
      PROFILE_PICTURE_CACHE[account] = profilePic;
      return profilePic;
    }
    return null;
  } catch (error) {
    console.log("Error fetching profile picture from contract:", error);
    return null;
  }
};

// Clear cache for an account (useful when profile picture is updated)
export const clearProfilePictureCache = (account) => {
  if (account && PROFILE_PICTURE_CACHE[account]) {
    delete PROFILE_PICTURE_CACHE[account];
  }
};