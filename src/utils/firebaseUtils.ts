// firebaseUtils.ts
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { storage } from "../../firebaseConfig";
import { generateUniqueImageName } from "./helper";

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
