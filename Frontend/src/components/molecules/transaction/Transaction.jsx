import classNames from "classnames";
import "./Transaction.css";
import { LockIcon, LockOpenIcon, CloseIcon } from "assets";
import { datePrettier } from "./datePrettier";
import TransactionStateEnum from "utils/TransactionStateEnum";
import { useState, useEffect } from "react";

export default function Transaction({
  txId,
  clientFullName,
  isClient,
  creditorId,
  creditorUsername,
  updateDate,
  status,
  isButton,
  renderCard,
}) {
  const [transactionState, setTransactionState] = useState(null);
  const state = {
    Verified: transactionState === TransactionStateEnum.SUCCESS,
    Declined: transactionState === TransactionStateEnum.FAIL,
    Pending_Threshold:
      transactionState === TransactionStateEnum.PENDING_THRESHOLD,
    Pending_Client_Data:
      transactionState === TransactionStateEnum.PENDING_CLIENT_DATA,
    Pending_Proof: transactionState === TransactionStateEnum.PENDING_PROOF,
    Pending_Verification:
      transactionState === TransactionStateEnum.PENDING_VERIFICATION,
  };
  useEffect(() => {
    switch (status) {
      case "Success":
        setTransactionState(TransactionStateEnum.SUCCESS);
        // TODO:: need to check the result and set it SUCCESS or FAIL
        break;
      case "Fail":
        setTransactionState(TransactionStateEnum.FAIL);
        break;
      case "Pending_Threshold":
        setTransactionState(TransactionStateEnum.PENDING_THRESHOLD);
        break;
      case "Pending_Verification":
        setTransactionState(TransactionStateEnum.PENDING_VERIFICATION);
        break;
      case "Pending_Client_Data":
        setTransactionState(TransactionStateEnum.PENDING_CLIENT_DATA);
        break;
      case "Insufficient":
        setTransactionState(TransactionStateEnum.INSUFFICIENT);
        break;
    }
  }, [status]);

  const { formattedDate, formattedTime } = datePrettier(updateDate);

  const handleShowCard = () =>
    renderCard({
      txId,
      isClient,
      date: `${formattedDate} ${formattedTime}`,
      creditorUsername,
      clientFullName,
      transactionState,
      setTransactionState,
    });
  const base = "tx row container w-100 p-md-2 p-sm-3 my-md-1 my-sm-3";
  const classes = classNames(base, {
    "tx-verified": state.Verified,
    "tx-failed": state.Declined,
    "tx-pending":
      state.Pending_Client_Data ||
      state.Pending_Proof ||
      state.Pending_Threshold ||
      state.Pending_Verification,
  });

  const statusText = classNames({
    Verified: state.Verified,
    Declined: state.Declined,
    "Pending Threshold": state.Pending_Threshold,
    "Pending Verification": state.Pending_Verification,
    "Pending Proof": state.Pending_Proof,
    "Pending Client Data": state.Pending_Client_Data,
  });

  const color = classNames({
    "#009A2B": state.Verified,
    "#F62525": state.Declined,
    "#FFB800": state.Pending_Threshold,
    "#33A1DE": state.Pending_Verification,
    "#8E44AD": state.Pending_Proof,
    "#F39C12": state.Pending_Client_Data,
  });

  const iconStyle = {
    fontSize: "72px",
    color: "white",
    backgroundColor: color,
  };

  const renderIcon = () => {
    if (state.Verified)
      return <LockIcon className="rounded-circle p-2" sx={iconStyle} />;
    if (state.Declined)
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
