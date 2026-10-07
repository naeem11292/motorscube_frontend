import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${menuOpen ? "open" : ""}`}>
      <Link
        to="/dashboard"
        className="navbar-logo"
        aria-label="MotorsCube home"
        onClick={closeMenu}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M4 32 L4 10 L14 22 L24 6"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 32 L14 24 L24 34 L36 8"
            fill="none"
            stroke="#e63946"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span>
          Motors<span>Cube</span>
        </span>
      </Link>

      <button
        type="button"
        className="navbar-burger"
        aria-label="Menu"
        onClick={() => setMenuOpen((previous) => !previous)}
      >
        <svg viewBox="0 0 24 24">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <nav className="navbar-category" aria-label="Vehicle categories">
        <Link to="/dashboard" className="active" onClick={closeMenu}>
          <svg viewBox="0 0 24 24">
            <path d="M3 16v-4l2-5h14l2 5v4M3 16h18M3 16v2h3v-2M21 16v2h-3v-2M6 12h12" />
          </svg>
          Cars
        </Link>

        <Link to="#" onClick={closeMenu}>
          <svg viewBox="0 0 24 24">
            <circle cx="5.5" cy="16" r="3" />
            <circle cx="18.5" cy="16" r="3" />
            <path d="M5.5 16l4-7h5l4 7M9.5 9H8M14 9l-2 7" />
          </svg>
          Bikes
        </Link>

        <Link to="#" onClick={closeMenu}>
          <svg viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="12" rx="2" />
            <path d="M3 11h18M7 17v2M17 17v2" />
          </svg>
          Buses
        </Link>

        <Link to="#" onClick={closeMenu}>
          <svg viewBox="0 0 24 24">
            <path d="M3 18h14M5 18v-5h8v5M13 13l5-7 3 2M8 13V9h4" />
            <circle cx="7" cy="18" r="1" />
            <circle cx="14" cy="18" r="1" />
          </svg>
          Machinery
        </Link>

        <Link to="#" onClick={closeMenu}>
          <svg viewBox="0 0 24 24">
            <path d="M3 20V9l6 4V9l6 4V5h4v15zM8 20v-3M13 20v-3" />
          </svg>
          Industrial Plants
        </Link>
      </nav>

      <nav className="navbar-links" aria-label="Main">
        <Link
          to="/dashboard"
          className="active"
          onClick={closeMenu}
        >
          Buying
        </Link>

        <Link
          to="/dashboard/add-sale"
          onClick={closeMenu}
        >
          Selling
        </Link>

        <Link to="#" onClick={closeMenu}>
          Hire
        </Link>

        <Link to="#" onClick={closeMenu}>
          Car Owners
        </Link>

        <Link to="#" onClick={closeMenu}>
          Parts & Accessories
        </Link>

        <Link
          to="/dashboard/add-sale"
          onClick={closeMenu}
        >
          Post Ad
        </Link>
      </nav>

      <button
        type="button"
        className="navbar-login"
        aria-label="Log out"
        onClick={handleLogout}
      >
        <svg viewBox="0 0 24 24">
          <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
        </svg>
      </button>
    </header>
  );
}

export default Navbar;