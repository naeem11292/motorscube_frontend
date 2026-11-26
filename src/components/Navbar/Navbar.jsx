
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMenu();
  };

  return (
    <header className={`navbar ${menuOpen ? "open" : ""}`}>
      {/* LOGO */}
      <Link
        to="/"
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

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        className="navbar-burger"
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((previous) => !previous)}
      >
        <svg viewBox="0 0 24 24">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* VEHICLE CATEGORIES - TEMPORARILY INACTIVE */}
      <nav className="navbar-category" aria-label="Vehicle categories">
        <Link to="#" onClick={closeMenu}>
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
          Plant
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
          Commercial
        </Link>
      </nav>

      {/* MAIN NAVIGATION - KEEPING ORIGINAL LINKS */}
      <nav className="navbar-links" aria-label="Main">
        <Link to="/" onClick={closeMenu}>
          Buying
        </Link>

        <Link to="/dashboard/add-sale" onClick={closeMenu}>
          Selling
        </Link>

        <Link to="/dashboard/add-hire" onClick={closeMenu}>
          Hire
        </Link>

        <Link to="#" onClick={closeMenu}>
          Car Owners
        </Link>

        <Link to="#" onClick={closeMenu}>
          Parts & Accessories
        </Link>

        <Link to="/dashboard/add-sale" onClick={closeMenu}>
          Post Ad
        </Link>
      </nav>

      {/* REGISTER AND LOGOUT */}
      <div className="navbar-auth">
        <Link
          to="/signup"
          className="navbar-register"
          onClick={closeMenu}
        >
          Register
        </Link>

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
      </div>
    </header>
  );
}

export default Navbar;
