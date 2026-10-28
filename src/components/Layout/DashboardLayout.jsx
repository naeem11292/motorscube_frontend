import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./DashboardLayout.css";

const navigationGroups = [
  {
    title: "MAIN MENU",
    items: [
      { label: "Dashboard", icon: "⌂", path: "/dashboard" },
      { label: "Messages", icon: "💬", path: "/dashboard/messages" },
      { label: "My Profile", icon: "👤", path: "/dashboard/profile" },
    ],
  },
  {
    title: "SELL & RENT",
    items: [
      { label: "Add Sale", icon: "🚗", path: "/dashboard/add-sale" },
      { label: "Add Hire", icon: "🔑", path: "/dashboard/add-hire" },
      {
        label: "Accessories",
        icon: "⚙",
        path: "/dashboard/ad-accessories",
      },
    ],
  },
  {
    title: "BUSINESS SERVICES",
    items: [
      {
        label: "Business Services",
        icon: "▦",
        path: "/dashboard/business-services",
      },
      { label: "Dealership", icon: "🏢", path: "/dashboard/dealership" },
      { label: "Stores", icon: "▤", path: "/dashboard/stores" },
    ],
  },
];

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="mc-dashboard">
      {/* Mobile header */}
      <header className="mc-mobile-header">
        <button
          type="button"
          className="mc-menu-toggle"
          onClick={() => setSidebarOpen((previous) => !previous)}
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>

        <NavLink to="/dashboard" className="mc-mobile-brand">
          Motors<span>Cube</span>
        </NavLink>

        <button
          type="button"
          className="mc-mobile-profile"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          👤
        </button>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="mc-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`mc-sidebar ${sidebarOpen ? "mc-sidebar-open" : ""}`}
      >
        <NavLink
          to="/dashboard"
          className="mc-brand"
          onClick={closeSidebar}
        >
          <span className="mc-brand-icon">M</span>
          <span className="mc-brand-text">
            Motors<span>Cube</span>
          </span>
        </NavLink>

        <div className="mc-sidebar-user">
          <div className="mc-user-avatar">👤</div>

          <div className="mc-user-info">
            <strong>My Account</strong>
            <span>MotorsCube User</span>
          </div>
        </div>

        <nav
          className="mc-sidebar-navigation"
          aria-label="Dashboard navigation"
        >
          {navigationGroups.map((group) => (
            <section className="mc-nav-group" key={group.title}>
              <h2 className="mc-nav-heading">{group.title}</h2>

              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `mc-nav-link ${isActive ? "mc-nav-link-active" : ""}`
                  }
                >
                  <span className="mc-nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                  {item.label === "Dashboard" && (
                    <span className="mc-nav-arrow">›</span>
                  )}
                </NavLink>
              ))}
            </section>
          ))}
        </nav>

        <div className="mc-sidebar-bottom">
          <div className="mc-sidebar-promo">
            <div className="mc-promo-icon">🚘</div>
            <strong>Ready for your next ride?</strong>
            <p>
              Explore MotorsCube and discover more opportunities.
            </p>

            <NavLink
              to="/dashboard/add-sale"
              onClick={closeSidebar}
            >
              Post an Ad <span>→</span>
            </NavLink>
          </div>

          <button
            type="button"
            className="mc-logout-button"
            onClick={handleLogout}
          >
            <span aria-hidden="true">⇥</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="mc-dashboard-main">
        <div className="mc-dashboard-topbar">
          <div className="mc-breadcrumb">
            <span>MotorsCube</span>
            <span className="mc-breadcrumb-separator">/</span>
            <strong>My Dashboard</strong>
          </div>

          <div className="mc-topbar-actions">
            <span className="mc-topbar-status">
              <span className="mc-status-dot" />
              User Account
            </span>

            <button
              type="button"
              className="mc-topbar-logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>

        <main className="mc-dashboard-content">{children}</main>

        <footer className="mc-dashboard-footer">
          <span>© {new Date().getFullYear()} MotorsCube</span>
          <span>Your automotive marketplace</span>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;