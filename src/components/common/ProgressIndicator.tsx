import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface ProgressIndicatorProps {
  size?: "small" | "large";
  color?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  size = "large",
  color = "blue",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "pink",
  },
});

export default ProgressIndicator;
