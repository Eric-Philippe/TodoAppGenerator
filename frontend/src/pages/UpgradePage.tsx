import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';
import PremiumIcon from '../components/PremiumIcon';
import './UpgradePage.css';

interface PricingTier {
  id: string;
  name: string;
  level: number;
  price: string;
  period: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
  isCurrentPlan?: boolean;
}

const UpgradePage: React.FC = () => {
  const navigate = useNavigate();
  const { userPremium, updatePremiumLevel } = usePremium();
  const [isProcessing, setIsProcessing] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Gratuit',
      level: 0,
      price: '0€',
      period: 'toujours',
      description: 'Parfait pour débuter',
      features: [
        'Backend : Node.js uniquement',
        'Frontend : Templates serveur (MVP)',
        'Base de données : SQLite',
        'Architecture : MVC basique',
        'Styling : Choix limité (Tailwind, Bootstrap)',
        
        'Documentation API basique',
        'Support communautaire'
      ],
      isCurrentPlan: userPremium.premiumLevel === 0
    },
    {
      id: 'premium',
      name: 'Premium',
      level: 1,
      price: '9€',
      period: 'par mois',
      description: 'Pour les développeurs sérieux',
      features: [
        '✨ Tous les langages backend',
        '✨ Tous les frameworks frontend',
        '✨ Architectures avancées',
        '✨ Tests unitaires inclus',
        '✨ Authentification JWT intégrée',
        '✨ Templates personnalisables',
        '✨ Intégrations API tierces',
        '✨ Export en ZIP',
      
        '+ Toutes les fonctionnalités gratuites'
      ],
      isRecommended: userPremium.premiumLevel === 0,
      isCurrentPlan: userPremium.premiumLevel === 1
    },
    {
      id: 'premium-plus',
      name: 'Premium+',
      level: 2,
      price: '19€',
      period: 'par mois',
      description: 'Solution complète pour les équipes',
      features: [
        '🚀 Toutes les bases de données',
        '🚀 Docker Compose complet',
        '🚀 CI/CD GitHub Actions',
        '🚀 Architecture microservices',
        '🚀 Monitoring intégré',
        '🚀 Tests E2E automatisés',
        '🚀 Déploiement cloud facilité',
       
        '🚀 Accès anticipé aux nouvelles fonctionnalités',
        '+ Toutes les fonctionnalités Premium'
      ],
      isRecommended: userPremium.premiumLevel === 1,
      isCurrentPlan: userPremium.premiumLevel === 2
    }
  ];

  const handlePlanChange = async (tierId: string, level: number) => {
    if (level === userPremium.premiumLevel || isProcessing) return;

    console.log(`Changement de plan: ${tierId} (niveau ${level})`);
    console.log(`Niveau actuel: ${userPremium.premiumLevel}`);

    // Si c'est un upgrade (niveau supérieur), aller vers le paiement
    if (level > userPremium.premiumLevel) {
      console.log('Upgrade détecté - redirection vers paiement');
      navigate(`/payment/${tierId}`);
      return;
    }

    // Si c'est un downgrade (niveau inférieur), changer directement
    console.log('Downgrade détecté - changement direct');
    setIsProcessing(true);
    
    try {
      const success = await updatePremiumLevel(level);
      console.log(`Résultat mise à jour: ${success}`);
      
      if (success) {
        const planName = level === 0 ? 'Gratuit' : (level === 1 ? 'Premium' : 'Premium+');
        console.log(`Changement réussi vers: ${planName}`);
        
        navigate('/generator', {
          state: {
            message: `Vous êtes maintenant sur le plan ${planName} 📱`,
            type: 'info'
          }
        });
      } else {
        console.error('Échec de la mise à jour du niveau premium');
        alert('Erreur lors du changement de plan. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du changement de plan:', error);
      alert('Erreur lors du changement de plan. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentPlanMessage = () => {
    switch (userPremium.premiumLevel) {
      case 0:
        return "Vous utilisez actuellement la version gratuite";
      case 1:
        return "Vous avez un abonnement Premium actif";
      case 2:
        return "Vous avez un abonnement Premium+ actif";
      default:
        return "";
    }
  };

  const getButtonText = (tier: PricingTier) => {
    if (tier.isCurrentPlan) return 'Plan actuel';
    if (isProcessing) return 'Traitement...';
    if (tier.level > userPremium.premiumLevel) return 'Choisir ce plan';
    return 'Passer à ce plan';
  };

  const getButtonClass = (tier: PricingTier) => {
    if (tier.isCurrentPlan) return 'current';
    if (isProcessing) return 'processing';
    if (tier.level > userPremium.premiumLevel) return tier.isRecommended ? 'recommended' : '';
    return 'downgrade-available';
  };

  const isButtonDisabled = (tier: PricingTier) => {
    return tier.isCurrentPlan || isProcessing;
  };

  return (
    <div className="upgrade-page">
      <div className="upgrade-container">
        {/* Header */}
        <div className="upgrade-header">
          <h1>Choisissez votre plan</h1>
          <p className="upgrade-subtitle">
            Débloquez tout le potentiel du TodoApp Generator
          </p>
          <div className="current-plan-status">
            <PremiumIcon premiumLevel={userPremium.premiumLevel} size={20} />
            <span>{getCurrentPlanMessage()}</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.id}
              className={`pricing-card ${tier.isRecommended ? 'recommended' : ''} ${tier.isCurrentPlan ? 'current-plan' : ''}`}
            >
              {tier.isRecommended && (
                <div className="recommended-badge">
                  ⭐ Recommandé
                </div>
              )}
              
              {tier.isCurrentPlan && (
                <div className="current-plan-badge">
                  ✅ Plan actuel
                </div>
              )}

              <div className="pricing-header">
                <div className="plan-icon">
                  {tier.level === 0 ? (
                    <span className="free-icon">🆓</span>
                  ) : (
                    <PremiumIcon premiumLevel={tier.level} size={32} />
                  )}
                </div>
                <h3 className="plan-name">{tier.name}</h3>
                <p className="plan-description">{tier.description}</p>
                <div className="plan-price">
                  <span className="price">{tier.price}</span>
                  <span className="period">/ {tier.period}</span>
                </div>
              </div>

              <div className="features-list">
                {tier.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-check">
                      {feature.startsWith('✨') || feature.startsWith('🚀') ? '' : '✓'}
                    </span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pricing-footer">
                <button 
                  className={`plan-button ${getButtonClass(tier)}`}
                  onClick={() => handlePlanChange(tier.id, tier.level)}
                  disabled={isButtonDisabled(tier)}
                >
                  {getButtonText(tier)}
                </button>
              </div>
            </div>
          ))}
        </div>

      

        {/* Back button */}
        <div className="upgrade-actions">
          <button 
            className="back-button" 
            onClick={() => navigate('/generator')}
            disabled={isProcessing}
          >
            ← Retour au générateur
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;