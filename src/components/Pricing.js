import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import Footer from './Footer';

const Pricing = () => {
  return (
    <div>
      <div className="pricing">
        <section
          className="plan"
          id="pricing"
          style={{ paddingBottom: '100px' }} // Added padding to increase space
        >
          <h1 className="heading">Our Pricing</h1>

          <div
            className="disclaim"
            style={{ marginBottom: '30px' }} // Added inline style for spacing
          >
            Try us for free! Sign in and get 1 free credit every month!
            <Link to="/register" className="btn">
              Register now
            </Link>
          </div>

          <div className="box-container">
            {/* Free Trial Plan */}
            <div className="box">
              <h3 className="day">Free Trial</h3>
              <i className="fas fa-bicycle icon"></i>
              <div className="list">
                <p>
                  1 free analysis/month <span className="fas fa-check"></span>
                </p>
                <p>
                  Correction on answers <span className="fas fa-check"></span>
                </p>
                <p>
                  Community access <span className="fas fa-check"></span>
                </p>
                <p>
                  Limited to 1 analysis/month <span className="fas fa-times"></span>
                </p>
              </div>
              <div className="amount">
                <span>$</span>0<span>/month</span>
              </div>
              <Link to="/register" className="btn">
                Get started
              </Link>
            </div>

            {/* Pay As You Go Plan */}
            <div className="box">
              <h3 className="day">Pay As You Go</h3>
              <i className="fas fa-motorcycle icon"></i>
              <div className="list">
                <p>
                  1 free analysis/month <span className="fas fa-check"></span>
                </p>
                <p>
                  Correction on answers <span className="fas fa-check"></span>
                </p>
                <p>
                  $1 per credit <span className="fas fa-check"></span>
                </p>
                <p>
                  Community access <span className="fas fa-check"></span>
                </p>
              </div>
              <div className="amount">
                <span>$</span>1<span>/credit</span>
              </div>
              <Link to="/buy-credit" className="btn">
                Get started
              </Link>
            </div>

            {/* Monthly Subscription Plan */}
            <div className="box">
              <h3 className="day">Monthly Plan</h3>
              <i className="fas fa-car-side icon"></i>
              <div className="list">
                <p>
                  Unlimited analyses <span className="fas fa-check"></span>
                </p>
                <p>
                  Correction on answers <span className="fas fa-check"></span>
                </p>
                <p>
                  Community access <span className="fas fa-check"></span>
                </p>
              </div>
              <div className="amount">
                <span>$</span>10<span>/month</span>
              </div>
              <Link to="/upgrade" className="btn">
                Get started
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
