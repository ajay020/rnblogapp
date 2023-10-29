import { createStackNavigator } from "@react-navigation/stack";
import CreatePostScreen from "../screens/CreatePostScreen";
import HomeScreen from "../screens/HomeScreen";
import { AppRootStackParamList } from "../types/types";
import PostEditScreen from "../screens/EditPostScreen";
import PostDetailScreen from "../screens/PostDetailScreen";

const Stack = createStackNavigator<AppRootStackParamList>();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="EditPost" component={PostEditScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};
