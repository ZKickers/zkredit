import { TextField } from "@mui/material";
import "./LoginForm.css";
import { useState } from "react";
import SubmitButton from "components/atoms/submit-button/SubmitButton";
import { signinIcon } from "assets";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
  };

  const textStyle = {
    fontWeight: "bold",
    fontSize: "1rem",
  };

  return (
    <div className="login-form d-flex align-items-center justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column"
        style={{ width: "85%" }}
      >
        <div className="mt-4 mb-1 mx-auto w-100">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ style: textStyle }}
            InputProps={{ style: { borderRadius: "14px", ...textStyle } }}
          />
        </div>
        <button
          className="my-1"
          style={{
            width: "fit-content",
            opacity: 0.6,
            cursor: "pointer",
            border: "none",
            alignSelf: "end",
            ...textStyle,
          }}
        >
          Forgot Username?
        </button>
        <div className="my-1 mx-auto w-100">
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: textStyle }}
            InputProps={{ style: { borderRadius: "14px", ...textStyle } }}
          />
        </div>
        <button
          className="my-1"
          style={{
            width: "fit-content",
            opacity: 0.6,
            cursor: "pointer",
            border: "none",
            alignSelf: "end",
            ...textStyle,
          }}
        >
          Forgot Password?
        </button>
        <div className="mt-1 mb-4" style={{ width: "90%" }}>
          <SubmitButton>
            <img src={signinIcon} alt="sign-in-icon" />
            <span>Sign In</span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
