import {createContext, useContext, useEffect, useReducer} from 'react';
import {commerceReducer, commerceReducerInit} from "./commerceReducer";
import {useStorage} from "../utils";

const CommerceContext = createContext({
  commerce: null,
  dispatch: null,
});

export const CommerceContextProvider = ({children}) => {
  const [storedCommerceState, storeCommerceState] = useStorage('commerce', commerceReducerInit())
  const [commerce, dispatch] = useReducer(commerceReducer, storedCommerceState, commerceReducerInit);

  useEffect(() => {
    storeCommerceState(commerce);
  }, [commerce]);

  return (
    <CommerceContext.Provider value={{commerce, dispatch}}>
      {children}
    </CommerceContext.Provider>
  );
}

export const useCommerceContext = () => useContext(CommerceContext);