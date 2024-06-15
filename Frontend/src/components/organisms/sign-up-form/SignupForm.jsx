import "./SignupForm.css";
import { TextField } from "@mui/material";
import { useState } from "react";
import SubmitButton from "components/atoms/submit-button/SubmitButton";
import { checkKeyIcon, emailIcon, keyIcon, profileIcon } from "assets";
import {
  useUsernameValidation,
  useEmailValidation,
  usePasswordValidation,
} from "hooks/signup-form-hooks/signup-form-hooks";
import useSignUp from "API/useSignup";
import "react-toastify/dist/ReactToastify.css";

export default function SignupForm({ handleClose }) {
  const [username, setUsername] = useState("");
  const { usernameError, validateUsername } = useUsernameValidation();

  const [email, setEmail] = useState("");
  const { emailError, validateEmail } = useEmailValidation();

  const {
    passwordError,
    passwordsMatch,
    validatePassword,
    handlePasswordChange,
  } = usePasswordValidation();
  const [password, setPassword] = useState("");

  const signupUser = useSignUp();

  const signupHandler = async (e) => {
    e.preventDefault();
    if (validData()) {
      try {
        await signupUser({
          email,
          username,
          password,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const validData = () => {
    return (
      validateUsername(username) &&
      validateEmail(email) &&
      validatePassword(username, email, password)
    );
  };

  const textStyle = {
    fontWeight: "bold",
    fontSize: "1rem",
  };

  return (
    <div className="signup-form d-flex flex-column align-items-center">
      <div className="form-header">
        <div className="form-header-text">
          <h1>sign up to ZKredit</h1>
          <h2>quick and easy</h2>
        </div>
      </div>
      <form
        onSubmit={signupHandler}
        autoComplete="off"
        className="d-flex flex-column"
        style={{ width: "85%" }}
      >
        <div className="row mt-5 mx-auto w-100">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError !== ""}
            helperText={usernameError}
            InputLabelProps={{ style: textStyle }}
            InputProps={{
              style: { borderRadius: "14px", ...textStyle },
              startAdornment: (
                <img
                  src={profileIcon}
                  alt="profile-icon"
                  style={{ marginRight: "10px", ...textStyle }}
                />
              ),
            }}
          />
        </div>
        <div className="row my-3 mx-auto w-100">
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            error={emailError !== ""}
            helperText={emailError}
            InputLabelProps={{ style: textStyle }}
            InputProps={{
              style: { borderRadius: "14px", ...textStyle },
              startAdornment: (
                <img
                  src={emailIcon}
                  alt="email-icon"
                  style={{ marginRight: "10px", ...textStyle }}
                />
              ),
            }}
          />
        </div>
        <div className="row gap-sm-4 gap-md-0 mx-auto w-100 d-flex justify-content-between">
          <div className="col-md-6 col-sm-12 p-0 pe-md-2">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={passwordError !== ""} // Set error if password error message is not empty
              helperText={passwordError} // Display password error message
              InputLabelProps={{ style: textStyle }}
              InputProps={{
                style: { borderRadius: "14px", ...textStyle },
                startAdornment: (
                  <img
                    src={keyIcon}
                    alt="key-icon"
                    style={{ marginRight: "10px", ...textStyle }}
                  />
                ),
              }}
            />
          </div>
          <div className="col-md-6 col-sm-12 p-0 pe-md-2" sx={{ width: "90%" }}>
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              error={!passwordsMatch}
              helperText={!passwordsMatch && "Passwords do not match"}
              InputLabelProps={{ style: textStyle }}
              InputProps={{
                style: { borderRadius: "14px", ...textStyle },
                startAdornment: (
                  <img
                    src={checkKeyIcon}
                    alt="check-key-icon"
                    style={{ marginRight: "10px", ...textStyle }}
                  />
                ),
              }}
            />
          </div>
        </div>
        <div className="my-5 mx-auto" style={{ width: "fit-content" }}>
          <SubmitButton style={{ fontSize: "20px" }}>
            <span>Sign Up</span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
