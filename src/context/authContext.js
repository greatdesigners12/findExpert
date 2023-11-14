import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { authApp } from "../controller/firebaseApp";

export const UserContext = createContext("")
export function getValidatedUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = getAuth()
        .onAuthStateChanged(
          (user) => {
            unsubscribe();
            resolve(user);
          },
          reject // pass up any errors attaching the listener
        );
    });
  }
export const UserContextProvider = ({ children }) => {
    const [userData, setUser] = useState("")
    useEffect(() =>{
       
        
        onAuthStateChanged(authApp, function(user) {
            setUser(user)
            console.log(user)
          });
    }, [])
    return (
       
        <UserContext.Provider value={{userData, setUser}}>
            {children}
        </UserContext.Provider>
       
    );
 };