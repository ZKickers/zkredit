import { useEffect, useState } from 'react';
import axiosInstance from 'API/axios';

export const useRecaptcha = () => {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY

  useEffect(() => {
    const loadRecaptcha = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
      script.onload = () => setRecaptchaLoaded(true);
      document.head.appendChild(script);
    };

    loadRecaptcha();
  }, []);

  const onSubmitWithRecaptcha = async () => {
    if (!recaptchaLoaded) {
      alert('reCAPTCHA is not loaded yet.');
      return;
    }

    try {
      // Execute reCAPTCHA
      const recaptchaToken = await new Promise((resolve, reject) => {
        window.grecaptcha.enterprise.ready(() => {
          window.grecaptcha.enterprise.execute(siteKey, { action: 'USER_ACTION' })
            .then(resolve)
            .catch(reject);
        });
      });

      const response = await axiosInstance.post('/recaptcha/submit-recaptcha-token', { recaptchaToken });

      return response;
    } catch (error) {
      console.error('Error during reCAPTCHA execution:', error);
      return error;
    }
  };

  return onSubmitWithRecaptcha;
};
