import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth/AuthContext";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      console.log(data)
      if (!res.ok || !data.success) {
        setError(data.message || "Login failed");
        dispatch({ type: "LOGOUT" });
        return { success: false, message: data.message || "Login failed" };
      }

      // Dispatch login action
      dispatch({
        type: "LOGIN",
        payload: {
          user: data.user,
        },
      });

      // Role-based redirect
      const redirectPath = data.user.role === "doctor" ? "/doctor" : "/receptionist";
      navigate(redirectPath, { replace: true });

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message || "Something went wrong");
      dispatch({ type: "LOGOUT" });
      return { success: false, message: err.message || "Something went wrong" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    setError,
  };
};

export default useLogin;
