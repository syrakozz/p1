import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as LANGUAGES from './translations';
import { SUPPORTED_APP_LANGUAGES } from '../api/vox.types';

export const resources = SUPPORTED_APP_LANGUAGES.reduce((acc, lang) => {
  return {
    ...acc,
    [lang]: {
      translation: LANGUAGES[lang],
    },
  };
}, {});

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v3',
  //language to use if translations in user language are not available
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
