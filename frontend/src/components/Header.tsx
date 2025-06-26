import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePremium } from "../contexts/PremiumContext";
import { useScrollDirection } from "../hooks/useScrollDirection";
import PremiumIcon from "./PremiumIcon";
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userPremium, loading } = usePremium();
  const { isVisible } = useScrollDirection();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getPremiumLevelText = () => {
    switch (userPremium.premiumLevel) {
      case 0:
        return "Gratuit";
      case 1:
        return "Premium";
      case 2:
        return "Premium+";
      default:
        return "Gratuit";
    }
  };

  const getPremiumColor = () => {
    switch (userPremium.premiumLevel) {
      case 0:
        return "#6b7280"; // Gris
      case 1:
        return "#f59e0b"; // Orange
      case 2:
        return "#8b5cf6"; // Violet
      default:
        return "#6b7280";
    }
  };

  return (
    <header
      className={`header ${isVisible ? "header-visible" : "header-hidden"}`}
    >
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo" onClick={() => handleNavigation("/")}>
          <div className="logo-icon">📝</div>
          <div className="logo-content">
            <h1 className="logo-title">TodoApp Generator</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <button
            className={`nav-item ${
              isActive("/") || isActive("/generator") ? "active" : ""
            }`}
            onClick={() => handleNavigation("/")}
          >
            Générateur
          </button>
          <button
            className={`nav-item ${isActive("/upgrade") ? "active" : ""}`}
            onClick={() => handleNavigation("/upgrade")}
          >
            Plans
          </button>
          {localStorage.getItem("token") != null ? (
            <button
              className={`nav-item ${isActive("/profile") ? "active" : ""}`}
              onClick={() => handleNavigation("/profile")}
            >
              Profil
            </button>
          ) : (
            <button
              className={`nav-item ${isActive("/login") ? "active" : ""}`}
              onClick={() => handleNavigation("/login")}
            >
              Connexion
            </button>
          )}
        </nav>

        {/* Status Premium */}
        <div className="header-status">
          {loading ? (
            <div className="status-loading">
              <div className="loading-spinner"></div>
              <span>Chargement...</span>
            </div>
          ) : (
            <div
              className="status-premium"
              style={{ borderColor: getPremiumColor() }}
            >
              <PremiumIcon premiumLevel={userPremium.premiumLevel} size={16} />
              <span
                className="status-text"
                style={{ color: getPremiumColor() }}
              >
                {getPremiumLevelText()}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
