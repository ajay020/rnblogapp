import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Input, Icon, Button, Text } from "@rneui/themed";
import { ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { StackNavigationProp } from "@react-navigation/stack";

import { AppRootStackParamList } from "../types/types";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { updatePost } from "../redux/postSlice";
import { RootState, useDispatch } from "../redux/store";

interface PostEditScreenProps {
  route: RouteProp<AppRootStackParamList, "EditPost">;
  navigation: StackNavigationProp<AppRootStackParamList, "EditPost">;
}

const PostEditScreen: React.FC<PostEditScreenProps> = ({
  route,
  navigation,
}) => {
  // Get the post data from the route params
  const { postData } = route.params;

  // Create state variables to hold the edited post data
  const [editedTitle, setEditedTitle] = useState(postData.title);
  const [editedDescription, setEditedDescription] = useState(
    postData.description
  );

  const dispatch = useDispatch();
  const { loadingUpdate, error } = useSelector(
    (state: RootState) => state.posts
  );

  // Function to handle updating the post
  const handleUpdatePost = async () => {
    let updatedPost = {
      ...postData,
      title: editedTitle,
      description: editedDescription,
    };
    await dispatch(updatePost(updatedPost));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {loadingUpdate && <ProgressIndicator size="large" />}
      {error && (
        <Text style={{ color: "red", padding: 12, marginTop: 18 }}>
          Error: {error}
        </Text>
      )}
      <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
        <Input
          placeholder="Title"
          value={editedTitle}
          multiline={true}
          numberOfLines={3}
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
