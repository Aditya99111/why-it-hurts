import React from 'react';
import Footer from './Footer';

const Privacy = () => {
  return (
    <div className="termscontainer">
      <h1 className="heading">Privacy Policy</h1>

      {/* Added space and line breaks above the disclaimer */}
      <br />
      <br />

      <h2 style={{ color: 'red', fontSize: '24px', fontWeight: 'bold' }}>
        ⚠️ YOUR PERSONAL INFORMATION WON'T BE SOLD/USED IN ANY WAY ⚠️
      </h2>

      {/* Added space and line breaks below the disclaimer */}
      <br />
      <br />

      <h3>1. Personal Information</h3>
      <p>
        We collect personal information from you when you register on our site,
        place an order, subscribe to our newsletter, respond to a survey, or fill
        out a form. The information we collect includes your name and email address.
      </p>

      <h3>2. Use of Information</h3>
      <p>The information we collect from you may be used in one of the following ways:</p>
      <ul>
        <li>To personalize your experience</li>
        <li>To improve our website</li>
        <li>To improve customer service</li>
        <li>To process transactions</li>
        <li>To administer a contest, promotion, survey, or other site feature</li>
        <li>To send periodic emails</li>
      </ul>

      <h3>3. Protection of Information</h3>
      <p>
        We implement a variety of security measures to maintain the safety of your
        personal information when you place an order or enter, submit, or access
        your personal information.
      </p>

      <h3>4. Cookies</h3>
      <p>
        We use cookies to understand and save your preferences for future visits and
        compile aggregate data about site traffic and site interaction so that we
        can offer better site experiences and tools in the future.
      </p>

      <h3>5. Third-Party Disclosure</h3>
      <p>
        We do not sell, trade, or otherwise transfer to outside parties your
        personally identifiable information. This does not include trusted third
        parties who assist us in operating our website, conducting our business, or
        servicing you, as long as those parties agree to keep this information
        confidential.
      </p>

      <h3>6. Account Deletion Request</h3>
      <p>
        If you wish to delete your account and any associated personal data, please
        contact us via email at{' '}
        <a href="mailto:support@whyithurts.com">support@whyithurts.com</a>. Please
        include your full name and the email address associated with your account.
        We will process your request within 7 days and confirm the deletion of your
        account and data via email.
      </p>

      <h3>7. Changes to Our Privacy Policy</h3>
      <p>
        We may update this privacy policy from time to time to reflect changes to
        our practices or for other operational, legal, or regulatory reasons.
      </p>

      {/* Added more line breaks below the last paragraph */}
      <br />
      <br />
      <br />
      <br />

      <Footer />
    </div>
  );
};

export default Privacy;
