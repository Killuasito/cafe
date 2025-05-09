import { loadStripe } from "@stripe/stripe-js";

// Substitua pela sua chave pública do Stripe
export const stripePromise = loadStripe("sua_chave_publica_stripe");

export const processPayment = async (paymentInfo, amount) => {
  const stripe = await stripePromise;

  try {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: {
        number: paymentInfo.cardNumber,
        exp_month: paymentInfo.expiryDate.split("/")[0],
        exp_year: paymentInfo.expiryDate.split("/")[1],
        cvc: paymentInfo.cvv,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return paymentMethod;
  } catch (error) {
    throw error;
  }
};
