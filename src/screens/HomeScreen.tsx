import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { FAB } from "react-native-elements";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { db } from "../../firebaseConfig";
import PostList from "../components/PostList";
import { AppRootStackParamList, PostData } from "../types/types";
import { fetchPosts, selectAllPosts } from "../redux/postSlice";

import {
  DocumentData,
  QuerySnapshot,
  Unsubscribe,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { RootState, useDispatch } from "../redux/store";
import { useTheme } from "../../hooks/useTheme";

interface HomeScreenProps {
  navigation: StackNavigationProp<AppRootStackParamList, "Home">;
  route: RouteProp<AppRootStackParamList, "Home">;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [postsWithAuthors, setPostsWithAuthors] = useState<PostData[] | null>(
    null
  );

  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);

  const { themeColors } = useTheme();

  React.useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  // fech post whenever a new post is created.
  React.useEffect(() => {
    const postsCollection = collection(db, "posts");

    const unsubscribe: Unsubscribe = onSnapshot(
      postsCollection,
      async (querySnapshot) => {
        dispatch(fetchPosts());
      }
    );

    return () => unsubscribe();
  }, []);

  if (posts === null) {
    return <ProgressIndicator />;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.backgroundPrimary },
      ]}
    >
      <PostList posts={posts} />
      <FAB
        visible={true}
        icon={{ name: "add", color: themeColors.textPrimary }}
        color={themeColors.accentColor}
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost")}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 60,
    right: 40,
  },
});
