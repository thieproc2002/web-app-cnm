import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    //signInWithEmailAndPassword,
    onAuthStateChanged,
   // signOut,
   // GoogleAuthProvider,
    //signInWithPopup,
  } from "firebase/auth";
  import { auth } from "../util/FirebaseConfig";
  const userAuthContext = createContext();
  export function UserAuthContextProvider({children}) {
    const [user, setUser] = useState({});
    function signUp(Phone, password) {
        return createUserWithEmailAndPassword(auth, Phone, password);
      }
      return (
        <userAuthContext.Provider
          value={{ user,signUp }}
        >
          {children}
        </userAuthContext.Provider>
      );
  } 
  export function useUserAuth() {
    return useContext(userAuthContext);
  }