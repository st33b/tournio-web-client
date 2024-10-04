import {useLocalStorage} from "../utils";
import {useEffect, useState, createContext, useContext} from "react";

const initialValue = {
  ready: false,
  user: null,
  authToken: null,
}
const LoginContext = createContext(initialValue);

export const LoginContextProvider = ({children}) => {
  const loggedOutState = {
    ready: true,
    user: null,
    authToken: null,
  }
  const [loginState, setLoginState] = useState(initialValue);

  const [storedLoginState, storeLoginState] = useLocalStorage({
    key: 'tournio-login-state',
    initialValue: loggedOutState,
  });

  // If we have a stored login state, start there.
  useEffect(() => {
    setLoginState(storedLoginState);
  }, []);

  // Write the login state to storage any time it changes.
  useEffect(() => {
    if (!loginState) {
      return;
    }
    storeLoginState(loginState);
  }, [loginState]);

  const login = (user, token) => {
    setLoginState({
      ready: true,
      user: user,
      authToken: token,
    });
  }

  const logout = () => {
    setLoginState(loggedOutState);
  }

  return (
    <LoginContext.Provider value={{
      ...loginState,
      login,
      logout,
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginContext = () => useContext(LoginContext);
