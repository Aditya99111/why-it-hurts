import React from 'react'
import { Link } from 'react-router-dom'
import Usericon from "./user.png"
import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import LanguageSwitcher from './LanguageSwitcher';
import Footer from './Footer';
const Terms = () => {
  const { t } = useTranslation();

  return (
<div className="termscontainer">
  <h1 className="heading">Terms & Conditions</h1>

  <h2>Disclaimer</h2>
  <p style={{ color: 'red', fontSize: '24px', fontWeight: 'bold' }}>
    ⚠️ IF YOU HAVE ANY HEALTH ISSUE, PLEASE CONSULT A HEALTH SPECIALIST IMMEDIATELY. ⚠️
  </p>
  <p>
    The information contained on this website is for general information purposes only. The information is provided by Whyithurts LLC, and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind—express or implied—about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
  </p>

  <h3>1. Professional Advice</h3>
  <p>
    Our analyses are subject to interpretation and should not be taken as absolute. An analysis is never 100% accurate. All analyses provided by Whyithurts LLC are for entertainment purposes only, and no guarantee can be given as to the accuracy of a reading. The user is responsible for their own life choices and decisions.
  </p>

  <h3>2. External Links</h3>
  <p>
    Through this website, you may link to other websites that are not under the control of Whyithurts LLC. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
  </p>

  <h3>3. Limitation of Liability</h3>
  <p>
    In no event will we be liable for any loss or damage—including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits—arising out of, or in connection with, the use of this website.
  </p>

  <h2>Terms of Service</h2>

  <h3>1. Introduction</h3>
  <p>
    Welcome to Whyithurts LLC. By using our services, you agree to comply with and be bound by the following terms and conditions. Please review these terms carefully. If you do not agree with any of these terms, you are prohibited from using our services.
  </p>

  <h3>2. Use of Service</h3>
  <p>
    You must be at least 18 years old to use our services. By using our services, you represent and warrant that you have the right, authority, and capacity to enter into this agreement and to abide by all the terms and conditions herein.
  </p>

  <h3>3. User Conduct</h3>
  <p>
    You agree not to use the service for any unlawful purpose or in any way that might harm, damage, or disparage any other party. You also agree not to use the service to distribute any unsolicited or unauthorized advertising, promotional materials, spam, or any other form of solicitation.
  </p>

  <h3>4. Intellectual Property</h3>
  <p>
    All content, trademarks, and data on this website—including but not limited to software, databases, text, graphics, icons, hyperlinks, proprietary information, designs, and agreements—are the property of or licensed to Whyithurts LLC and are protected from infringement by local and international legislation and treaties.
  </p>

  <h3>5. Limitation of Liability</h3>
  <p>
    In no event will Whyithurts LLC, its suppliers, or other third parties mentioned on this site be liable for any damages whatsoever—including, without limitation, those resulting from lost profits, lost data, or business interruption—arising out of the use, inability to use, or the results of use of this site, any websites linked to this site, or the materials or information contained on any or all such sites.
  </p>

  <h3>6. Refund Policy</h3>
  <p>
    Whyithurts LLC does not offer refunds for any services or products once a transaction has been completed. All sales are final, and the user is responsible for ensuring they fully understand the nature of the service or product they are purchasing before making the transaction.
  </p>

  <h3>7. Changes to Terms</h3>
  <p>
    Whyithurts LLC reserves the right to change these terms from time to time as it sees fit. Your continued use of the site will signify your acceptance of any adjustments to these terms.
  </p>
</div>

  )
}

export default Terms