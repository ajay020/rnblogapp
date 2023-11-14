// firebaseUtils.ts
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { db, storage } from "../../firebaseConfig";
import { generateUniqueImageName } from "./helper";
import { doc, updateDoc } from "firebase/firestore";
import { User, getAuth, updateProfile } from "firebase/auth";
import { UpdateProfilePayload } from "../types/types";

export const uploadImage = async (imageUri: string, folderName = "images") => {
  let uniqueName = generateUniqueImageName();
  const storageRef = ref(storage, `${folderName}/${uniqueName}`);

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload the image to Storage using uploadBytes
    await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Re-throw the error to handle it at the calling function
  }
};

export const updateUserProfile = async (
  profileData: UpdateProfilePayload,
  user: User
) => {
  try {
    const { displayName: newName, photoURL: newProfilePicture } = profileData;

    let newProfileImageUrl = newProfilePicture;

    // Upload new profile picture if provided
    if (newProfilePicture) {
      newProfileImageUrl = await uploadImage(newProfilePicture, "users");
    }

    // Update the user's profile information
    await updateProfile(user, {
      displayName: newName,
      photoURL: newProfileImageUrl,
    });

    // Update the user's document in the 'users' collection in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      name: newName,
      photoURL: newProfileImageUrl,
    });

    console.log("User profile updated successfully.", newName);

    // Optionally, you can also update the local user object
    const updatedUser = {
      ...user,
      displayName: newName,
      photoURL: newProfileImageUrl,
    };

    // Dispatch an action or update state with the updated user information
  } catch (error) {
    console.error("Error updating profile: ", error);
  } finally {
  }
};
