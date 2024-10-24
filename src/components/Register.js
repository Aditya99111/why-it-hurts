import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import Gooogleicon from "./ggle.png"


const Register = () => {
  const { t } = useTranslation();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await register(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        premium: false,
        credits: 1,
      });

      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError(t('an_account_with_this_email_already_exists'));
      } else {
        setError(t('password_too_short'));
      }
      console.error(error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "",
        email: user.email,
        premium: false,
        credits: 1,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="formcontainer">
        <h2>{t('make_a_new_account')}</h2>

        {t("before_consultation")}
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="inputbox"
          />
          <br />
          <input
            type="email"
            placeholder={t("email")}
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
            {t('register')}
          </button>
        </form>

        <button
          onClick={handleGoogleRegister}
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

         {t("register_with_google")}
        </button>

        <p>
          {t('already_have_account')}{" "}
          <Link
            to={"/login"}
            style={{
              color: "#6200ea",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
