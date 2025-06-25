import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePremium } from '../contexts/PremiumContext';
import PremiumIcon from './PremiumIcon';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userPremium, loading } = usePremium(); // Ajouter loading ici

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

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo et titre */}
        <div className="header-brand" onClick={() => handleNavigation('/generator')}>
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">TodoApp Generator</span>
          </div>
          <p className="header-subtitle">Générez votre application TodoList complète</p>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <button 
            className={`nav-button ${isActive('/generator') || isActive('/') ? 'active' : ''}`}
            onClick={() => handleNavigation('/generator')}
          >
            <span className="nav-icon">⚙️</span>
            Générateur
          </button>

          <button 
            className={`nav-button ${isActive('/upgrade') ? 'active' : ''}`}
            onClick={() => handleNavigation('/upgrade')}
          >
            <span className="nav-icon">⬆️</span>
            Plans & Tarifs
          </button>

          <button 
            className={`nav-button ${isActive('/login') ? 'active' : ''}`}
            onClick={() => handleNavigation('/login')}
          >
            <span className="nav-icon">👤</span>
            Connexion
          </button>
        </nav>

        {/* Statut Premium */}
        <div className="header-premium">
          <div className={`premium-badge ${loading ? 'loading' : ''}`}>
            {loading ? (
              <>
                <div className="premium-spinner"></div>
                <span className="premium-level">Chargement...</span>
              </>
            ) : (
              <>
                <PremiumIcon premiumLevel={userPremium.premiumLevel} size={18} />
                <span className="premium-level">
                  {getPremiumLevelText()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;