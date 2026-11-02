import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, History, Sparkles } from "lucide-react";

export default function Sidebar() {
  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/new-session",
      label: "New Session",
      icon: PlusCircle,
    },
    {
      to: "/sessions",
      label: "Session History",
      icon: History,
    },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <Sparkles size={18} className="brand-icon" />
        <span className="brand-text">Coaching Hub</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <Icon size={18} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-card">
          <p className="footer-title">Multi-Agent AI</p>
          <p className="footer-sub">
            Real-time intent, sentiment, knowledge RAG & escalation monitoring.
          </p>
        </div>
      </div>
    </aside>
  );
}
