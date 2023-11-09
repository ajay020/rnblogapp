import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import { AppRootStackParamList } from "../types/types";
import { getAuth } from "firebase/auth";
import { uploadImage } from "../utils/firebaseUtils";
import { db } from "../../firebaseConfig";
import ProgressIndicator from "../components/common/ProgressIndicator";

type UpdateProfileProps = {
  route: RouteProp<AppRootStackParamList, "UpdateProfile">;
  navigation: StackNavigationProp<AppRootStackParamList, "UpdateProfile">;
};

const UpdateProfileScreen: React.FC<UpdateProfileProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async (
    newName: string,
    newProfilePicture: string | null
  ) => {
    try {
      const user = getAuth().currentUser;

      if (user) {
        setLoading(true);

        let username = newName != "" ? newName : user.displayName;

        let newProfileImageUrl: string | null = user.photoURL;

        // Upload new profile picture if provided
        if (newProfilePicture) {
          newProfileImageUrl = await uploadImage(newProfilePicture, "users");
        }

        // Update the user's profile information
        await updateProfile(user, {
          displayName: username,
          photoURL: newProfileImageUrl,
        });

        // Update the user's document in the 'users' collection in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          name: username,
          photoURL: newProfileImageUrl,
        });

        console.log("User profile updated successfully.", username);
        Alert.alert("User profile updated successfully");

        // Optionally, you can also update the local user object
        const updatedUser = {
          ...user,
          displayName: newName,
          photoURL: newProfileImageUrl,
        };

        // Dispatch an action or update state with the updated user information
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      {loading && <ProgressIndicator />}

      <TouchableOpacity
        style={styles.cancelIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={32} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profilePictureContainer}
        onPress={handlePickImage}
      >
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <>
            <Text>Select Profile Picture</Text>
            <Icon name="image" size={32} color="black" />
          </>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => handleUpdateProfile(name, profilePicture)}
      >
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: StatusBar.currentHeight,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 12,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  cancelIcon: {
    position: "absolute",
    top: 28,
    left: 16,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UpdateProfileScreen;
