import { UserWithCollege } from "@customTypes/models";
import React, { useState, createContext, useEffect } from "react";

export type userContextType = {
  user: UserWithCollege | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserWithCollege | undefined>>;
};

const UserContext = createContext<userContextType>({
  user: undefined,
  setUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithCollege>();

  const value = {
    user,
    setUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
