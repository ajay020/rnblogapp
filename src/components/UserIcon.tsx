import { View, Text } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import ProfileModal from "./ProfileModal";

const UserIcon = () => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  return (
    <View>
      <TouchableOpacity
        style={{ padding: 2, marginRight: 34 }}
        onPress={toggleProfileModal}
      >
        <Icon name="account-circle" size={28} />
      </TouchableOpacity>

      <ProfileModal
        isVisible={isProfileModalVisible}
        onClose={toggleProfileModal}
      />
    </View>
  );
};

export default UserIcon;
