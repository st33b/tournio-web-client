import {createContext, useContext, useEffect, useReducer} from 'react';
import {tournamentReducer, initializer} from "./tournamentReducer";

const TournamentContext = createContext({
  details: null,
  dispatch: null,
});

export const TournamentContextProvider = ({children}) => {
  const [details, dispatch] = useReducer(tournamentReducer, {}, initializer);

  useEffect(() => {
    localStorage.setItem('tournament', JSON.stringify(details));
  }, [details]);

  return (
    <TournamentContext.Provider value={{details, dispatch}}>
      {children}
    </TournamentContext.Provider>
  );
}

export const useTournamentContext = () => useContext(TournamentContext);