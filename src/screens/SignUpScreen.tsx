import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { StackNavigationProp } from "@react-navigation/stack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { RouteProp } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { Auth, getAuth, updateProfile } from "firebase/auth";

import { FIREBASE_AUTH, db } from "../../firebaseConfig";
import { AuthRootStackParamList } from "../types/types";

type SignUpScreenProps = {
  navigation: StackNavigationProp<AuthRootStackParamList, "Register">;
  route: RouteProp<AuthRootStackParamList, "Register">;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [value, setValue] = React.useState({
    name: "",
    email: "",
    password: "",
    error: "",
  });

  function signUp() {
    setIsLoading(true);
    if (value.name === "" || value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "All fields are mandatory.",
      });
      return;
    }

    setValue({
      ...value,
      error: "",
    });
    createUser(value.email, value.name);
  }

  const createUser = async (email: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        value.email,
        value.password
      );

      if (userCredential.user) {
        const uid = userCredential.user.uid;
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
          email,
          name,
        });
      }

      await updateProfile(userCredential.user, {
        displayName: value.name,
      });
    } catch (error: any) {
      setValue({
        ...value,
        error: error.message,
      });
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign In</Text>

      {isLoading && <ActivityIndicator color={"blue"} size={"large"} />}
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Input
          placeholder="Name"
          containerStyle={styles.control}
          value={value.name}
          onChangeText={(text) => setValue({ ...value, name: text })}
          leftIcon={<Icon name="user" size={16} />}
        />
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

        <Button title="Sign up" buttonStyle={styles.control} onPress={signUp} />

        <View style={styles.linkContainer}>
          <Text>Already have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "dodgerblue" }}> Sign In here </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  controls: {
    flex: 1,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  control: {
    marginTop: 10,
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});
