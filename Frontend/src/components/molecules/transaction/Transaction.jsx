import classNames from "classnames";
import "./Transaction.css";
import { LockIcon, LockOpenIcon, CloseIcon } from "assets";
import { useFetchCreditorUsernameQuery } from "store/apis/txApi";
import { datePrettier } from "./datePrettier";
import TxCard from "../transaction-card/TxCard";

export default function Transaction({
  token,
  txId,
  clientFullName,
  isClient,
  creditorId,
  updateDate,
  status,
  isButton,
  renderCard,
}) {
  let verified, declined, pendingThreshold, pendingValidation;

  switch (status) {
    case "Success":
      verified = true;
      break;
    case "Fail":
      declined = true;
      break;
    case "Pending_Threshold":
      pendingThreshold = true;
      break;
    case "Pending_Validation":
      pendingValidation = true;
      break;
  }

  const { formattedDate, formattedTime } = datePrettier(updateDate);

  let creditorUsername;

  const { data, error, isFetching } = useFetchCreditorUsernameQuery({
    token,
    creditorId,
    txId,
  });

  if (data !== undefined) creditorUsername = data;

  const handleShowCard = () =>
    renderCard({
      txId,
      token,
      date: `${formattedDate} ${formattedTime}`,
      creditorUsername,
      clientFullName,
      verified,
      declined,
      pendingThreshold,
      pendingValidation,
    });

  const base = "tx row container w-100 p-md-2 p-sm-3 my-md-1 my-sm-3";
  const classes = classNames(base, {
    "tx-verified": verified,
    "tx-failed": declined,
    "tx-pending": pendingThreshold || pendingValidation,
  });

  const statusText = classNames({
    Verified: verified,
    Declined: declined,
    Pending: pendingThreshold || pendingValidation,
  });

  const color = classNames({
    "#009A2B": verified,
    "#F62525": declined,
    "#FFB800": pendingThreshold || pendingValidation,
  });

  const iconStyle = {
    fontSize: "72px",
    color: "white",
    backgroundColor: color,
  };

  const renderIcon = () => {
    if (verified)
      return <LockIcon className="rounded-circle p-2" sx={iconStyle} />;
    if (declined)
      return <CloseIcon className="rounded-circle p-2" sx={iconStyle} />;
    if (pendingThreshold || pendingValidation)
      return <LockOpenIcon className="rounded-circle p-2" sx={iconStyle} />;
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

  const renderContent = () => (
    <>
      <div className={contentClasses}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {formattedDate + " " + formattedTime}
        </h1>
        <h2 style={{ fontSize: "20px", fontWeight: "400" }}>
          {isClient ? creditorUsername : clientFullName}
        </h2>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: color,
          }}
        >
          {statusText}
        </h3>
      </div>
      <div className={imgClasses}>{renderIcon()}</div>
    </>
  );

  return isButton ? (
    <button className={classes} onClick={handleShowCard}>{renderContent()}</button>
  ) : (
    <div className={classes}>{renderContent()}</div>
  );
}
