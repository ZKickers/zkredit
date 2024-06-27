import classNames from "classnames";
import "./Transaction.css";
import { LockIcon, LockOpenIcon, CloseIcon } from "assets";
import { datePrettier } from "./datePrettier";
import TransactionStateEnum from "utils/TransactionStateEnum";

export default function Transaction({
  txId,
  clientFullName,
  isClient,
  creditorUsername,
  updateDate,
  status,
  isButton,
  renderCard,
}) {
  const state = {
    Passed: status === TransactionStateEnum.PASSED,
    Failed: status === TransactionStateEnum.FAILED,
    Pending_Threshold: status === TransactionStateEnum.PENDING_THRESHOLD,
    Pending_Client_Data: status === TransactionStateEnum.PENDING_CLIENT_DATA,
    Pending_Proof: status === TransactionStateEnum.PENDING_PROOF,
    Pending_Verification: status === TransactionStateEnum.PENDING_VERIFICATION,
  };

  const { formattedDate, formattedTime } = datePrettier(updateDate);

  const handleShowCard = () => renderCard(txId);
  const base = "tx row container w-100 p-md-2 p-sm-3 my-md-1 my-sm-3";
  const classes = classNames(base, {
    "tx-passed": state.Passed,
    "tx-failed": state.Failed,
    "tx-pending-client-data": state.Pending_Client_Data,
    "tx-pending-proof": state.Pending_Proof,
    "tx-pending-threshold": state.Pending_Threshold,
    "tx-pending-verification": state.Pending_Verification
  });

  const statusText = classNames({
    Passed: state.Passed,
    Failed: state.Failed,
    "Pending Threshold": state.Pending_Threshold,
    "Pending Verification": state.Pending_Verification,
    "Pending Proof": state.Pending_Proof,
    "Pending Client Data": state.Pending_Client_Data,
  });

  const color = classNames({
    "#009A2B": state.Passed,
    "#F62525": state.Failed,
    "#FFB800": state.Pending_Threshold,
    "#33A1DE": state.Pending_Verification,
    "#8E44AD": state.Pending_Proof,
    "#F09C52": state.Pending_Client_Data,
  });

  const iconStyle = {
    fontSize: "72px",
    color: "white",
    backgroundColor: color,
  };

  const renderIcon = () => {
    if (state.Passed)
      return <LockIcon className="rounded-circle p-2" sx={iconStyle} />;
    if (state.Failed)
      return <CloseIcon className="rounded-circle p-2" sx={iconStyle} />;
    if (
      state.Pending_Client_Data ||
      state.Pending_Proof ||
      state.Pending_Threshold ||
      state.Pending_Verification
    )
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
    <button className={classes} onClick={handleShowCard}>
      {renderContent()}
    </button>
  ) : (
    <div className={classes}>{renderContent()}</div>
  );
}
