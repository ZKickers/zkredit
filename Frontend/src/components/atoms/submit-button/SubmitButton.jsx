import classNames from "classnames";
import "./SubmitButton.css";

export default function SubmitButton({ children, ...rest }) {
  const base = "submit-button";

  const classes = classNames(base, rest.className);

  return (
    <button type="submit" {...rest} className={classes}>
      {children}
    </button>
  );
}
