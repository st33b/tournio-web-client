import {useState, useCallback, createContext, useContext, useReducer, useEffect} from 'react';
import {useStorage} from "../utils";
import {directorReducer, directorReducerInit} from "./directorReducer";

const DirectorContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token, userData) => {},
  logout: () => {},
  user: null,
  tournament: null,
  setTournament: (t) => {},
});

export const DirectorContextProvider = ({children}) => {
  let tokenData;
  let userData;
  let tournamentData;

  if (typeof window !== 'undefined') {
    tokenData = localStorage.getItem('token');
    userData = JSON.parse(localStorage.getItem('currentUser'));
    tournamentData = JSON.parse(localStorage.getItem('tournament'));
  }

  let initialToken, initialUser, initialTournament;
  if (tokenData) {
    initialToken = tokenData;
    initialUser = userData;
  }
  if (tournamentData) {
    initialTournament = tournamentData;
  }

  const [token, setToken] = useState(initialToken);
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [tournament, setTournament] = useState(initialTournament);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setTournament(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tournament');
  }, []);

  const loginHandler = (newToken, userDetails) => {
    setToken(newToken);
    setCurrentUser(userDetails);
    localStorage.setItem('token', newToken);
    localStorage.setItem('currentUser', JSON.stringify(userDetails));
  }

  const tournamentHandler = (newTournament) => {
    console.log("Setting tournament in DirectorContext -- got another one to remove!")
    setTournament(newTournament);
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
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    user: currentUser,
    setTournament: tournamentHandler,
    tournament: tournament,

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