import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface UserPremium {
  premiumLevel: number;
}

interface PremiumContextType {
  userPremium: UserPremium;
  loading: boolean;
  canAccess: (requiredLevel: number) => boolean;
  isFree: boolean;
  isPremium: boolean;
  isPremiumPlus: boolean;
  updatePremiumLevel: (newLevel: number) => Promise<boolean>;
  refreshPremiumLevel: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider: React.FC<PremiumProviderProps> = ({
  children,
}) => {
  const [userPremium, setUserPremium] = useState<UserPremium>({
    premiumLevel: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPremiumLevel();
  }, []);

  const fetchPremiumLevel = async () => {
    try {
      console.log("Récupération du niveau premium...");

      // Pour l'instant, récupération depuis localStorage pour la démo
      const storedLevel = localStorage.getItem("userPremiumLevel");
      const premiumLevel = storedLevel ? parseInt(storedLevel) : 0;
      console.log(`Niveau premium récupéré: ${premiumLevel}`);

      setUserPremium({ premiumLevel });
    } catch (error) {
      console.error("Erreur lors de la récupération du niveau premium:", error);
      setUserPremium({ premiumLevel: 0 });
    } finally {
      setLoading(false);
    }
  };

  const updatePremiumLevel = async (newLevel: number): Promise<boolean> => {
    try {
      console.log(`Mise à jour du niveau premium vers: ${newLevel}`);
      setLoading(true);

      // Simulation d'un appel API réussi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mise à jour locale (temporaire pour la démo)
      localStorage.setItem("userPremiumLevel", newLevel.toString());
      console.log(`Niveau premium sauvegardé en localStorage: ${newLevel}`);

      // Mise à jour de l'état IMMÉDIATEMENT
      setUserPremium({ premiumLevel: newLevel });
      console.log(`État userPremium mis à jour: ${newLevel}`);

      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du niveau premium:", error);
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

  const value: PremiumContextType = {
    userPremium,
    loading,
    canAccess,
    isFree,
    isPremium,
    isPremiumPlus,
    updatePremiumLevel,
    refreshPremiumLevel: fetchPremiumLevel,
  };

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
};
