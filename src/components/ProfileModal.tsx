// ProfileModal.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { AppRootStackParamList } from "../types/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../../hooks/useTheme";

interface PropType {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isVisible, onClose }: PropType) => {
  const navigation =
    useNavigation<StackNavigationProp<AppRootStackParamList>>();

  const handleBackButtonPress = () => {
    // Handle back button press here
    onClose();
    return true; // Prevent default behavior (closing the app)
  };
  const { themeColors } = useTheme();

  return (
    <Modal
      //   animationIn={"bounce"}
      animationOut={"fadeOut"}
      isVisible={isVisible}
      onBackButtonPress={handleBackButtonPress}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: themeColors.backgroundSecondary },
        ]}
      >
        <TouchableOpacity
          style={styles.userControl}
          onPress={() => {
            navigation.navigate("UpdateProfile");
            onClose();
          }}
        >
          <Text
            style={[
              styles.userControlText,
              { color: themeColors.textSecondary },
            ]}
          >
            Update Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userControl}
          onPress={() => console.log("Update Profile")}
        >
          <Text
            style={[
              styles.userControlText,
              { color: themeColors.textSecondary },
            ]}
          >
            Dark mode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userControl}
          onPress={() => signOut(FIREBASE_AUTH)}
        >
          <Text
            style={[
              styles.userControlText,
              { color: themeColors.textSecondary },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  userControl: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userControlText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ProfileModal;
