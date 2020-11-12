import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    // <div onChange={changeLanguage}>
    //   <input type="radio" value="en" name="language" defaultChecked />{' '}
    //   English
    //   <input type="radio" value="bn" name="language" /> Bangla
    // </div>
    <div className="tc bb b--white mt5 flex justify-center">
      <p className="white fw6 f5 pointer dim" onClick={() => changeLanguage('en')}>English</p>
      <p className="white f5 ml4 pointer dim" onClick={() => changeLanguage('bn')}>বাংলা</p>
    </div>
  );
};

export default LanguageSelector;
