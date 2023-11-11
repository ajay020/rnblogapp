import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import CreatePost from "../components/CreatePost";
import { AppRootStackParamList } from "../types/types";
import { FIREBASE_APP, db } from "../../firebaseConfig";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { uploadImage } from "../utils/firebaseUtils";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createPost } from "../redux/postSlice";

type CreatePostScreenProps = {
  navigation: StackNavigationProp<AppRootStackParamList, "CreatePost">;
  route: RouteProp<AppRootStackParamList, "CreatePost">;
};

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const dispath = useDispatch();

  const handleCreatePost2 = async (post: {
    image?: string;
    title: string;
    description: string;
  }) => {
    try {
      let user = getAuth().currentUser;
      if (user) {
        setLoading(true);
        let imageUrl: string | undefined = "";

        if (post.image) {
          imageUrl = await uploadImage(post.image);
        }

        let newPost = { ...post, authorId: user?.uid, image: imageUrl };

        // Define the Firestore collection where you want to store posts
        const postsCollection = collection(db, "posts");

        // Add the new post to the collection
        const newPostRef = await addDoc(postsCollection, newPost);

        console.log("New post added with ID: ", newPostRef.id);

        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error adding post: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = (post: {
    image?: string;
    title: string;
    description: string;
  }) => {
    const user = getAuth(FIREBASE_APP).currentUser;
    if (user) {
      let newPost = { ...post, authorId: user.uid };
      dispath(createPost(newPost) as any);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ProgressIndicator />}
      <CreatePost onCreatePost={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    // backgroundColor: "lightblue",
    // justifyContent: "flex-start",
  },
});

export default CreatePostScreen;
