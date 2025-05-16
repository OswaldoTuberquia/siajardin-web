/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import CONSTANTS from "../common/Constants";
import { encryptAES, decryptAES } from "../common/Helper";

const Context = createContext();

export const AppContext = ({ children }) => {

  const setSessionData = (data) => {
    sessionStorage.setItem(
      CONSTANTS.SESSION_DATA,
      encryptAES(JSON.stringify(data), CONSTANTS.VALUE)
    );
  };

  const getSessionData = () => {
    return sessionStorage.getItem(CONSTANTS.SESSION_DATA) !== null
      ? JSON.parse(
          decryptAES(
            sessionStorage.getItem(CONSTANTS.SESSION_DATA),
            CONSTANTS.VALUE
          )
        )
      : null;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(CONSTANTS.SESSION_DATA);
    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = {
    logout,
    setSessionData,
    getSessionData,
  };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useAppContext = () => {
  return useContext(Context);
};
