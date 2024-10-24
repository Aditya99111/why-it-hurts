import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import Footer from './Footer';
const Pricing = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="pricing">
        <section className="plan" id="pricing">
          <h1 className="heading"> Our Pricing </h1>

          <div className="disclaim">
            Try us for free! signin and get a free credit!
            <Link to={"/register"} className="btn"> Register now </Link>

             </div>
            

          <div className="box-container">
            <div className="box">
              <h3 className="day">Free Forever </h3>
              <i className="fas fa-bicycle icon"></i>
              <div className="list">
                <p> Lorem ipsum dolor sit. <span className="fas fa-check"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-xmark"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-xmark"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-xmark"></span> </p>
              </div>
              <div className="amount"><span>$</span>0</div>
              <Link to={"/"} className="btn"> Get started </Link>
            </div>

            <div className="box">
              <h3 className="day"> Pay as you go </h3>
              <i className="fas fa-motorcycle icon"></i>
              <div className="list">
                <p> Lorem ipsum dolor sit. <span className="fas fa-check"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-check"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-xmark"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-xmark"></span> </p>
              </div>
              <div className="amount"><span>$</span>1/credit</div>
              <Link to={"/buy-credit"} className="btn"> Get started </Link>
            </div>

            <div className="box">
              <h3 className="day"> Premium plan </h3>
              <i className="fas fa-car-side icon"></i>
              <div className="list">
                <p> Lorem ipsum dolor sit. <span className="fas fa-check"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-check"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-check"></span> </p>
                <p> Lorem ipsum dolor sit. <span className="fas fa-check"></span> </p>
              </div>
              <div className="amount"><span>$</span>10/Month</div>
              <Link to={"/upgrade"} className="btn"> Get started </Link>
            </div>
          </div>
        </section>
        <br/>
        <br/>
      </div>
      <Footer/>
    </div>
  );
}

export default Pricing;
