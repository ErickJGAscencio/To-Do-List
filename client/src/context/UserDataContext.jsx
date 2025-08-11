import React from "react";
import { createContext, useState } from "react";

export const UserDataContext  = createContext();

export function UserDataProvider({ children }) {
  const [userData, setUserData] = useState(null);

  const saveDataUser = (data) => {
    setUserData(data);
  };

  return (

    <UserDataContext.Provider value={{ userData, saveDataUser }}>
      {children}
    </UserDataContext.Provider>
  );
}
