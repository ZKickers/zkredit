import "./LandingPage.css";
import classNames from "classnames";
import LPTemplate from "templates/landing-page-template/LandingPage.Template";

export default function LandingPage() {
  const base = "landing-page";
  const classes = classNames(base);

  return <div className={classes}>
    <LPTemplate />
  </div>;
}