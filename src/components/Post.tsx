import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card } from "@rneui/themed";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import { AppRootStackParamList, PostData } from "../types/types";
import PostHeader from "./PostHeader";
import ProgressIndicator from "./common/ProgressIndicator";
import { useDispatch } from "../redux/store";
import {
  deletePost,
  dislikePostAsync,
  likePostAsync,
} from "../redux/postSlice";
import { dislikePostApi } from "../posts/api";
import { Icon } from "react-native-elements";

interface PostProps {
  post: PostData;
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  const navigation = useNavigation<NavigationProp<AppRootStackParamList>>();
  const dispatch = useDispatch();

  const handleDelete = async (postId: string, imgUrl: string) => {
    dispatch(deletePost({ postId, imgUrl }));
  };

  const handleLike = () => {
    dispatch(likePostAsync(post.id));
  };

  const handleDislike = () => {
    dispatch(dislikePostAsync(post.id));
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.postFooter}>
        <Text>{post.likesCount}</Text>
        <TouchableOpacity onPress={handleLike}>
          <FontAwesome name="thumbs-o-up" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDislike}>
          <FontAwesome name="thumbs-o-down" size={24} color="gray" />
        </TouchableOpacity>
      </View>
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
  postFooter: {
    flexDirection: "row",
    // backgroundColor: "lightgray",
    gap: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
});

export default Post;
