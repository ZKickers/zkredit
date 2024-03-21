import classNames from "classnames";

export default function HeaderLeft({ children }) {
  const classes = classNames(
    "col-md-7",
    "col-sm-12",
    "d-flex",
    "flex-column",
    "align-items-md-start",
    "justify-content-sm-center",
    "align-items-sm-center"
  );

  return <div className={classes}>{children}</div>;
}
