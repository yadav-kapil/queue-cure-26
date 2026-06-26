import { useState, useCallback } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useSession } from "../context/session/SessionContext";

export const useRec = () => {
  const { user, dispatch: authDispatch } = useAuth();
  const { dispatch: sessionDispatch } = useSession();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionLoadingMessage, setSessionLoadingMessage] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  
  // Action states
  const [isCancelling, setIsCancelling] = useState(false);
  const [hireLoading, setHireLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [addPatientLoading, setAddPatientLoading] = useState(false);

  const hasHired = user?.associatedDoctorId && user?.associationStatus === "active";
  const hasPendingSent = user?.associatedDoctorId && user?.associationStatus === "pending";

  const fetchIncomingRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/association-requests`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch incoming requests");
      }
      setRequests(data.requests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAction = async (doctorId, action) => {
    try {
      setActionLoading({ id: doctorId, action });
      const res = await fetch(`/api/auth/handle-association-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: doctorId, action }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        authDispatch({ type: "LOGIN", payload: { user: data.user } });
        setRequests((prev) => prev.filter((r) => r._id !== doctorId && r.id !== doctorId));
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
      const res = await fetch(`/api/auth/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: searchQuery.trim(), role: "doctor" }),
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
          setSearchError("No available doctors found");
        }
      }
    } catch (err) {
      setSearchError("Search failed");
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendRequest = async (doctorId) => {
    try {
      setHireLoading(true);
      const res = await fetch(`/api/auth/request-association`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: doctorId }),
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
      const res = await fetch(`/api/auth/cancel-association-request`, {
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
      const res = await fetch(`/api/auth/remove-association`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        authDispatch({ type: "LOGIN", payload: { user: data.user } });
        sessionDispatch({ type: "CLEAR_SESSION" });
      } else {
        throw new Error(data.message || "Failed to remove doctor");
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setRemoveLoading(false);
    }
  };

  const leaveSession = async () => {
    try {
      setSessionLoadingMessage("Leaving session. Please wait...");
      setSessionLoading(true);
      const res = await fetch(`/api/rec/leave-session`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        sessionDispatch({ type: "CLEAR_SESSION" });
      } else {
        throw new Error(data.message || "Failed to leave session");
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setSessionLoading(false);
      setSessionLoadingMessage("");
    }
  };

  const addPatientToQueue = async ({ name, mobile, email, age, gender, initialAvgTime, sendMail }) => {
    try {
      setAddPatientLoading(true);
      const res = await fetch(`/api/rec/add-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, email, age, gender, initialAvgTime, sendMail }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add patient to queue");
      }
      sessionDispatch({
        type: "UPDATE_QUEUE",
        payload: { queue: data.queue },
      });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setAddPatientLoading(false);
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
    addPatientLoading,
    sessionLoading,
    sessionLoadingMessage,
    fetchIncomingRequests,
    handleAction,
    handleSearch,
    sendRequest,
    cancelSentRequest,
    removeReceptionist,
    leaveSession,
    addPatientToQueue,
  };
};
