import React from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      <Text
        style={[
          { color: "white", textAlign: "center", fontWeight: "bold" },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: { backgroundColor: "dodgerblue", padding: 12 },
});
