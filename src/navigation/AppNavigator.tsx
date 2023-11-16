import { createStackNavigator } from "@react-navigation/stack";
import CreatePostScreen from "../screens/CreatePostScreen";
import HomeScreen from "../screens/HomeScreen";
import { AppRootStackParamList } from "../types/types";
import PostEditScreen from "../screens/EditPostScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import UserIcon from "../components/UserIcon";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import { useTheme } from "../../hooks/useTheme";

const Stack = createStackNavigator<AppRootStackParamList>();

export default () => {
  const { themeColors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: themeColors.backgroundPrimary },
        headerTitleStyle: { color: themeColors.textSecondary },
        headerTintColor: themeColors.textSecondary,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerRight: () => <UserIcon /> }}
      />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="EditPost" component={PostEditScreen} />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          headerShown: false,
          headerTintColor: themeColors.textSecondary,
        }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
