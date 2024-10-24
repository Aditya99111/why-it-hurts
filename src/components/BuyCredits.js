// src/components/BuyCredits.js
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Usericon from "./user.png"
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import Footer from './Footer';
import stripelogo from "./stripe.png"


const BuyCredits = () => {
  const { t } = useTranslation();

  const { currentUser } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBuyCredits = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5001/create-payment-intent', {
        amount: 100, // $1.00
        description: 'Purchase credits',
        currency: 'usd',
        userId: currentUser.uid,
      });

      const { clientSecret } = data;

      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: currentUser.displayName || currentUser.email,
          },
        },
      });

      if (result.error) {
        console.error(result.error.message);
        alert('Payment failed: ' + result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          await axios.post('http://localhost:5001/confirm-payment', {
            paymentIntentId: result.paymentIntent.id,
            userId: currentUser.uid,
          });
          alert('Credits bought successfully!');
          navigate('/profile'); // Redirect to profile page after successful purchase
        }
      }
    } catch (error) {
      console.error('Error purchasing credits:', error);
      alert('Error purchasing credits: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (


<div>
 

      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '10px', marginTop: "20px" }}>
        <h2>{t('buy_credits')}</h2>
        <CardElement />
        <button onClick={handleBuyCredits} disabled={!stripe || loading} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? t('processing') : t('buy_credits_for_1')}
        </button>
        <br /><br />
        <div className="center"> <Link to={""}><img src={stripelogo} height={30} width={140} alt="" /></Link> </div>
       
      </div>

      <Footer/>
    </div>
  );
};

export default BuyCredits;
