import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import ProfileModal from "./ProfileModal";
import { getAuth } from "firebase/auth";
import { useDispatch } from "../redux/store";
import { toggleDarkMode } from "../redux/themeSlice";
import { useTheme } from "../../hooks/useTheme";

const UserIcon = () => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const dispatch = useDispatch();

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const user = getAuth().currentUser;
  const { darkMode, themeColors } = useTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity style={styles.profile} onPress={handleToggleDarkMode}>
        <Icon
          name={darkMode ? "weather-sunny" : "moon-waning-crescent"}
          size={28}
          color={themeColors.textSecondary}
        />
      </TouchableOpacity>

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
    padding: 4,
    borderRadius: 18,
  },
});

export default UserIcon;
