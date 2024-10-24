
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const Stripe = require('stripe');
const OpenAIApi = require('openai');
const nodeCron = require('node-cron');
const axios = require('axios');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

// Firebase admin initialization
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;




const PREMIUM_CONSULT_ASSISTANT_ID = process.env.PREMIMUM_CONSULT_KEY; //english
const RUSSIAN_ASSISTANT_ID = process.env.RUSSIAN_ASSISTANT_ID;

const FRENCH_ASSISTANT_ID = process.env.FRENCH_ASSISTANT_ID;
const GERMAN_ASSISTANT_ID = process.env.GERMAN_ASSISTANT_ID;
const PORTUGUESE_ASSISTANT_ID = process.env.PORTUGUESE_ASSISTANT_ID;
const SPANISH_ASSISTANT_ID = process.env.SPANISH_ASSISTANT_ID;
const HINDI_ASSISTANT_ID = process.env.HINDI_ASSISTANT_ID;
const ARABIC_ASSISTANT_ID = process.env.ARABIC_ASSISTANT_ID;
const CHINESE_ASSISTANT_ID = process.env.CHINESE_ASSISTANT_ID;
const JAPANESE_ASSISTANT_ID = process.env.JAPANESE_ASSISTANT_ID;

const LANGUAGE_ASSISTANT_IDS = {
  en: PREMIUM_CONSULT_ASSISTANT_ID, // English assistant ID
  fr: FRENCH_ASSISTANT_ID, // French assistant ID
  de: GERMAN_ASSISTANT_ID, // German assistant ID
  ru: RUSSIAN_ASSISTANT_ID, // Russian assistant ID
  pt: PORTUGUESE_ASSISTANT_ID, // Portuguese assistant ID
  es: SPANISH_ASSISTANT_ID, // Spanish assistant ID
  hi: HINDI_ASSISTANT_ID, // Hindi assistant ID
  ar: ARABIC_ASSISTANT_ID, // Arabic assistant ID
  zh: CHINESE_ASSISTANT_ID, // Chinese assistant ID
  ja: JAPANESE_ASSISTANT_ID, // Japanese assistant ID
};

const app = express();

app.use(cors());
app.use(bodyParser.json());





// openai paid consulation


app.post('/api/get-ai-response-premium', async (req, res) => {
  const { symptoms, startDate, language, medicalHistory,
    Laterality,
    gender,
    age, } = req.body;

  console.log(`Received request with symptoms: ${symptoms}, startDate: ${startDate}, language: ${language}, medical histort ${medicalHistory} , Laterality: ${Laterality}, gender: ${gender},age:${age}`);

  try {
      const assistantId = LANGUAGE_ASSISTANT_IDS[language] || PREMIUM_CONSULT_ASSISTANT_ID;

      // Step 1: Create a new thread
      const threadResponse = await axios.post(`https://api.openai.com/v1/threads`, {}, {
          headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
          }
      });

      const threadId = threadResponse.data.id;
      console.log('Created new thread with ID:', threadId);

      // Step 2: Add a message to the thread
      await axios.post(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          role: 'user',
          content: `User's symptoms: ${symptoms}. They started on: ${startDate},  medical histort ${medicalHistory} , Laterality: ${Laterality}, gender: ${gender},age:${age}. Please provide advice based on this information.`
      }, {
          headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
          }
      });

      // Step 3: Run the assistant
      let run_res = await axios.post(`https://api.openai.com/v1/threads/${threadId}/runs`, { assistant_id: assistantId }, {
          headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
          }
      });
      console.log(`Running assistant with ID: ${assistantId}, run ID:`, run_res.data.id);

      // Wait for the assistant to finish
      while (run_res.data.status !== 'completed') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          run_res = await axios.get(`https://api.openai.com/v1/threads/${threadId}/runs/${run_res.data.id}`, {
              headers: {
                  'Authorization': `Bearer ${OPENAI_API_KEY}`,
                  'Content-Type': 'application/json',
                  'OpenAI-Beta': 'assistants=v2'
              }
          });
          console.log('Assistant run status:', run_res.data.status);
      }

      // Step 4: Retrieve the response
      const finalResponse = await axios.get(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
          }
      });

      const assistantMessage = finalResponse.data.data.find(msg => msg.role === 'assistant').content[0];
      console.log('Received response from assistant:', assistantMessage.text.value);

      res.json({ response: assistantMessage.text.value });
  } catch (error) {
      console.error('Error communicating with OpenAI API:', error.response ? error.response.data : error.message);
      res.status(500).send('Error communicating with OpenAI API');
  }
});




app.post('/create-payment-intent', async (req, res) => {
  const { amount, description, currency = 'usd', userId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      metadata: {
        integration_check: 'accept_a_payment',
        user_id: userId,
      },
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});

app.post('/confirm-payment', async (req, res) => {
  const { paymentIntentId, userId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).send({ error: 'PaymentIntent not found' });
    }

    console.log('PaymentIntent status:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      const userRef = db.collection('users').doc(userId);
      await userRef.update({
        credits: admin.firestore.FieldValue.increment(1),
      });

      res.status(200).send({ message: 'Payment succeeded' });
    } else {
      res.status(500).send({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).send({ error: 'Failed to confirm payment' });
  }
});
app.post('/create-subscription', async (req, res) => {
  const { priceId, userId } = req.body;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (userData.premium) {
      return res.status(400).send({ error: 'User is already premium' });
    }

    let customerId = userData.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
      });
      customerId = customer.id;

      await db.collection('users').doc(userId).update({
        stripeCustomerId: customerId,
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const paymentIntent = subscription.latest_invoice.payment_intent;

    console.log('Created subscription:', subscription.id);

    await userDoc.ref.update({
      premium: true,
      subscriptionId: subscription.id,
      subscriptionEndDate: subscription.current_period_end,
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).send({ error: 'Failed to create subscription' });
  }
});
app.post('/confirm-subscription', async (req, res) => {
  const { userId, subscriptionId } = req.body;

  console.log('Confirming subscription for ID:', subscriptionId);

  try {
    if (!subscriptionId) {
      throw new Error('subscriptionId is undefined');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (subscription.status === 'active') {
      const userRef = db.collection('users').doc(userId);
      await userRef.update({
        premium: true,
        subscriptionEndDate: subscription.current_period_end,
      });

      res.status(200).send({ message: 'Subscription succeeded' });
    } else {
      res.status(500).send({ error: 'Subscription activation failed' });
    }
  } catch (error) {
    console.error('Error confirming subscription:', error);
    res.status(500).send({ error: 'Failed to confirm subscription' });
  }
});

app.post('/cancel-subscription', async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      console.error('No userId provided');
      return res.status(400).send({ error: 'No userId provided' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.error('User not found');
      return res.status(404).send({ error: 'User not found' });
    }

    const userData = userDoc.data();
    if (!userData.premium || !userData.subscriptionId) {
      console.error('No active subscription found');
      return res.status(400).send({ error: 'No active subscription found' });
    }

    const subscriptionId = userData.subscriptionId;

    console.log(`Cancelling subscription: ${subscriptionId} for user: ${userId}`);

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Optionally, you can update your Firestore document to reflect this status
    await userDoc.ref.update({
      subscriptionCancelAtPeriodEnd: true,
    });

    console.log('Subscription set to cancel at period end successfully');
    res.status(200).send({ message: 'Subscription set to cancel at period end successfully' });
  } catch (error) {
    console.error('Error setting cancel at period end for subscription:', error);
    res.status(500).send({ error: 'Failed to set cancel at period end for subscription' });
  }
});


nodeCron.schedule('0 0 * * *', async () => {
  try {
    const usersSnapshot = await db.collection('users').where('premium', '==', true).get();
    
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      if (userData.subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(userData.subscriptionId);

        if (subscription.status === 'canceled' || (subscription.cancel_at_period_end && subscription.current_period_end < Date.now() / 1000)) {
          await userDoc.ref.update({
            premium: false,
            subscriptionEndDate: null,
            subscriptionId: null,
            subscriptionCancelAtPeriodEnd: false
          });
        }
      }
    });

    console.log('Subscription statuses checked successfully');
  } catch (error) {
    console.error('Error checking subscriptions:', error);
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Function to add 1 credit to every user
const addMonthlyCredits = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);

    // Loop through each user and update their credits
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      const currentCredits = userData.credits || 0; // Get current credits or set to 0

      // Update user document with new credit count
      await updateDoc(doc(db, "users", userDoc.id), {
        credits: currentCredits + 1,
      });

      console.log(`Added 1 credit to user: ${userDoc.id}`);
    });
  } catch (error) {
    console.error('Error adding monthly credits:', error);
  }
};

// Schedule the cron job to run at midnight (00:00) on the 1st of every month
nodeCron.schedule('0 0 1 * *', () => {
  console.log('Running monthly credit addition job...');
  addMonthlyCredits();
});