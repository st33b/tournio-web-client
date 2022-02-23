import {createContext, useContext, useEffect, useReducer} from 'react';
import {registrationReducer, initializer} from "./registrationReducer";

const RegistrationContext = createContext({
  entry: null,
  dispatch: null,
});

export const RegistrationContextProvider = ({children}) => {
  const [entry, dispatch] = useReducer(registrationReducer, {}, initializer);

  useEffect(() => {
    localStorage.setItem('registration', JSON.stringify(entry));
  }, [entry]);

  return (
    <RegistrationContext.Provider value={{entry, dispatch}}>
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistrationContext = () => useContext(RegistrationContext);