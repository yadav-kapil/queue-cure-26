import { useState, useCallback } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useSession } from "../context/session/SessionContext";
import { useNavigate } from "react-router";

export const useDoc = () => {
  const { user, dispatch: authDispatch } = useAuth();
  const { dispatch: sessionDispatch } = useSession();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  
  // Action states
  const [isCancelling, setIsCancelling] = useState(false);
  const [hireLoading, setHireLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  // Session loading state
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionLoadingMessage, setSessionLoadingMessage] = useState("");

  const hasHired = user?.associatedReceptionistId && user?.associationStatus === "active";
  const hasPendingSent = user?.associatedReceptionistId && user?.associationStatus === "pending";

  const fetchIncomingRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/auth/association-requests`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAction = async (receptionistId, action) => {
    try {
      setActionLoading({ id: receptionistId, action });
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/auth/handle-association-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: receptionistId, action }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        authDispatch({ type: "LOGIN", payload: { user: data.user } });
        // Remove the request from the list regardless of accept or reject
        setRequests((prev) => prev.filter((r) => r._id !== receptionistId && r.id !== receptionistId));
      } else {
        throw new Error(data.message || "Action failed");
      }
      return data;
    } catch (err) {
      console.error("Error handling action:", err);
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (searchQuery.trim().length < 3) {
      setSearchError("Please enter at least 3 characters");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      const targetRole = user?.role === "doctor" ? "receptionist" : "doctor";
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/auth/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: searchQuery.trim(), role: targetRole }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.message || "Search failed");
        return;
      }
      if (data.success) {
        setSearchResults(data.users);
        if (data.users.length === 0) {
          setSearchError("No available receptionists found");
        }
      }
    } catch (err) {
      setSearchError("Search failed");
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendRequest = async (receptionistId) => {
    try {
      setHireLoading(true);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/auth/request-association`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: receptionistId }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        authDispatch({ type: "LOGIN", payload: { user: data.user } });
        setSearchQuery("");
        setSearchResults([]);
      } else {
        throw new Error(data.message || "Failed to send request");
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setHireLoading(false);
    }
  };

  const cancelSentRequest = async () => {
    try {
      setIsCancelling(true);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/auth/cancel-association-request`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        authDispatch({ type: "LOGIN", payload: { user: data.user } });
      } else {
        throw new Error(data.message || "Failed to cancel request");
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsCancelling(false);
    }
  };

  const removeReceptionist = async () => {
    try {
      setRemoveLoading(true);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/auth/remove-association`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        authDispatch({ type: "LOGIN", payload: { user: data.user } });
      } else {
        throw new Error(data.message || "Failed to remove receptionist");
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setRemoveLoading(false);
    }
  };

  const goLive = async () => {
    try {
      setSessionLoading(true);
      setSessionLoadingMessage("Starting your live session...");
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/session/start`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        sessionDispatch({
          type: "SET_SESSION",
          payload: { session: data.session, queue: data.queue },
        });
        navigate("/doctor/live-session");
      } else {
        alert(data.message || "Failed to start session");
      }
    } catch (err) {
      console.error("Error starting session:", err);
      alert("Error starting session. Please try again.");
    } finally {
      setSessionLoading(false);
      setSessionLoadingMessage("");
    }
  };

  const callNextPatient = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/doctor/call-next`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        sessionDispatch({
          type: "UPDATE_QUEUE",
          payload: { queue: data.queue },
        });
      } else {
        alert(data.message || "Failed to call next patient");
      }
    } catch (err) {
      console.error(err);
      alert("Error calling next patient.");
    }
  };

  const skipCurrentPatient = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/doctor/skip-patient`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        sessionDispatch({
          type: "UPDATE_QUEUE",
          payload: { queue: data.queue },
        });
      } else {
        alert(data.message || "Failed to skip patient");
      }
    } catch (err) {
      console.error(err);
      alert("Error skipping patient.");
    }
  };

  const completeCurrentPatient = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/doctor/complete-patient`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        sessionDispatch({
          type: "UPDATE_QUEUE",
          payload: { queue: data.queue },
        });
      } else {
        alert(data.message || "Failed to complete patient");
      }
    } catch (err) {
      console.error(err);
      alert("Error completing patient.");
    }
  };

  const endSession = async () => {
    try {
      setSessionLoading(true);
      setSessionLoadingMessage("Ending your session. Please wait...");
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/session/end`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        sessionDispatch({ type: "CLEAR_SESSION" });
        navigate("/doctor/dashboard");
      } else {
        alert(data.message || "Failed to end session");
      }
    } catch (err) {
      console.error(err);
      alert("Error ending session.");
    } finally {
      setSessionLoading(false);
      setSessionLoadingMessage("");
    }
  };

  return {
    isPopoverOpen,
    setIsPopoverOpen,
    user,
    hasHired,
    hasPendingSent,
    requests,
    loading,
    actionLoading,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    searchLoading,
    searchError,
    setSearchError,
    isCancelling,
    hireLoading,
    removeLoading,
    sessionLoading,
    sessionLoadingMessage,
    fetchIncomingRequests,
    handleAction,
    handleSearch,
    sendRequest,
    cancelSentRequest,
    removeReceptionist,
    goLive,
    callNextPatient,
    skipCurrentPatient,
    completeCurrentPatient,
    endSession,
  };
};
