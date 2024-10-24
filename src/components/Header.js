import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from 'react-router-dom';
import Usericon from "./user.png";
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="header">
      <LanguageSwitcher />

      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        <Link className="link-styles" style={{color:"#000",textDecoration:"none", marginRight:"10px"}} to="/" onClick={toggleMenu}>{t('why_it_hurts')}</Link>
        <Link className="link-styles" style={{color:"#000",textDecoration:"none", marginRight:"10px"}} to="/pricing" onClick={toggleMenu}>{t('pricing')}</Link>
        <Link className="link-styles" style={{color:"#000",textDecoration:"none", marginRight:"10px"}} to="/terms" onClick={toggleMenu}>{t('terms')}</Link>
        <Link className="link-styles" style={{color:"#000",textDecoration:"none", marginRight:"10px"}} to="/heal" onClick={toggleMenu}>{t("healing")}</Link>

      </div>

      <div className="right">
        <Link className="credits" to="/buy-credits" style={{ padding: '10px', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: "14px", textDecoration: "none" }}>
          {t('buy_credits')}
        </Link>
        <div className="profile">
          <Link to="/profile"><img src={Usericon} alt="" /></Link>
        </div>
        <button className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </div>
  );
};

export default Header;