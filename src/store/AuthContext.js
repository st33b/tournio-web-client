import {useState, useCallback, createContext, useContext} from 'react';

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  user: null,
});

export const AuthContextProvider = ({children}) => {
  const tokenData = typeof window !== "undefined" ? localStorage.getItem('token') : null;

  let initialToken;
  if (tokenData) {
    initialToken = tokenData;
  }

  const [token, setToken] = useState(initialToken);
  const [userData, setUserData] = useState(null);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    // Send logout (delete) request over to the server

    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const loginHandler = (token, userDetails) => {
    setToken(token);
    setUserData(userDetails);
    localStorage.setItem('token', token);
  }

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    user: userData,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);