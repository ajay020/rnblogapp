import { RouteProp } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { AppRootStackParamList } from "../types/types";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";

// Define the props for the PostDetailsScreen component
type PostDetailScreenProps = {
  route: RouteProp<AppRootStackParamList, "PostDetail">;
};

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ route }) => {
  // Extract the post data from the route params
  const { postData: post } = route.params;
  const { themeColors } = useTheme();

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeColors.backgroundSecondary },
      ]}
    >
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} />
      )}
      <Text style={[styles.title, { color: themeColors.textSecondary }]}>
        {post.title}
      </Text>
      <Text style={[styles.description, { color: themeColors.textSecondary }]}>
        {post.description}
      </Text>
      {/* Add additional information here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  // Add styles for additional information if needed
});

export default PostDetailScreen;
