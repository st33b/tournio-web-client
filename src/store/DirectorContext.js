import {createContext, useContext, useReducer, useEffect} from 'react';
import {useStorage} from "../utils";
import {directorReducer, directorReducerInit} from "./directorReducer";

const DirectorContext = createContext({
  directorState: null,
  dispatch: null,
});

export const DirectorContextProvider = ({children}) => {
  const [storedDirectorState, storeDirectorState] = useStorage('director', directorReducerInit());
  const [directorState, dispatch] = useReducer(directorReducer, storedDirectorState, directorReducerInit);

  useEffect(() => {
    storeDirectorState(directorState);
  }, [directorState]);

  const contextValue = {
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
