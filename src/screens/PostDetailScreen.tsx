import { RouteProp } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AppRootStackParamList } from "../types/types";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

// Define the props for the PostDetailsScreen component
type PostDetailScreenProps = {
  route: RouteProp<AppRootStackParamList, "PostDetail">;
  navigation: StackNavigationProp<AppRootStackParamList, "PostDetail">;
};

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({
  route,
  navigation,
}) => {
  // Extract the post data from the route params
  const { postData: post } = route.params;
  const { themeColors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cancelIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={44} color={themeColors.textSecondary} />
      </TouchableOpacity>
      <ScrollView
        style={[
          { backgroundColor: themeColors.backgroundSecondary },
          {
            padding: 8,
            paddingTop: 18,
            // backgroundColor: "green",
          },
        ]}
      >
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.image} />
        )}

        <Text style={[styles.title, { color: themeColors.textSecondary }]}>
          {post.title}
        </Text>
        <Text
          style={[styles.description, { color: themeColors.textSecondary }]}
        >
          {post.description}
        </Text>
        {/* Add additional information here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // gap: 20,
    padding: 18,
    paddingTop: 28,
    justifyContent: "space-between",
    // backgroundColor: "red",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    marginTop: 8,
  },
  cancelIcon: {
    position: "absolute",
    top: 28,
    left: 20,
    zIndex: 100,
  },
});

export default PostDetailScreen;
