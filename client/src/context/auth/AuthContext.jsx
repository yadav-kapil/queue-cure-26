import { createContext, useContext, useEffect, useReducer } from "react";
import { authReducer, initialState } from "./authReducer";
import { verifyUser } from "../../services/authService";
import SiteLoading from "../../components/common/SiteLoading";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      verifyUser(dispatch);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (state.isLoading) {
    return <SiteLoading />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthContextProvider");
  }

  return context;
};
