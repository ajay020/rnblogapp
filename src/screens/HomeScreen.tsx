import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Button } from "@rneui/themed";
import { FAB } from "@rneui/themed";

import { FIREBASE_AUTH, db } from "../../firebaseConfig";
import PostList from "../components/PostList";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRootStackParamList, PostData } from "../types/types";
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

interface HomeScreenProps {
  navigation: StackNavigationProp<AppRootStackParamList, "Home">;
  route: RouteProp<AppRootStackParamList, "Home">;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = React.useState<PostData[] | null>(null);
  const [postsWithAuthors, setPostsWithAuthors] = useState<PostData[] | null>(
    null
  );

  const fetchPostsWithAuthors = async () => {
    try {
      const postsCollection = collection(db, "posts");
      const postsQuery = query(postsCollection);

      const postsSnapshot = await getDocs(postsQuery);
      const postsData: PostData[] = [];

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

      // Now, `postsData` contains posts with their respective authors' data.
      setPostsWithAuthors(postsData);
    } catch (error) {
      console.error("Error fetching posts with authors:", error);
    }
  };

  React.useEffect(() => {
    fetchPostsWithAuthors();
  }, []);

  React.useEffect(() => {
    // Create a reference to the "posts" collection
    const postsCollection = collection(db, "posts");

    // Fetch all documents from the "posts" collection
    const fetchPosts = async () => {
      try {
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
          postsCollection
        );
        const postsData: PostData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<PostData, "id">;
          postsData.push({ id: doc.id, ...data });
        });

        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // fetchPosts();
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
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <PostList posts={postsWithAuthors} />
      <FAB
        visible={true}
        icon={{ name: "add", color: "white" }}
        color="green"
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost")}
      />
      {/* <Button title="sign out" onPress={() => signOut(FIREBASE_AUTH)} /> */}
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
