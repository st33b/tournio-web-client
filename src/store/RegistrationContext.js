import {createContext, useContext, useEffect, useReducer} from 'react';
import {registrationReducer, registrationInitializer} from "./registrationReducer";
import {useStorage} from "../utils";

const RegistrationContext = createContext({
  registration: null,
  dispatch: null,
});

const initialRegistrationState = {
  tournament: null,
  team: null,
  bowler: null,
  bowlers: null,
  partner: null,
};

export const RegistrationContextProvider = ({children}) => {
  const [storedRegistrationState, storeRegistrationState] = useStorage('registration', initialRegistrationState);
  const [registration, dispatch] = useReducer(registrationReducer, storedRegistrationState, registrationInitializer);

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