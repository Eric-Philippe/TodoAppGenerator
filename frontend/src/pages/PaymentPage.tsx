import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';
import { processPayment, getPlanLevelFromId } from '../services/paymentService';
import PremiumIcon from '../components/PremiumIcon';
import './PaymentPage.css';

const PaymentPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { updatePremiumLevel } = usePremium();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const planDetails = {
    premium: {
      name: 'Premium',
      level: 1,
      price: '9€',
      period: 'mois',
      amount: '9.00'
    },
    'premium-plus': {
      name: 'Premium+',
      level: 2,
      price: '19€',
      period: 'mois',
      amount: '19.00'
    }
  };

  const plan = planDetails[planId as keyof typeof planDetails];

  if (!plan) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-message">
            <h2>❌ Plan non trouvé</h2>
            <p>Le plan demandé n'existe pas.</p>
            <button onClick={() => navigate('/upgrade')} className="back-button">
              ← Retour aux plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // 1. Traitement du paiement
      const paymentResult = await processPayment({
        planId: planId!,
        amount: plan.amount,
        currency: 'EUR'
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Erreur lors du paiement');
      }

      // 2. Mise à jour du niveau premium si le paiement réussit
      const newPremiumLevel = getPlanLevelFromId(planId!);
      const updateSuccess = await updatePremiumLevel(newPremiumLevel);

      if (!updateSuccess) {
        throw new Error('Erreur lors de la mise à jour de votre abonnement');
      }

      // 3. Succès
      setPaymentStatus('success');
      
      // Redirection après 3 secondes
      setTimeout(() => {
        navigate('/generator', { 
          state: { 
            message: `Félicitations ! Vous êtes maintenant abonné au plan ${plan.name} 🎉`,
            type: 'success'
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="payment-status processing">
            <div className="spinner"></div>
            <h3>⏳ Traitement en cours...</h3>
            <p>Veuillez patienter pendant que nous traitons votre paiement.</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="payment-status success">
            <h3>✅ Paiement réussi !</h3>
            <p>Votre abonnement {plan.name} est maintenant actif.</p>
            <p>Redirection vers le générateur...</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="payment-status error">
            <h3>❌ Erreur de paiement</h3>
            <p>{errorMessage}</p>
            <button 
              className="retry-button" 
              onClick={() => {
                setPaymentStatus('idle');
                setErrorMessage('');
              }}
            >
              🔄 Réessayer
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (paymentStatus !== 'idle') {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-header">
            <h1>Paiement</h1>
            <div className="selected-plan">
              <PremiumIcon premiumLevel={plan.level} size={24} />
              <span>Plan {plan.name}</span>
            </div>
          </div>
          {renderPaymentStatus()}
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Finaliser votre commande</h1>
          <div className="selected-plan">
            <PremiumIcon premiumLevel={plan.level} size={24} />
            <span>Plan {plan.name}</span>
          </div>
        </div>

        <div className="payment-content">
          <div className="payment-summary">
            <h3>📋 Récapitulatif</h3>
            <div className="summary-line">
              <span>Plan {plan.name}</span>
              <span>{plan.price}/{plan.period}</span>
            </div>
            <div className="summary-line">
              <span>TVA (20%)</span>
              <span>Incluse</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>{plan.price}</span>
            </div>
          </div>

          <div className="payment-form">
            <h3>💳 Informations de paiement</h3>
            <div className="payment-notice">
              <strong>⚠️ Mode Démonstration</strong>
              <p>Ceci est une simulation de paiement. Aucun vrai paiement ne sera effectué. 
                 Cliquez sur "Payer" pour simuler un paiement réussi et activer votre abonnement.</p>
            </div>
            
            <form className="payment-fields" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>💳 Numéro de carte</label>
                <input 
                  type="text" 
                  placeholder="4242 4242 4242 4242"
                  defaultValue="4242 4242 4242 4242"
                  disabled
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>📅 Expiration</label>
                  <input 
                    type="text" 
                    placeholder="12/25"
                    defaultValue="12/25"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>🔒 CVV</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    defaultValue="123"
                    disabled
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>👤 Nom sur la carte</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  defaultValue="John Doe"
                  disabled
                />
              </div>
            </form>

            <button 
              className="payment-button"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Traitement...' : `💳 Payer ${plan.price}`}
            </button>
          </div>
        </div>

        <button className="back-button" onClick={() => navigate('/upgrade')}>
          ← Retour aux plans
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;