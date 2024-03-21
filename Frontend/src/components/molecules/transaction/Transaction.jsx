import classNames from "classnames";
import "./Transaction.css";
import { LockIcon, LockOpenIcon, CloseIcon } from "assets";

export default function Transaction(props) {
  const {
    date,
    CRID,
    CLID,
    verified,
    declined,
    pendingThreshold,
    pendingVerification,
  } = props;

  const base = "tx row container w-100 p-md-2 p-sm-3 my-md-1 my-sm-3";
  const classes = classNames(base, {
    "tx-verified": verified,
    "tx-failed": declined,
    "tx-pending": pendingThreshold || pendingVerification,
  });

  const status = classNames({
    Verified: verified,
    Declined: declined,
    Pending: pendingThreshold || pendingVerification,
  });

  const color = classNames({
    "#009A2B": verified,
    "#F62525": declined,
    "#FFB800": pendingThreshold || pendingVerification,
  });

  const iconStyle = {
    fontSize: "72px",
    color: "white",
    backgroundColor: color,
  };

  const renderIcon = () => {
    if (verified)
      return <LockIcon className="rounded-circle p-2" sx={iconStyle} />;
    if (declined) return <CloseIcon className="rounded-circle p-2" sx={iconStyle} />;
    if (pendingThreshold || pendingVerification) return <LockOpenIcon className="rounded-circle p-2" sx={iconStyle} />;
  };

  const contentClasses = classNames(
    "col-md-8",
    "col-sm-12",
    "d-flex",
    "flex-column",
    "justify-content-center",
    "align-items-md-start",
    "align-items-sm-center"
  );

  const imgClasses = classNames(
    "col-md-4",
    "col-sm-12",
    "d-flex",
    "justify-content-md-end",
    "justify-content-sm-center"
  );

  return (
    <div className={classes}>
      <div className={contentClasses}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{date}</h1>
        <h2 style={{ fontSize: "20px", fontWeight: "400" }}>{CRID}</h2>
        <h2 style={{ fontSize: "20px", fontWeight: "400" }}>{CLID}</h2>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: color,
          }}
        >
          {status}
        </h3>
      </div>
      <div className={imgClasses}>{renderIcon()}</div>
    </div>
  );
}
