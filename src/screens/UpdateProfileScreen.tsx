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
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import { AppRootStackParamList } from "../types/types";
import { getAuth } from "firebase/auth";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { RootState, useDispatch } from "../redux/store";
import { updateProfileAsync } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";
import { useTheme } from "../../hooks/useTheme";

type UpdateProfileProps = {
  route: RouteProp<AppRootStackParamList, "UpdateProfile">;
  navigation: StackNavigationProp<AppRootStackParamList, "UpdateProfile">;
};

const UpdateProfileScreen: React.FC<UpdateProfileProps> = ({ navigation }) => {
  const user = getAuth().currentUser;

  const [name, setName] = useState(user?.displayName || "");
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || "");

  const dispatch = useDispatch();
  const { themeColors } = useTheme();
  const { loadingUser, error } = useSelector((state: RootState) => state.user);

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
    newProfilePicture: string
  ) => {
    await dispatch(
      updateProfileAsync({
        displayName: newName,
        photoURL: newProfilePicture,
      })
    );
    dispatch(fetchPosts());
    Alert.alert("Profile updated!");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.backgroundSecondary },
      ]}
    >
      <Text style={[styles.title, { color: themeColors.textSecondary }]}>
        Update Profile
      </Text>
      {loadingUser && <ProgressIndicator />}

      {error && (
        <Text style={{ color: themeColors.errorColor }}>Error: {error}</Text>
      )}

      <TouchableOpacity
        style={styles.cancelIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={32} color={themeColors.textSecondary} />
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
            <Text style={{ color: themeColors.textSecondary }}>
              Select Profile Picture
            </Text>
            <Icon name="image" size={32} color="black" />
          </>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { color: themeColors.textSecondary }]}
        placeholder="Enter your name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TouchableOpacity
        style={[
          styles.updateButton,
          { backgroundColor: themeColors.accentColor },
        ]}
        onPress={() => handleUpdateProfile(name, profilePicture)}
      >
        <Text style={[styles.buttonText, { color: themeColors.textPrimary }]}>
          Update
        </Text>
      </TouchableOpacity>
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
    padding: 16,
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
    fontSize: 18,
  },
});

export default UpdateProfileScreen;
