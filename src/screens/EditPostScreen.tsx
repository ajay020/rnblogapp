import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Input, Icon, Button } from "@rneui/themed";

import { collection, doc, updateDoc } from "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";

import { db } from "../../firebaseConfig";

import { RouteProp } from "@react-navigation/native";
import { AppRootStackParamList } from "../types/types";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { ScrollView } from "react-native-gesture-handler";

interface PostEditScreenProps {
  route: RouteProp<AppRootStackParamList, "EditPost">;
  navigation: StackNavigationProp<AppRootStackParamList, "EditPost">;
}

const PostEditScreen: React.FC<PostEditScreenProps> = ({
  route,
  navigation,
}) => {
  const [loading, setLoading] = useState(false);

  // Get the post data from the route params
  const { postData } = route.params;

  // Create state variables to hold the edited post data
  const [editedTitle, setEditedTitle] = useState(postData.title);
  const [editedDescription, setEditedDescription] = useState(
    postData.description
  );

  // Function to handle updating the post
  const handleUpdatePost = async () => {
    try {
      setLoading(true);
      const postsCollection = collection(db, "posts");

      const postRef = doc(postsCollection, postData.id);

      // Define the updated post data
      const updatedPostData = {
        title: editedTitle,
        description: editedDescription,
      };

      // Update the post document in Firestore
      await updateDoc(postRef, updatedPostData);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ProgressIndicator size="large" />}
      <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
        <Input
          placeholder="Title"
          value={editedTitle}
          multiline={true}
          numberOfLines={4}
          onChangeText={setEditedTitle}
          style={styles.input}
        />
        <Input
          placeholder="Description"
          value={editedDescription}
          multiline={true}
          numberOfLines={4}
          onChangeText={setEditedDescription}
          style={styles.input}
        />
      </ScrollView>
      <Button
        title="Save"
        size="lg"
        onPress={handleUpdatePost}
        style={styles.button}
      />
    </View>
  );
};

export default PostEditScreen;

const styles = StyleSheet.create({
  button: {
    // position: "absolute",
    // bottom: 10,
    padding: 16,
  },
  container: {
    padding: 12,
    flex: 1,
    // backgroundColor: "teal",
  },
  input: {
    // backgroundColor: "lightgray",
    borderBottomWidth: 0,
  },
});
