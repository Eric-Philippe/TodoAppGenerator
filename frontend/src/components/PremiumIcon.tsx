import React from 'react';

interface PremiumIconProps {
  premiumLevel: number;
  size?: number;
}

const PremiumIcon: React.FC<PremiumIconProps> = ({ premiumLevel, size = 16 }) => {
  const getIcon = () => {
    switch (premiumLevel) {
      case 0:
        return '⚪'; // Gratuit - cercle blanc
      case 1:
        return '🟡'; // Premium - cercle jaune
      case 2:
        return '🟣'; // Premium+ - cercle violet
      default:
        return '⚪';
    }
  };

  return (
    <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>
      {getIcon()}
    </span>
  );
};

export default PremiumIcon;