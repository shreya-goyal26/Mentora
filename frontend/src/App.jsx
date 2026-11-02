import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import NewSession from "./pages/NewSession";
import CoachingConsole from "./pages/CoachingConsole";
import SessionHistory from "./pages/SessionHistory";
import SessionReport from "./pages/SessionReport";

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new-session" element={<NewSession />} />
            <Route path="session/:sessionId" element={<CoachingConsole />} />
            <Route path="session/:sessionId/report" element={<SessionReport />} />
            <Route path="sessions" element={<SessionHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}
