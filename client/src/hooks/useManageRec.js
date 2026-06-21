import { useState, useCallback } from "react";
import { useAuth } from "../context/auth/AuthContext";

export const useManageRec = () => {
  const { user, dispatch } = useAuth();
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

  const hasHired = user?.associatedReceptionistId && user?.associationStatus === "active";
  const hasPendingSent = user?.associatedReceptionistId && user?.associationStatus === "pending";

  const fetchIncomingRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/association-requests", {
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
      setActionLoading(receptionistId);
      const res = await fetch("/api/auth/handle-association-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: receptionistId, action }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch({ type: "LOGIN", payload: { user: data.user } });
        if (action === "reject") {
          setRequests((prev) => prev.filter((r) => r._id !== receptionistId && r.id !== receptionistId));
        }
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
      const res = await fetch("/api/auth/search", {
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
      const res = await fetch("/api/auth/request-association", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: receptionistId }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch({ type: "LOGIN", payload: { user: data.user } });
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
      const res = await fetch("/api/auth/cancel-association-request", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch({ type: "LOGIN", payload: { user: data.user } });
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
      const res = await fetch("/api/auth/remove-association", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch({ type: "LOGIN", payload: { user: data.user } });
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
    fetchIncomingRequests,
    handleAction,
    handleSearch,
    sendRequest,
    cancelSentRequest,
    removeReceptionist
  };
};
