import {useState, useCallback, createContext, useContext} from 'react';

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = ({children}) => {
  const tokenData = typeof window !== "undefined" ? localStorage.getItem('token') : null;

  let initialToken;
  if (tokenData) {
    initialToken = tokenData;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    // Send logout (delete) request over to the server

    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const loginHandler = (token) => {
    console.log('Logging in.');
    setToken(token);
    localStorage.setItem('token', token);
  }

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);