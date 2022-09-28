import {createContext, useContext, useEffect, useReducer} from 'react';
import {registrationReducer, registrationReducerInit} from "./registrationReducer";
import {useStorage} from "../utils";

const RegistrationContext = createContext({
  registration: null,
  dispatch: null,
});

export const RegistrationContextProvider = ({children}) => {
  const [storedRegistrationState, storeRegistrationState] = useStorage('registration', registrationReducerInit());
  const [registration, dispatch] = useReducer(registrationReducer, storedRegistrationState, registrationReducerInit);

  useEffect(() => {
    storeRegistrationState(registration);
  }, [registration]);

  return (
    <RegistrationContext.Provider value={{registration, dispatch}}>
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistrationContext = () => useContext(RegistrationContext);