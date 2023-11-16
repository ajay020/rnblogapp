import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card } from "react-native-elements";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import { AppRootStackParamList, PostData } from "../types/types";
import PostHeader from "./PostHeader";
import { RootState, useDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import {
  deletePost,
  dislikePostAsync,
  likePostAsync,
} from "../redux/postSlice";
import {
  dislikePost,
  likePost,
  saveLikedPostsAsync,
  selectDisLikedPostIds,
  selectLikedPostIds,
} from "../redux/likedPostSlice";
import { useTheme } from "../../hooks/useTheme";

interface PostProps {
  post: PostData;
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  const navigation = useNavigation<NavigationProp<AppRootStackParamList>>();
  const dispatch = useDispatch();
  const likedPostIds = useSelector(selectLikedPostIds);
  const dislikedPostIds = useSelector(selectDisLikedPostIds);

  const { themeColors } = useTheme();

  const handleDelete = async (postId: string, imgUrl: string | undefined) => {
    dispatch(deletePost({ postId, imgUrl }));
  };

  const handleLike = () => {
    if (!likedPostIds?.includes(post.id)) {
      dispatch(likePost(post.id)); // Update liked posts state
      dispatch(likePostAsync(post.id)); // Update likes count in posts
      dispatch(
        saveLikedPostsAsync({
          liked: likedPostIds.concat(post.id),
          disliked: dislikedPostIds,
        })
      );
    }
  };

  const handleDislike = () => {
    if (!dislikedPostIds?.includes(post.id)) {
      dispatch(dislikePost(post.id)); // Update disliked posts state
      dispatch(dislikePostAsync(post.id)); // Update dislikes count in posts
      dispatch(
        saveLikedPostsAsync({
          liked: likedPostIds,
          disliked: dislikedPostIds.concat(post.id),
        })
      );
    }
  };
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.backgroundSecondary },
      ]}
    >
      <PostHeader post={post} onDeletePress={handleDelete} />

      <TouchableOpacity
        onPress={() => navigation.navigate("PostDetail", { postData: post })}
      >
        <Text style={[styles.title, { color: themeColors.textSecondary }]}>
          {post.title}
        </Text>

        {post.image && (
          <Image source={{ uri: post.image }} style={styles.image} />
        )}
        <Text
          style={[styles.description, { color: themeColors.textSecondary }]}
          numberOfLines={5}
        >
          {post.description}
        </Text>
      </TouchableOpacity>

      <View style={styles.postFooter}>
        <Text style={[{ color: themeColors.textSecondary }]}>
          {post.likesCount}
        </Text>
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
    // backgroundColor: "white",
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
    paddingTop: 12,
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
