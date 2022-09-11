import {useState, useCallback, createContext, useContext, useReducer, useEffect} from 'react';
import {useStorage} from "../utils";
import {directorReducer, directorReducerInit} from "./directorReducer";

const DirectorContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token, userData) => {},
  logout: () => {},
  user: null,
});

export const DirectorContextProvider = ({children}) => {
  let tokenData;
  let userData;

  if (typeof window !== 'undefined') {
    tokenData = localStorage.getItem('token');
    userData = JSON.parse(localStorage.getItem('currentUser'));
  }

  let initialToken, initialUser, initialTournament;
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

  const tournamentHandler = (newTournament) => {
    console.log("Setting tournament in DirectorContext -- got another one to remove!")
    localStorage.setItem('tournament', JSON.stringify(newTournament));
  }

  //////////////////////////

  const [storedDirectorState, storeDirectorState] = useStorage('director', directorReducerInit());
  const [directorState, dispatch] = useReducer(directorReducer, storedDirectorState, directorReducerInit);

  useEffect(() => {
    storeDirectorState(directorState);
  }, [directorState]);

  const contextValue = {
    token: token,
    isLoggedIn: currentUser != null,
    login: loginHandler,
    logout: logoutHandler,
    user: currentUser,

    directorState: directorState,
    dispatch: dispatch,
  }

  return (
    <DirectorContext.Provider value={contextValue}>
      {children}
    </DirectorContext.Provider>
  );
}

export const useDirectorContext = () => useContext(DirectorContext);