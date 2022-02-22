import {useState, createContext, useContext, useReducer} from 'react';
import registrationReducer from "./registrationReducer";

const RegistrationContext = createContext({
  tournament: null,
  useTournament: (tournament) => {},
  state: null,
  dispatch: null,
});

export const RegistrationContextProvider = ({children}) => {
  let tournamentData;
  if (typeof window !== "undefined") {
    tournamentData = JSON.parse(localStorage.getItem('tournament'));
  }

  let initialTournament;
  if (tournamentData) {
    initialTournament = tournamentData;
  }

  const [tournament, setTournament] = useState(initialTournament);

  const useTournamentHandler = (t) => {
    console.log("Using tournament: " + t.identifier);
    setTournament(t);
    localStorage.setItem('tournament', JSON.stringify(t));
  }

  const initialReducerState = {
    teamName: '',
    bowlers: [],
  }
  const [state, dispatch] = useReducer(registrationReducer, initialReducerState);

  ///////////////////////

  const contextValue = {
    tournament: tournament,
    useTournament: useTournamentHandler,
    state: state,
    dispatch: dispatch,
  }

  return (
    <RegistrationContext.Provider value={contextValue}>
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistrationContext = () => useContext(RegistrationContext);