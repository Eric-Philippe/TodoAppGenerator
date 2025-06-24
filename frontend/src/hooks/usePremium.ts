import { useState, useEffect } from 'react';

export interface UserPremium {
  premiumLevel: number; // 0 = Free, 1 = Premium, 2 = Premium+
}

export const usePremium = () => {
  const [userPremium, setUserPremium] = useState<UserPremium>({ premiumLevel: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPremiumLevel();
  }, []);

  const fetchPremiumLevel = async () => {
    try {
      console.log('Récupération du niveau premium...');
      // TODO: Implémenter la logique de récupération depuis la BD
      // const response = await fetch('/api/user/premium-level');
      // const data = await response.json();
      
      // Pour l'instant, récupération depuis localStorage pour la démo
      const storedLevel = localStorage.getItem('userPremiumLevel');
      const premiumLevel = storedLevel ? parseInt(storedLevel) : 0;
      console.log(`Niveau premium récupéré: ${premiumLevel}`);
      
      setUserPremium({ premiumLevel });
    } catch (error) {
      console.error('Erreur lors de la récupération du niveau premium:', error);
      setUserPremium({ premiumLevel: 0 });
    } finally {
      setLoading(false);
    }
  };

  const updatePremiumLevel = async (newLevel: number): Promise<boolean> => {
    try {
      console.log(`Mise à jour du niveau premium vers: ${newLevel}`);
      setLoading(true);
      
      // TODO: Implémenter l'appel API réel pour mettre à jour en BD
      // const response = await fetch('/api/user/premium-level', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: JSON.stringify({ premiumLevel: newLevel })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Erreur lors de la mise à jour du niveau premium');
      // }
      
      // Simulation d'un appel API réussi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mise à jour locale (temporaire pour la démo)
      localStorage.setItem('userPremiumLevel', newLevel.toString());
      console.log(`Niveau premium sauvegardé en localStorage: ${newLevel}`);
      
      // Mise à jour de l'état IMMÉDIATEMENT
      setUserPremium({ premiumLevel: newLevel });
      console.log(`État userPremium mis à jour: ${newLevel}`);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du niveau premium:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const canAccess = (requiredLevel: number) => {
    return userPremium.premiumLevel >= requiredLevel;
  };

  const isFree = userPremium.premiumLevel === 0;
  const isPremium = userPremium.premiumLevel >= 1;
  const isPremiumPlus = userPremium.premiumLevel === 2;

  return {
    userPremium,
    loading,
    canAccess,
    isFree,
    isPremium,
    isPremiumPlus,
    updatePremiumLevel,
    refreshPremiumLevel: fetchPremiumLevel,
  };
};