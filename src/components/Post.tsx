import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card, Button, Icon } from "@rneui/themed";
import { ref, deleteObject } from "firebase/storage";
import { collection, deleteDoc, doc } from "firebase/firestore";

import { AppRootStackParamList, PostData } from "../types/types";
import PostHeader from "./PostHeader";
import { db, storage } from "../../firebaseConfig";
import ProgressIndicator from "./common/ProgressIndicator";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface PostProps {
  post: PostData;
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<AppRootStackParamList>>();

  const toggleLike = () => {
    setLiked(!liked);
  };

  const handleDelete = async (postId: string, imgUrl: string) => {
    try {
      setLoading(true);

      // Delete image associated with the post
      if (imgUrl) {
        await deleteImage(imgUrl);
      }

      const postsCollection = collection(db, "posts");
      const postRef = doc(postsCollection, postId);

      await deleteDoc(postRef);
      console.log("Post DELETED!!");
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setLoading(true);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    try {
      await deleteObject(imageRef);
      console.log("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("PostDetail", { postData: post })}
      style={styles.container}
    >
      {loading && <ProgressIndicator size="large" />}

      <PostHeader post={post} onDeletePress={handleDelete} />

      <Card.Divider />
      <Text style={styles.title}>{post.title}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} />
      )}
      <Text style={styles.description} numberOfLines={5}>
        {post.description}
      </Text>
      <TouchableOpacity onPress={toggleLike}>
        <Text style={liked ? styles.likeTextActive : styles.likeText}>
          {liked ? "Unlike" : "Like"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    backgroundColor: "gray",
    padding: 8,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  likeText: {
    color: "gray",
    fontSize: 16,
  },
  likeTextActive: {
    color: "red",
    fontSize: 16,
  },
});

export default Post;
