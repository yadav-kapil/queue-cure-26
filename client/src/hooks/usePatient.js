import { useState, useCallback } from "react";
import { io } from "socket.io-client";
import { registerPatientSocketHandlers } from "../services/patientSocketHandlers";

export const usePatient = (trackingId) => {
  const [patient, setPatient] = useState(null);
  const [session, setSession] = useState(null);
  const [queue, setQueue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionFound, setIsSessionFound] = useState(true);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [socket, setSocket] = useState(null);

  const fetchPatientSession = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/patient/track/${trackingId}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsSessionFound(false);
        setIsLoading(false);
        return false;
      }

      setPatient(data.patient);
      setSession(data.session);
      setQueue(data.queue);
      setIsSessionFound(true);
      if (data.session && data.session.status === "ended") {
        setIsSessionEnded(true);
        setIsSessionCompleted(false);
      } else if (data.patient && data.patient.consultationEndedAt) {
        setIsSessionCompleted(true);
        setIsSessionEnded(false);
      } else if (data.queue && data.patient && data.queue.currentToken > data.patient.tokenNumber) {
        setIsSessionEnded(true);
        setIsSessionCompleted(false);
      } else {
        setIsSessionEnded(false);
        setIsSessionCompleted(false);
      }
      setIsLoading(false);
      return data;
    } catch (err) {
      console.error("Failed to fetch patient session", err);
      setIsSessionFound(false);
      setIsLoading(false);
      return false;
    }
  }, [trackingId]);

  const connectSocket = useCallback(
    (sessionId) => {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3003", {
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        newSocket.emit("join-session", { sessionId });
      });

      const cleanup = registerPatientSocketHandlers(
        newSocket,
        fetchPatientSession,
        setIsSessionEnded
      );

      setSocket(newSocket);

      return () => {
        cleanup();
        newSocket.disconnect();
      };
    },
    [fetchPatientSession]
  );

  return {
    patient,
    session,
    queue,
    isLoading,
    setIsLoading,
    isSessionFound,
    isSessionEnded,
    isSessionCompleted,
    fetchPatientSession,
    connectSocket,
    socket,
  };
};
