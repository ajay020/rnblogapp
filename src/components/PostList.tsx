import React from "react";
import { View, FlatList } from "react-native";

import Post from "./Post"; // Import your Post component
import { PostData } from "../types/types";

interface PostListProps {
  posts: PostData[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <View style={{ padding: 0 }}>
      <FlatList
        data={posts}
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Post post={item} />}
      />
    </View>
  );
};

export default PostList;
