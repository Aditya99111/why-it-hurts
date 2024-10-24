import React from 'react'
import "./main.css"
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './i18n'; 
import TelegramIcon from "./telegram.png"
import Logoimg from "./l.png"
const Footer = () => {

  const { t } = useTranslation();
  return (
    <div className="contactinfo">
    
    <div className="footlogo"> <img src={Logoimg} height={40} width={200} alt="" /></div>
    <div className="footerlink">
          <div>Contact us at <a href="mailto:support@gmail.com">support@gmail.com</a></div> 
         <div className=""><Link to="/terms">{t("terms")}</Link></div>
        <div className=""><Link to="/privacy">{t("privacy_policy")}</Link></div>
       
    </div>    
    <div className="teleicon">  <div className=""><a href="" target="_blank"><img src={TelegramIcon} alt="" /></a> </div></div>  

  </div>
  )
}

export default Footer