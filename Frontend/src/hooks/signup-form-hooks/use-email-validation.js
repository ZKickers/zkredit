import { useState } from "react";

const useEmailValidation = () => {
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  return { emailError, validateEmail };
};

export default useEmailValidation;
