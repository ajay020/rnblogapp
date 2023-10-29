import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // You may need to install this library
import { AppRootStackParamList, PostData } from "../types/types";

interface PostHeaderProps {
  onDeletePress: (postId: string, imgUrl: string) => Promise<void>;
  post: PostData;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onDeletePress }) => {
  const navigation = useNavigation<NavigationProp<AppRootStackParamList>>();

  const { author } = post;

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Icon name="person" size={24} />

        <Text style={styles.authorName}>By:{author?.name}</Text>
      </View>
      <View style={styles.iconButtonsContainer}>
        <TouchableOpacity onPress={() => onDeletePress(post.id, post.image)}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditPost", { postData: post })}
        >
          <Icon name="create" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButtonsContainer: {
    flexDirection: "row",
    gap: 20,
  },
});

export default PostHeader;
