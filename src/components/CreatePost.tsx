import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Input } from "react-native-elements";

import * as ImagePicker from "expo-image-picker";

interface CreatePostProps {
  onCreatePost: (newPost: {
    image?: string;
    title: string;
    description: string;
  }) => void;
}

const CreatePost = ({ onCreatePost }: CreatePostProps) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreatePost = () => {
    // Validate input here if needed
    if (title && description) {
      onCreatePost({ image, title, description });
      setImage("");
      setTitle("");
      setDescription("");
    } else {
      // Handle validation error
      console.error("Please fill in all fields.");
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text>Select Image</Text>
          <MaterialCommunityIcons name="image-edit" size={35} />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Title:</Text>
      <Input
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Enter post title"
      />

      <Text style={styles.label}>Description:</Text>
      <Input
        style={styles.input}
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="Enter post description"
        multiline
        numberOfLines={4}
      />

      <Button title="Create Post" onPress={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    gap: 10,
    padding: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    // height: 40,
    borderColor: "gray",
    // borderWidth: 1,
    // marginBottom: 16,
    // paddingLeft: 8,
  },
});

export default CreatePost;
