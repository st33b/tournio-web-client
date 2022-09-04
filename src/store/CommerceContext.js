import {createContext, useContext, useEffect, useReducer} from 'react';
import {commerceReducer, commerceInitializer} from "./commerceReducer";
import {useStorage} from "../utils";

const CommerceContext = createContext({
  commerce: null,
  dispatch: null,
});

const initialCommerceState = {
  tournament: null,
  bowler: null,
  cart: [],
  availableItems: {},
  purchasedItems: [],
  freeEntry: null,
  checkoutSessionId: null,
  error: null,
}

export const CommerceContextProvider = ({children}) => {
  const [storedCommerceState, storeCommerceState] = useStorage('commerce', initialCommerceState)

  const [commerce, dispatch] = useReducer(commerceReducer, storedCommerceState, commerceInitializer);

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