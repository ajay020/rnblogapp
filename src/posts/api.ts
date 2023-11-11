import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

import { uploadImage } from "../utils/firebaseUtils";
import { FIREBASE_APP, db, storage } from "../../firebaseConfig";
import { PostData } from "../types/types";
import { deleteImage, getAuthor } from "./utils";

export const fetchPostsWithAuthors = async () => {
  const postsData: PostData[] = [];

  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection);

  const postsSnapshot = await getDocs(postsQuery);

  for (const docRef of postsSnapshot.docs) {
    const post = docRef.data() as Omit<PostData, "id">;

    const author = await getAuthor(post.authorId);
    if (author) {
      post.author = author as {
        name: string;
        email: string;
      };
    }

    postsData.push({ id: docRef.id, ...post });
  }

  return postsData;
};

// Create post
export const createPostApi = async (post: Omit<PostData, "id">) => {
  let imageUrl: string = "";

  if (post.image) {
    imageUrl = await uploadImage(post.image);
  }

  let newPost = {
    ...post,
    image: imageUrl,
  };

  // Define the Firestore collection where you want to store posts
  const postsCollection = collection(db, "posts");

  // Add the new post to the collection
  const newPostRef = await addDoc(postsCollection, newPost);

  console.log("New post added with ID: ", newPostRef.id);
  return { id: newPostRef.id, ...newPost } as PostData;
};

export const updatePostApi = async (post: PostData) => {
  const postsCollection = collection(db, "posts");

  const postRef = doc(postsCollection, post.id);

  const updatedPost = {
    ...post,
    title: post.title,
    description: post.description,
  };

  // Update the post document in Firestore
  await updateDoc(postRef, updatedPost);
  console.log("POST UPDATED !!");
  return updatedPost;
  //   navigation.goBack();
};

export const deletePostApi = async (postId: string, imgUrl: string) => {
  // Delete image associated with the post
  if (imgUrl) {
    await deleteImage(imgUrl);
  }

  const postsCollection = collection(db, "posts");
  const postRef = doc(postsCollection, postId);

  await deleteDoc(postRef);
  console.log("Post DELETED!!");
};
