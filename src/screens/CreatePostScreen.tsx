import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

import CreatePost from "../components/CreatePost";
import { AppRootStackParamList } from "../types/types";
import { FIREBASE_APP, db } from "../../firebaseConfig";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { createPost, fetchPosts } from "../redux/postSlice";
import { RootState, useDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import { useTheme } from "../../hooks/useTheme";

type CreatePostScreenProps = {
  navigation: StackNavigationProp<AppRootStackParamList, "CreatePost">;
  route: RouteProp<AppRootStackParamList, "CreatePost">;
};

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { themeColors } = useTheme();

  const { loadingCreate, error } = useSelector(
    (state: RootState) => state.posts
  );

  const handleCreatePost = async (post: {
    image?: string;
    title: string;
    description: string;
  }) => {
    const user = getAuth(FIREBASE_APP).currentUser;
    if (user) {
      let newPost = { ...post, authorId: user.uid, likesCount: 0 };
      await dispatch(createPost(newPost));
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.backgroundPrimary },
      ]}
    >
      {loadingCreate && <ProgressIndicator />}
      {error && (
        <Text style={{ color: "red", padding: 12, marginTop: 18 }}>
          Error: {error}
        </Text>
      )}
      <CreatePost onCreatePost={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    gap: 20,
    backgroundColor: "lightblue",
    // justifyContent: "flex-start",
  },
});

export default CreatePostScreen;
