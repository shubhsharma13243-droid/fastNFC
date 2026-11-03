import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./api";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PublicPage from "./pages/PublicPage.jsx";

const Private = ({ children }) => (getToken() ? children : <Navigate to="/login" replace />);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/signup" element={<Auth mode="signup" />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/b/:slug" element={<PublicPage />} />
      <Route path="*" element={<p className="center">This page does not exist.</p>} />
    </Routes>
  );
}
