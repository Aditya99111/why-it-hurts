// src/components/UpgradeToPremium.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Usericon from "./user.png"
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import LanguageSwitcher from './LanguageSwitcher';
import Footer from './Footer';
import stripelogo from "./stripe.png"

const UpgradeToPremium = () => {
  const { t } = useTranslation();

  const { currentUser } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        if (userData.premium) {
          setIsPremium(true);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };

    checkPremiumStatus();
  }, [currentUser]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5001/create-subscription', {
        priceId: 'price_1PP6aZA76ySc9bk0s8V5T3qg',
        userId: currentUser.uid,
      });

      const { clientSecret, subscriptionId } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: currentUser.email,
          },
        },
      });

      if (result.error) {
        console.error(result.error.message);
        alert('Failed to upgrade to premium. Please try again.');
      } else {
        const { paymentIntent } = result;
        if (paymentIntent.status === 'succeeded') {
          const confirmSubscriptionResponse = await axios.post('http://localhost:5001/confirm-subscription', {
            userId: currentUser.uid,
            subscriptionId: subscriptionId,
          });

          if (confirmSubscriptionResponse.status === 200) {
            alert('Successfully upgraded to premium!');
           navigate('/profile'); 

          } else {
            alert('Failed to confirm subscription. Please contact support.');
          }
        }
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      alert('Failed to upgrade to premium. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
      <div className="upgrade-container">
      {isPremium ? (
        <div className="already-premium-message">
          <h2>{t('already_premium_member')}</h2>
          <Link to="/profile" className="link-styles">{t('back_to_profile')}</Link>
        </div>
      ) : (
        <>
          <h2>{t('upgrade_to_premium')}</h2>
          <div className="card-input-container">
            <CardElement options={{ style: cardStyle }} />
          </div>
          <button onClick={handleUpgrade} disabled={!stripe || loading} className="upgrade-button">
            {loading ? t('processing') : t('upgrade_now')}
          </button>
          <br /> <br />
          <div className="center"> <Link to={""}><img src={stripelogo} height={30} width={140} alt="" /></Link> </div>

        </>
      )}
    </div>
    
    <Footer/>
    </>
  );
};

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export default UpgradeToPremium;
