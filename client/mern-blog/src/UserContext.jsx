import { createContext, useState } from "react";

// set from LoginPage or header
// used to determin who is logged in
// UserContextProvider is in App.jsx
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({ username: null, id: null });
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
