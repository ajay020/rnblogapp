import React from "react";
import { onAuthStateChanged, User } from "firebase/auth";

import { FIREBASE_AUTH } from "../firebaseConfig";

export function useAuthentication() {
  const [user, setUser] = React.useState<User>();

  console.log({ user });

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      FIREBASE_AUTH,
      (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      }
    );

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user,
  };
}
