import stripe from "stripe";

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await client.charges.create(
      {
        amount, // Amount intended to be collected (in the smallest currency unit, $1.00 => 100)
        currency: "usd",
        source, // Payment source to be charged (tenant)
        application_fee_amount: Math.round(amount * 0.05), // 5% app fee (rounded to the nearest integer)
      },
      {
        stripe_account: stripeAccount, // Account that is going to receive the payment (host)
      }
    );

    if (res.status !== "succeeded") {
      throw new Error("failed to create charge with Stripe");
    }
  },
};
