import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import { db } from '../firebase'; // Firestore database
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions for user data storage
import './LanguageSwitcher'; // Ensure this is correct based on your project structure
import Gooogleicon from "./ggle.png"
const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loginWithGoogle, currentUser } = useAuth(); // Assuming loginWithGoogle is provided by AuthContext

  // Function to handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to login, check your email or password again");
    }
  };

  // Function to handle Google login with Firestore user data check
  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle(); // Perform Google login
      const user = result.user; // Get user object from Google login

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // If the user doesn't exist, create a new document with their details and give 1 credit
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName, // Get user's display name from Google login
          email: user.email, // Get user's email from Google login
          credits: 1, // Assign 1 credit to the new user
          premium: false, // Set premium to false by default
        });
      }

      navigate("/"); // Navigate to the main page after successful login
    } catch (error) {
      console.error("Failed to login with Google:", error);
      alert("Failed to login with Google");
    }
  };

  return (
    <div className="login">
      <div className="formcontainer">
        <h1>{t('login')}</h1>
        {t("just_the_last_step")}
        <br /> <br />
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="inputbox"
          />
          <br />
          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="inputbox"
          />
          <br />
          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#4285F4",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            {t("login")}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          style={{
            padding: "10px",
            backgroundColor: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            textDecoration: "none",
            marginTop: "10px",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            gap:"10px"
          }}
        >
          <img src={Gooogleicon} height={20} width={20} alt="" />
            {t("login_with_google")}

        </button>

        <p>
          {t('dont_have_an_account')}{" "}
          <Link
            to={"/register"}
            style={{
              color: "#6200ea",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
