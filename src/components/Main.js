import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./main.css";
import axios from "axios";
import Modal from "./Modal";
import PriceModal from "./PriceModal";
import { useTranslation } from "react-i18next";
import "./i18n";
import Footer from "./Footer";
import howPdf from "./how.pdf";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [isPremium, setIsPremium] = useState(null);
  const [symptoms, setSymptoms] = useState(
    localStorage.getItem("savedSymptoms") || ""
  );
  const [startDate, setStartDate] = useState(
    localStorage.getItem("savedStartDate") || ""
  );
  const [age, setAge] = useState(localStorage.getItem("savedAge") || "");
  const [gender, setGender] = useState(
    localStorage.getItem("savedGender") || ""
  );
  const [medicalHistory, setMedicalHistory] = useState(
    localStorage.getItem("savedMedicalHistory") || ""
  );
  const [Laterality, setLaterality] = useState(
    localStorage.getItem("savedLaterality") || ""
  );
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(0);
  const [show, setShow] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // New state for checkbox

  const navigate = useNavigate();

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const showPriceModal = () => {
    setShowPrice(true);
  };

  const hidePriceModal = () => {
    setShowPrice(false);
  };

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        if (!currentUser) {
          setIsPremium(false);

          // Trigger the toast once the isPremium state has been set to false
          toast("Make an account now and try us for free!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return; // Exit if the user is not logged in
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (userData && userData.premium) {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }

        // Fetch user's credits
        setCredits(userData.credits || 0);
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      }
    };

    checkPremiumStatus();
  }, [currentUser]);

  const saveResponseToFirestore = async (responseObj) => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await addDoc(collection(userDocRef, "responses"), responseObj);
    } catch (error) {
      console.error("Error saving response to Firestore:", error);
    }
  };

  const handlePremiumConsultation = async () => {
    setLoading(true);

    const loadingToastId = toast.loading(
      "Please hold tight, while we are getting the response!"
    );

    try {
      const language = i18n.language;
      let res;

      if (isPremium) {
        res = await axios.post(
          "http://localhost:5001/api/get-ai-response-premium",
          {
            symptoms,
            startDate,
            medicalHistory,
            Laterality,
            gender,
            age,
            language,
          }
        );
      } else {
        if (credits < 1) {
          alert("insufficient balance");
          toast.dismiss(loadingToastId); // Make sure loadingToastId is not undefined

          return;
        }

        res = await axios.post(
          "http://localhost:5001/api/get-ai-response-premium",
          {
            symptoms,
            startDate,
            medicalHistory,
            Laterality,
            gender,
            age,
            language,
          }
        );

        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          credits: credits - 1,
        });

        setCredits(credits - 1);
      }

      setResponse(res.data.response);
      toast.dismiss(loadingToastId);
      toast.success("Consultation results fetched successfully!");
      await saveResponseToFirestore({
        timestamp: new Date(),
        symptoms,
        startDate,
        medicalHistory,
        Laterality,
        gender,
        age,
        response: res.data.response,
        type: "premium",
      });
      setError("");
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to get consultation. Please try again later.");
      console.error(
        "Error during premium consultation:",
        error.response ? error.response.data : error.message
      );
      setResponse("");
      setError(
        error.response
          ? error.response.data
          : "Failed to get consultation. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConsultClick = () => {
    if (!currentUser) {
      // Save the entered text temporarily in localStorage
      localStorage.setItem("savedSymptoms", symptoms);
      localStorage.setItem("savedStartDate", startDate);

      localStorage.setItem("savedMedicalHistory", medicalHistory);
      localStorage.setItem("savedLaterality", Laterality);
      localStorage.setItem("savedGender", gender);
      localStorage.setItem("savedAge", age);
      // Redirect to login page
      navigate("/login");
    } else {
      // Proceed to consultation if logged in
      handlePremiumConsultation();
    }
  };

  useEffect(() => {
    if (currentUser) {
      // Clear saved data from localStorage once the user is logged in and the component is loaded
      localStorage.removeItem("savedSymptoms");
      localStorage.removeItem("savedStartDate");
      localStorage.removeItem("savedAge");
      localStorage.removeItem("savedGender");
      localStorage.removeItem("savedLaterality");
      localStorage.removeItem("savedMedicalHistory");
    }
  }, [currentUser]);

  if (isPremium === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mainapp">
      <ToastContainer />
      <Modal show={show} handleClose={hideModal}>
        <div>
          <h1 style={{ textAlign: "center" }}>How it works? </h1>
          <p>
            Imagine for a moment that the persistent headaches you've been
            experiencing aren’t just random occurrences or simply a result of
            stress at work. Or maybe, that your back hurting for weeks is not
            just the result of your mattress, afterall, your partner didn’t have
            any discomfort. <br /> <br />
            What if they’re actually your body’s way of signaling that something
            is off, that your mind is not aligned with your physical shelf. What
            does our suffering body tell us? Our first and only true companion,
            with whom we didn't take the time to engage in a dialogue, to listen
            to what it has to tell us, never taking the time to acknowledge
            ourselves. In our modern world, we often approach health and illness
            from a purely physical perspective, treating the body as a machine
            that occasionally malfunctions. However, what if there’s more to our
            disorders than just biological processes? What if our physical
            symptoms are actually messages from our inner selves, signaling
            deeper emotional and psychological imbalances?...{" "}
            <a href={howPdf} target="blank">
              Read full
            </a>{" "}
          </p>
        </div>
      </Modal>

      <PriceModal show={showPrice} handleClose={hidePriceModal}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <h1 style={{ textAlign: "center" }}>
            {t("how_credits_and_memberships_work")}:
          </h1>
          <ul>
            <li>
              <b>{t("free_credits")}:</b> {t("you_receive")}{" "}
              <b>{t("1_free_credit_every_month")}</b> {t("upon_registration")}{" "}
              <button
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
                <Link
                  to="/regitser"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  {" "}
                  {t("register")}
                </Link>
              </button>
            </li>
            <li>
              <b>{t("credit_packages")}:</b>{" "}
              <button
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
                <Link
                  to="/buy-credits"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  {" "}
                  {t("buy_credits")}
                </Link>
              </button>
              <ol>
                - {t("purchase")} <b>{t("5_credits_for_4_99")}</b>{" "}
              </ol>{" "}
            </li>
            <li>
              {" "}
              <b>{t("membership_options")}:</b>{" "}
              <button
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
                <Link
                  to="/upgrade"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  {" "}
                  {t("upgrade_to_premium")}
                </Link>
              </button>
              <ol>
                - <b>{t("monthly_membership")}:</b>{" "}
                {t("enjoy_unlimited_consultations_for")}{" "}
                <b>{t("4_99_per_month")}</b>
              </ol>
              <ol>
                - <b>{t("yearly_membership")}:</b>{" "}
                {t("get_a_yearly_subscription_for")} <b>49.99€ </b>{" "}
                {t("includes_unlimited_consultations_for_12_months")}
              </ol>{" "}
            </li>
          </ul>
        </div>
      </PriceModal>

      <div className="home">
        <div className="question" onClick={showModal}>
          ?
        </div>
        <h1 className="heading">{t("why_it_hurts")}</h1>
        <div className="textbox">
        {!symptoms && <p style={{ color: "red" }}>{t("required*")}</p>}
          <textarea
            maxLength="450"
            name=""
            id=""
            cols="35"
            rows="10"
            placeholder={t("describe_your_problem")}
            value={symptoms}
            required
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>
        

          <br />
        </div>
        <div className="center">
          {" "}
          {t("credit_balance")} - {credits}{" "}
          <span
            onClick={showPriceModal}
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "50%",
              padding: "1px 7px",
              fontSize: "14px",
              color: "#4d8efc",
              cursor: "pointer",
            }}
          >
            {" "}
            ?{" "}
          </span>
        </div>
        <p className="discription">
          {" "}
          <Link style={{ color: "#000" }} to={"/regitser"}>
            {" "}
            {t("register")}
          </Link>{" "}
          {t("for_1_free_credit_per_month")}
        </p>

        <p className="discription">
          {" "}
          <b>{t("your_body_speaks")}</b>{" "}
        </p>

        <div className="extraquestions">
          <div>
            <p>{t("when_did_the_issue_start")}</p>
            <input
              type="date"
              className="inputbox"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <p>{t("age")}</p>
            <input
              type="number"
              className="inputbox"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t("age")}
            />
          </div>
          <div>
            <p>{t("gender")}</p>
            <select
              className="inputbox"
              name=""
              id=""
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">{t("male")}</option>
              <option value="Female">{t("female")}</option>
              <option value="Other">{t("other")}</option>
            </select>
          </div>
          <div>
            <p>{t("laterality")}</p>
            <select
              className="inputbox"
              name=""
              id=""
              value={Laterality}
              onChange={(e) => setLaterality(e.target.value)}
            >
              <option value="Right-handed">{t("right_handed")}</option>
              <option value="Left-hand">{t("left_handed")}</option>
            </select>
          </div>
          <div className="medical">
            <p>{t("medical_history")}</p>
            {/* <input type="text" className="inputbox" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="if any" /> */}
            <textarea
              maxLength="100"
              name=""
              style={{
                maxWidth: "400px",
              }}
              id=""
              cols="50"
              rows="10"
              placeholder={t("previous_related_medical_history")}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
            ></textarea>
          </div>
        </div>
        <br />
        <div>
          {" "}
          <span>
            {t("i_have_read_the")}{" "}
            <Link to={"/terms"}>{t("terms_and_conditions")}</Link>{" "}
            {t("and_hereby_accept_the_same")}
          </span>
          <input
            type="checkbox"
            id=""
            name="term"
            value="terms"
            checked={agreedToTerms}
            onChange={() => setAgreedToTerms(!agreedToTerms)}
          />
        </div>
        <div className="btns">
          <button
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor:
                agreedToTerms && !loading ? "#6200ea" : "#d3d3d3",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: agreedToTerms && !loading ? "pointer" : "not-allowed",
              transition: "background-color 0.3s ease",
              fontSize: "16px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            className={`consult ${loading ? "disabled" : ""}`}
            disabled={!agreedToTerms || !symptoms || loading}
            onClick={handleConsultClick}
          >
            {loading ? t("loading") : t("consult")}
          </button>
          <br />
          {!isPremium && (
            <div className="center">
              (1{" "}
              <Link
                className="a"
                to="/pricing"
                style={{
                  color: "#000",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "1px",
                  marginLeft: "3px",
                }}
              >
                Credit
              </Link>
              )
            </div>
          )}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="response">
              <h1 className="heading">{t("response")}</h1>

              {/* Show loading message while fetching the response */}
              {loading ? (
                <div className="loading-message">processing...</div>
              ) : (
                <>
                  {/* Show the response when available */}
                  {response && (
                    <div
                      className="response"
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                  )}

                  {/* Show the error message if an error occurs */}
                  {error && (
                    <div className="error">
                      {error}
                      <Link
                        className="credits"
                        to="/buy-credits"
                        style={{
                          padding: "10px",
                          backgroundColor: "#6200ea",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "14px",
                          textDecoration: "none",
                        }}
                      >
                        {t("buy_credits")}
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Main;
