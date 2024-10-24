import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="language-switcher">
      <select className="language-select" onChange={handleLanguageChange} value={i18n.language}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="ru">Русский</option>
        <option value="pt">Português</option>
        <option value="es">Español</option>
        <option value="hi">हिन्दी</option>
        <option value="ar">العربية</option>
        <option value="zh">中文</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;