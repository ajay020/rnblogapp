import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import ProfileModal from "./ProfileModal";
import { getAuth } from "firebase/auth";

const UserIcon = () => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const user = getAuth().currentUser;

  return (
    <View>
      <TouchableOpacity style={styles.profile} onPress={toggleProfileModal}>
        {user && user?.photoURL ? (
          <Image
            source={{
              uri: user.photoURL,
            }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <Icon name="account-circle" size={28} />
        )}
      </TouchableOpacity>

      <ProfileModal
        isVisible={isProfileModalVisible}
        onClose={toggleProfileModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    marginRight: 22,
    // backgroundColor: "red",
    padding: 4,
    borderRadius: 18,
  },
});

export default UserIcon;
