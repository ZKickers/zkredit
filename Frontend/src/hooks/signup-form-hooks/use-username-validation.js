import { useState } from "react";

const useUsernameValidation = () => {
  const [usernameError, setUsernameError] = useState("");

  const validateUsername = (username) => {
    if (username.length < 4 || username.length > 16) {
      setUsernameError("Username must be between 4 and 16 characters");
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  return { usernameError, validateUsername };
};

export default useUsernameValidation;
