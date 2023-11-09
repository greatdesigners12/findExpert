import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { authApp } from "../controller/firebaseApp";

export const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
    const [userData, setUser] = useState(null)
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