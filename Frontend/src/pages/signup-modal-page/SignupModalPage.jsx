import classNames from "classnames";
import "./SignupModalPage.css";
import SignupForm from "components/organisms/sign-up-form/SignupForm";

export default function SignupModalPage(props) {
  const { show, handleClose } = props;

  const base = "signup-modal-page"
  const classes = classNames(base, {
    "hidden": !show,
  })
  return <div className={classes}>
    <SignupForm show={show} handleClose={handleClose} />
  </div>;
}
