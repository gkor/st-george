const Redis = require('ioredis');
const axios = require('axios');
const redis = new Redis({
  port: 10536,
  host: "redis-10536.c1.us-central1-2.gce.redns.redis-cloud.com",
  username: "default",
  password: "8Vc92Hr9ksk6CkKpBz2NVDzkIQOaar5X",
  db: 0,
});

// let pizzaTimes = {
//   '400': 4,
//   '430': 4,
//   '500': 4,
//   '530': 4,
//   '600': 4,
//   '630': 4,
//   '700': 4,
//   '730': 4
// };


// redis.set("availability", JSON.stringify(pizzaTimes)).catch((err) => {
// });

const express = require('express');
const app = express();
const { resolve } = require('path');
// Copy the .env.example in the root into a .env file in this folder
require('dotenv').config({ path: './.env' });

// Ensure environment variables are set.
checkEnv();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: { // For sample support and debugging, not required for production:
    name: "stripe-samples/checkout-one-time-payments",
    version: "0.0.1",
    url: "https://github.com/stripe-samples/checkout-one-time-payments"
  }
});

app.use(express.static(process.env.STATIC_DIR));
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.get("/data.js", async (req, res) => {
  const availability = await redis.get("availability").catch((err) => {
    if (err) console.error(err)
  });

res.send(`window.SERVER_DATA={"availability":${availability}}`);
});

app.get('/', (req, res) => {
  const path = resolve(process.env.STATIC_DIR + '/index.html');
  console.log("root route");
  res.sendFile(path);
});

app.get('/config', async (req, res) => {
  const price = await stripe.prices.retrieve(process.env.CHEESE_PRICE);

  res.send({
    publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
    unitAmount: price.unit_amount,
    currency: price.currency,
  });
});

// Fetch the Checkout Session to display the JSON result on the success page
app.get('/checkout-session', async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  let time = session.metadata.time;

  let availability = await redis.get("availability").catch((err) => {
    if (err) console.error(err)
  });

  availability = JSON.parse(availability);
  let currentCapacity = availability[time];

  availability[time] = currentCapacity - (parseInt(session.metadata.cheese) + parseInt(session.metadata.pepperoni) + parseInt(session.metadata.special));

  redis.set("availability", JSON.stringify(availability)).catch((err) => {});

  res.send(session);
});

app.post('/create-checkout-session', async (req, res) => {
  const domainURL = process.env.DOMAIN;

  console.log(req.body);

  let cheeseQuantity = req.body.cheese;
  let pepperoniQuantity = req.body.pepperoni;
  let specialQuantity = req.body.special;
  let order = [];

  if (cheeseQuantity > 0) {
    order.push({ price: process.env.CHEESE_PRICE, quantity: cheeseQuantity });
  }

  if (pepperoniQuantity > 0) {
    order.push({ price: process.env.PEPPERONI_PRICE, quantity: pepperoniQuantity });
  }

  if (specialQuantity > 0) {
    order.push({ price: process.env.SPECIAL_PRICE, quantity: specialQuantity });
  }

  // Race condition check, ensure the times are still available





  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the Checkout page
  // [automatic_tax] - to automatically calculate sales tax, VAT and GST in the checkout page
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: order,
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`,
    metadata: req.body,
    // automatic_tax: {enabled: true},
  });

  return res.redirect(303, session.url);
});

// Webhook handler for asynchronous events.
app.post('/webhook', async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === 'checkout.session.completed') {
    console.log(`🔔  Payment received!`);
  }

  res.sendStatus(200);
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));


function checkEnv() {
  const price = process.env.CHEESE_PRICE;
  if (price === "price_12345" || !price) {
    console.log("You must set a Price ID in the environment variables. Please see the README.");
    process.exit(0);
  }
}
