import { collection, doc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { db, storage } from "../../firebaseConfig";

export const getAuthor = async (authorId: string) => {
  const usersCollection = collection(db, "users");
  const authorDocRef = doc(usersCollection, authorId);
  const authorDocSnapshot = await getDoc(authorDocRef);

  if (authorDocSnapshot.exists()) {
    const authorData = authorDocSnapshot.data();
    return authorData;
  }

  return undefined;
};
export const deleteImage = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl);
  try {
    await deleteObject(imageRef);
    console.log("Image deleted successfully.");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
