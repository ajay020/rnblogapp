import { createStackNavigator } from "@react-navigation/stack";

import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { AuthRootStackParamList } from "../types/types";
import { useTheme } from "../../hooks/useTheme";

const Stack = createStackNavigator<AuthRootStackParamList>();

const AuthNavigator = () => {
  const { themeColors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: themeColors.backgroundPrimary },
        headerTitleStyle: { color: themeColors.textSecondary },
        headerTintColor: themeColors.textSecondary,
      }}
    >
      <Stack.Screen name="Login" component={SignInScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
