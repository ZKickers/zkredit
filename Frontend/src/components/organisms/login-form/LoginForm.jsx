import { TextField } from "@mui/material";
import "./LoginForm.css";
import { useState } from "react";
import SubmitButton from "components/atoms/submit-button/SubmitButton";
import { signinIcon } from "assets";
import useLogin from "API/useLogin";
import "react-toastify/dist/ReactToastify.css";
import { useRecaptcha } from "../../../API/useRecaptcha";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = useLogin();

  const onSubmitWithRecaptcha = useRecaptcha();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const captchaResponse = await onSubmitWithRecaptcha();

      if (!captchaResponse.data.success) {
        throw new Error("Error while verifying reCAPTCHA");
      }

      await loginUser({ username, password });
    } catch (error) {
      console.error(error);
      toast.error("Error while signing in", {
        autoClose: 5000,
      });
    }
  };

  const textStyle = {
    fontWeight: "bold",
    fontSize: "1rem",
  };

  return (
    <div className="login-form d-flex align-items-center justify-content-center">
      <form
        onSubmit={loginHandler}
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
          <SubmitButton className="my-4">
            <img src={signinIcon} alt="sign-in-icon" />
            <span>Log In</span>
          </SubmitButton>
      </form>
    </div>
  );
}
