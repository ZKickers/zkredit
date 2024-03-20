import { useState } from "react";

const usePasswordValidation = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validatePassword = (username, email, confirmPassword) => {
    if (password === confirmPassword) {
      if (password.length >= 8 && password.length <= 32) {
        if (
          !password.includes(username.toLowerCase()) &&
          !password.includes(email.toLowerCase())
        ) {
          // Password is valid
          return true;
        } else {
          setPasswordError(
            "Password cannot contain your username or email address"
          );
        }
      } else {
        setPasswordError("Password must be between 8 and 32 characters long");
      }
    } else {
      setPasswordsMatch(false);
      setPasswordError("Passwords do not match");
    }
    return false;
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(""); // Clear password error when user modifies the password field
  };

  return {
    password,
    passwordError,
    passwordsMatch,
    validatePassword,
    handlePasswordChange,
  };
};

export default usePasswordValidation;
