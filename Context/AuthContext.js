
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // OPEN LOGIN - ACCEPT ANY EMAIL AND PASSWORD
  const login = ({ email, password }) => {

    if (!email.trim() || !password) {
      return {
        ok: false,
        message: "Please enter email and password",
      };
    }

    setUser({
      name: email.trim().split("@")[0],
      email: email.trim(),
    });

    return { ok: true };
  };

  // REGISTER
  const register = ({ name, email, mobile, password }) => {

    if (!name || !email || !password) {
      return {
        ok: false,
        message: "All fields are required",
      };
    }

    setUser({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile,
    });

    return { ok: true };
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
