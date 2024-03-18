import classNames from "classnames";
import "./LandingPage.Template.css";
import "../../index.css";
import { checkMark, computer } from "assets";
import LoginForm from "components/organisms/login-form/LoginForm";
import Footer from "components/organisms/footer/Footer";

export default function LPTemplate() {
  const base = "container-fluid landing-page-template";
  const classes = classNames(base);

  return (
    <div className={classes}>
      <div className="row title container-fluid mt-4 px-5">
        <h1 className="zkredit-title">ZKredit</h1>
        <h2 className="zkp-heading">built on zero knowledge proofs</h2>
      </div>
      <div className="row container-fluid">
        <div className="col-md-7 col-sm-12 main-container">
          <ul>
            <li className="list-item">
              <img src={checkMark} alt="check-mark" />
              <h3 className="list-text">
                Privacy-preserving credit score lookup
              </h3>
            </li>
            <li className="list-item">
              <img src={checkMark} alt="check-mark" />
              <h3 className="list-text">Efficient sensitive data hiding</h3>
            </li>
            <li className="list-item">
              <img src={checkMark} alt="check-mark" />
              <h3 className="list-text">Secure commercial transactions</h3>
            </li>
          </ul>
        </div>
        <div className="col-md-1 col-sm-12 separator"></div>
        <div className="col-md-4 col-sm-12 sign-in">
          <div className="computer-img mb-5">
            <img src={computer} alt="computer" />
          </div>
          <LoginForm />
          <button
            className="my-3"
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            Not yet a user?{" "}
            <span style={{ fontWeight: "bold" }}> Sign up here </span>
          </button>
        </div>
      </div>
      <div className="container-fluid p-0">
        <Footer />
      </div>
    </div>
  );
}