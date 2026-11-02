import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkBackendStatus, getSessions } from "../services/sessionService";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    message: "Connecting to FastAPI backend...",
    lastChecked: null,
    loading: true,
  });
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const verifyBackend = useCallback(async () => {
    setBackendStatus((prev) => ({ ...prev, loading: true }));
    try {
      const data = await checkBackendStatus();
      setBackendStatus({
        connected: true,
        message: data.message || "Connected to FastAPI Backend",
        lastChecked: new Date(),
        loading: false,
      });
      return true;
    } catch {
      setBackendStatus({
        connected: false,
        message: "Backend connection failed! Ensure uvicorn is running on port 8000.",
        lastChecked: new Date(),
        loading: false,
      });
      return false;
    }
  }, []);

  const refreshSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await getSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const data = await checkBackendStatus();
        if (!mounted) return;
        setBackendStatus({
          connected: true,
          message: data.message || "Connected to FastAPI Backend",
          lastChecked: new Date(),
          loading: false,
        });

        const sess = await getSessions();
        if (!mounted) return;
        setSessions(Array.isArray(sess) ? sess : []);
      } catch {
        if (!mounted) return;
        setBackendStatus({
          connected: false,
          message: "Backend connection failed! Ensure uvicorn is running on port 8000.",
          lastChecked: new Date(),
          loading: false,
        });
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        backendStatus,
        verifyBackend,
        sessions,
        sessionsLoading,
        refreshSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSessionContext() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return ctx;
}
