import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe("TA_CLE_SECRETE_STRIPE_ICI");

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body.items;

  const lineItems = items.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name
      },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: item.qty
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "https://zijib2.github.io/nonschoolstream/success.html",
    cancel_url: "https://zijib2.github.io/nonschoolstream/cancel.html"
  });

  res.json({ url: session.url });
});

app.listen(3000, () => console.log("Server running"));
