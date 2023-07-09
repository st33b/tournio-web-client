import {createContext, useContext, useReducer, useEffect} from 'react';
import {useStorage} from "../utils";
import {directorReducer, directorReducerInit} from "./directorReducer";

const DirectorContext = createContext({
  state: null,
  dispatch: null,
});

export const DirectorContextProvider = ({children}) => {
  const [storedState, storeState] = useStorage('director', directorReducerInit());
  const [state, dispatch] = useReducer(directorReducer, storedState, directorReducerInit);

  useEffect(() => {
    storeState(state);
  }, [state]);

  const contextValue = {
    state: state,
    dispatch: dispatch,
  }

  return (
    <DirectorContext.Provider value={contextValue}>
      {children}
    </DirectorContext.Provider>
  );
}

export const useDirectorContext = () => useContext(DirectorContext);
