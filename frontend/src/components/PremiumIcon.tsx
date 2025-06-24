import React from 'react';
import './PremiumIcon.css';

interface PremiumIconProps {
  premiumLevel: number; // 0 = Free, 1 = Premium, 2 = Premium+
  size?: number;
  className?: string;
}

const PremiumIcon: React.FC<PremiumIconProps> = ({ 
  premiumLevel, 
  size = 20, 
  className = '' 
}) => {
  if (premiumLevel === 0) return null;
  
  return (
    <div className={`premium-icon ${className}`} style={{ fontSize: `${size}px` }}>
      {premiumLevel === 1 ? (
        <span className="premium-diamond">💎</span>
      ) : (
        <div className="premium-plus">
          <span className="premium-diamond">💎</span>
          <span className="plus-sign">+</span>
        </div>
      )}
    </div>
  );
};

export default PremiumIcon;