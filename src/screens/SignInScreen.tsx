import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Input } from "react-native-elements";
import { signInWithEmailAndPassword } from "firebase/auth";

import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "@rneui/themed";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";

import { FIREBASE_AUTH } from "../../firebaseConfig";

import { RouteProp } from "@react-navigation/native";
import { AppRootStackParamList, AuthRootStackParamList } from "../types/types";

type SignInScreenProps = {
  navigation: StackNavigationProp<AuthRootStackParamList, "Login">;
  route: RouteProp<AuthRootStackParamList, "Login">;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  async function signIn() {
    setIsLoading(true);

    if (value.email === "" || value.password === "") {
      setIsLoading(false);
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        value.email,
        value.password
      );
    } catch (error: any) {
      setValue({
        ...value,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign In</Text>

      {isLoading && <ActivityIndicator color={"blue"} size={"large"} />}

      {!!value.error && (
        <View>
          <Text style={styles.error}>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Input
          placeholder="Email"
          containerStyle={styles.control}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon name="envelope" size={16} />}
        />

        <Input
          placeholder="Password"
          containerStyle={styles.control}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon name="key" size={16} />}
        />

        <Button
          radius={"sm"}
          size="lg"
          title="Sign in"
          buttonStyle={styles.control}
          onPress={signIn}
        />
        <View style={styles.linkContainer}>
          <Text>Don't have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "dodgerblue" }}> Sign up here </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
    // alignItems: "center",
    justifyContent: "center",
  },

  controls: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    paddingTop: 20,
    textAlign: "center",
  },
  control: {
    marginTop: 10,
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "red",
  },
});

export default SignInScreen;
