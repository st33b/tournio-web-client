import {createContext, useContext, useEffect, useReducer} from 'react';
import {registrationReducer, regInitializer} from "./registrationReducer";
import {commerceReducer, comInitializer} from "./commerceReducer";
import {isStorageSupported} from "../utils";

const RegistrationContext = createContext({
  entry: null,
  commerce: null,
  dispatch: null,
});

export const RegistrationContextProvider = ({children}) => {
  const [entry, dispatch] = useReducer(registrationReducer, {}, regInitializer);
  const [commerce, commerceDispatch] = useReducer(commerceReducer, {}, comInitializer);

  useEffect(() => {
    if (isStorageSupported()) {
      localStorage.setItem('registration', JSON.stringify(entry));
      localStorage.setItem('commerce', JSON.stringify(commerce));
    }
  }, [entry, commerce]);

  return (
    <RegistrationContext.Provider value={{entry, dispatch, commerce, commerceDispatch}}>
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistrationContext = () => useContext(RegistrationContext);