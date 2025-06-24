import React from 'react';
import PremiumIcon from './PremiumIcon';
import './PremiumFeatureBox.css';

interface PremiumFeatureBoxProps {
  children: React.ReactNode;
  requiredPremiumLevel: number;
  userPremiumLevel: number;
  onUpgradeClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const PremiumFeatureBox: React.FC<PremiumFeatureBoxProps> = ({
  children,
  requiredPremiumLevel,
  userPremiumLevel,
  onUpgradeClick,
  disabled = false,
  className = '',
}) => {
  const canAccess = userPremiumLevel >= requiredPremiumLevel;
  const isLocked = !canAccess && !disabled;

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked && onUpgradeClick) {
      // Empêche l'interaction avec les éléments du formulaire
      e.preventDefault();
      e.stopPropagation();
      onUpgradeClick();
    }
  };

  return (
    <div 
      className={`premium-feature-box ${isLocked ? 'locked' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
    >
      {children}
      {isLocked && (
        <div className="premium-overlay">
          <div className="lock-icon">🔒</div>
        </div>
      )}
    </div>
  );
};

export default PremiumFeatureBox;