import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot, collection, query, orderBy, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Usericon from "./user.png";
import "./main.css";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import Footer from "./Footer";
const Profile = () => {
  const { t } = useTranslation();

  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [premium, setPremium] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [subscriptionCancelAtPeriodEnd, setSubscriptionCancelAtPeriodEnd] = useState(false);
  const [previousChats, setPreviousChats] = useState([]); // New state
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const userDoc = doc(db, "users", currentUser.uid);
      const unsubscribe = onSnapshot(userDoc, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setCredits(userData.credits);
          setUserName(userData.name);
          setUserEmail(userData.email);
          setPremium(userData.premium);
          setSubscriptionEndDate(userData.subscriptionEndDate);
          setSubscriptionCancelAtPeriodEnd(userData.subscriptionCancelAtPeriodEnd);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    // Fetch previous chats when component mounts
    const fetchPreviousChats = async () => {
      try {
        const userResponsesRef = collection(db, "users", currentUser.uid, "responses");
        const q = query(userResponsesRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const chats = [];
        querySnapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() });
        });
        setPreviousChats(chats);
      } catch (error) {
        console.error("Error fetching previous chats:", error);
      }
    };

    if (currentUser) {
      fetchPreviousChats();
    }
  }, [currentUser]);

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post('http://localhost:5001/cancel-subscription', {
        userId: currentUser.uid,
      });
  
      console.log('Subscription set to cancel at period end:', response.data);
      setSubscriptionCancelAtPeriodEnd(true);
      alert('Subscription cancelled successfully at the end of the current billing period.');
    } catch (error) {
      console.error('Error setting subscription to cancel at period end:', error);
      alert('Failed to cancel subscription. Please try again later.');
    }
  };

  return (
    <div>
   

      <div className="profile">
        <h1>{t("your_profile")}</h1>
        {currentUser ? (
          <div>
            <p>{t('name')}: {userName}</p>
            <p>{t('email')}: {userEmail}</p>
            <p>{t('credits')}: {credits}</p>
            <p>{t('premium_status')}: {premium ? t('premium') : t('standard')}</p>
      {premium && (
        <p>
          {t('subscription_end_date')}:{" "}
          {new Date(subscriptionEndDate * 1000).toLocaleDateString()}
        </p>
      )}
            {premium && !subscriptionCancelAtPeriodEnd && (
              <button
                onClick={handleCancelSubscription}
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight:"10px"
                }}
              >
                {t('cancel_auto_renewal')}
              </button>
            )}
            {subscriptionCancelAtPeriodEnd && (
              <p>{t("subscription_auto_renewal_canceled")}</p>
            )}
            {!premium && (
              <p className="premium">
                {t('need_more_capabilities')} 
                <Link className="premiumlink" to="/upgrade">
                   {t("premium_account")}
                </Link>
              </p>
            )}
            <button
              onClick={() => navigate("/buy-credits")}
              style={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "#6200ea",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {t("buy_credits")}
            </button>
            <button
              onClick={logout}
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {t("logout")}
            </button>
            <Footer/>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="previous-chats">
        <h2>{t("previous_chats")}</h2>
        {previousChats.length > 0 ? (
          <>
          <ol>
            {previousChats.map((chat) => (
              <li key={chat.id}>
                <p><strong>{t("date")}:</strong> {new Date(chat.timestamp * 1000).toLocaleString()}</p>
                <p><strong>{t("symptoms")}:</strong> {chat.symptoms}</p>
                <p><strong>{t('response')}:</strong> {chat.response}</p>
               <hr/></li>
             
            ))}
          </ol>
          </>
        ) : (
          <p>{t('no_previous_chats_found')}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
