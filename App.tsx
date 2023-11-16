import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged, User } from "firebase/auth";
import React from "react";

import { FIREBASE_AUTH } from "./firebaseConfig";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import ProgressIndicator from "./src/components/common/ProgressIndicator";
import { Provider } from "react-redux";
import store from "./src/redux/store";

function RootNavigation() {
  const [user, setUser] = React.useState<User>();
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      FIREBASE_AUTH,
      (user) => {
        if (user) {
          setUser(user);
          if (initializing) {
            setInitializing(false);
          }
        } else {
          // User is signed out
          setUser(undefined);
        }
      }
    );

    return unsubscribeFromAuthStatuChanged;
  }, [initializing]);

  //   if (initializing) {
  //     // You can return a loading screen here
  //     return (
  //       <View style={{ flex: 1, justifyContent: "center" }}>
  //         <ProgressIndicator />
  //       </View>
  //     );
  //   }

  return user ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
