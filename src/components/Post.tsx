import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card } from "@rneui/themed";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { AppRootStackParamList, PostData } from "../types/types";
import PostHeader from "./PostHeader";
import ProgressIndicator from "./common/ProgressIndicator";
import { useDispatch } from "../redux/store";
import { deletePost } from "../redux/postSlice";

interface PostProps {
  post: PostData;
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<AppRootStackParamList>>();
  const dispatch = useDispatch();

  const toggleLike = () => {
    setLiked(!liked);
  };

  const handleDelete = async (postId: string, imgUrl: string) => {
    dispatch(deletePost({ postId, imgUrl }));
  };

  return (
    <View style={styles.container}>
      {loading && <ProgressIndicator size="large" />}

      <PostHeader post={post} onDeletePress={handleDelete} />

      <Card.Divider />
      <TouchableOpacity
        onPress={() => navigation.navigate("PostDetail", { postData: post })}
      >
        <Text style={styles.title}>{post.title}</Text>

        {post.image && (
          <Image source={{ uri: post.image }} style={styles.image} />
        )}
        <Text style={styles.description} numberOfLines={5}>
          {post.description}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleLike}>
        <Text style={liked ? styles.likeTextActive : styles.likeText}>
          {liked ? "Unlike" : "Like"}
        </Text>
      </TouchableOpacity>
    </View>
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
