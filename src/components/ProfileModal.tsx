// ProfileModal.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { getAuth, signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";

interface PropType {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isVisible, onClose }: PropType) => {
  const handleBackButtonPress = () => {
    // Handle back button press here
    onClose();
    return true; // Prevent default behavior (closing the app)
  };

  return (
    <Modal
      //   animationIn={"bounce"}
      //   animationOut={"bounce"}
      isVisible={isVisible}
      onBackButtonPress={handleBackButtonPress}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.userControl}
          onPress={() => console.log("Update Profile")}
        >
          <Text style={styles.userControlText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userControl}
          onPress={() => console.log("Update Profile")}
        >
          <Text style={styles.userControlText}>Dark mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userControl}
          onPress={() => signOut(FIREBASE_AUTH)}
        >
          <Text style={styles.userControlText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    // backgroundColor: "wheat",
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
