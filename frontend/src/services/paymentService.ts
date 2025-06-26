export interface PaymentData {
  planId: string;
  amount: string;
  currency: string;
  userId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const processPayment = async (
  paymentData: PaymentData
): Promise<PaymentResult> => {
  try {
    console.log("Données de paiement:", paymentData);

    // TODO: Remplacer par l'intégration réelle (Stripe, PayPal, etc.)
    // const response = await fetch('/api/payment/process', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${userToken}`
    //   },
    //   body: JSON.stringify(paymentData)
    // });

    // const result = await response.json();

    // if (!response.ok) {
    //   throw new Error(result.message || 'Erreur lors du paiement');
    // }

    // Simulation d'un paiement réussi
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulation d'un ID de transaction
    const transactionId = `tx_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      success: true,
      transactionId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
};

export const getPlanLevelFromId = (planId: string): number => {
  switch (planId) {
    case "premium":
      return 1;
    case "premium-plus":
      return 2;
    default:
      return 0;
  }
};
