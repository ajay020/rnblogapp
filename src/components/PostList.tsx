import React, { useEffect } from "react";
import { View, FlatList } from "react-native";

import Post from "./Post"; // Import your Post component
import { PostData } from "../types/types";
import { getAuth } from "firebase/auth";

interface PostListProps {
  posts: PostData[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  useEffect(() => {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      //   dispatch(fetchLikedPostsAsync(userId));
    }
  }, []);

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
