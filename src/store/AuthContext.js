import {useState, useCallback, createContext, useContext} from 'react';

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token, userData) => {},
  logout: () => {},
  user: null,
});

export const AuthContextProvider = ({children}) => {
  let tokenData;
  let userData;
  if (typeof window !== "undefined") {
    tokenData = localStorage.getItem('token');
    userData = JSON.parse(localStorage.getItem('currentUser'));
  }

  let initialToken, initialUser;
  if (tokenData) {
    initialToken = tokenData;
    initialUser = userData;
  }

  const [token, setToken] = useState(initialToken);
  const [currentUser, setCurrentUser] = useState(initialUser);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }, []);

  const loginHandler = (newToken, userDetails) => {
    setToken(newToken);
    setCurrentUser(userDetails);
    localStorage.setItem('token', newToken);
    localStorage.setItem('currentUser', JSON.stringify(userDetails));
  }

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    user: currentUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);