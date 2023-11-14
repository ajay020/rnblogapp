import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { FAB } from "@rneui/themed";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { db } from "../../firebaseConfig";
import PostList from "../components/PostList";
import { AppRootStackParamList, PostData } from "../types/types";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  selectAllPosts,
} from "../redux/postSlice";

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
import { useDispatch } from "../redux/store";
import { fetchLikedPostsAsync } from "../redux/likedPostSlice";
import { getAuth } from "firebase/auth";

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

  React.useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  // fech post whenever a new post is created.
  React.useEffect(() => {
    const postsCollection = collection(db, "posts");

    const unsubscribe: Unsubscribe = onSnapshot(
      postsCollection,
      async (querySnapshot) => {
        const postsData: PostData[] = [];

        for (const docRef of querySnapshot.docs) {
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
        setPostsWithAuthors(postsData);
      }
    );

    return () => unsubscribe();
  }, []);

  const getAuthor = async (authorId: string) => {
    const usersCollection = collection(db, "users");
    const authorDocRef = doc(usersCollection, authorId);
    const authorDocSnapshot = await getDoc(authorDocRef);

    if (authorDocSnapshot.exists()) {
      const authorData = authorDocSnapshot.data();
      return authorData;
    }

    return undefined;
  };

  if (postsWithAuthors === null) {
    return <ProgressIndicator />;
  }

  return (
    <View style={styles.container}>
      <PostList posts={posts} />
      <FAB
        visible={true}
        icon={{ name: "add", color: "white" }}
        color="green"
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
