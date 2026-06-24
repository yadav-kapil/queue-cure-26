import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth/AuthContext";

const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const signup = async (formData) => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed");
        dispatch({ type: "LOGOUT" });
        return { success: false, message: data.message || "Registration failed" };
      }

      dispatch({
        type: "LOGIN",
        payload: {
          user: data.user,
        },
      });

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
    signup,
    isLoading,
    error,
    setError,
  };
};

export default useSignup;
