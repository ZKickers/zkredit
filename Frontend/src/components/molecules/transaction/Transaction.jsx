import classNames from "classnames";
import "./Transaction.css";
import { LockIcon, LockOpenIcon, CloseIcon } from "assets";
import useFetchCreditorUsername from "API/useFetchCreditorUsername";
import { datePrettier } from "./datePrettier";
import TransactionStateEnum from "utils/TransactionStateEnum";
import { useState, useEffect } from "react";

export default function Transaction({
  txId,
  clientFullName,
  isClient,
  creditorId,
  updateDate,
  status,
  isButton,
  renderCard,
}) {
  const [transactionState, setTransactionState] = useState(null);
  const state = {
    Verified: transactionState === TransactionStateEnum.SUCCESS,
    Declined: transactionState === TransactionStateEnum.FAIL,
    Pending:
      transactionState === TransactionStateEnum.PENDING_THRESHOLD ||
      transactionState === TransactionStateEnum.PENDING_VALIDATION ||
      transactionState === TransactionStateEnum.PENDING_PROOF,
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
      case "Pending_Validation":
        setTransactionState(TransactionStateEnum.PENDING_VALIDATION);
        break;
      case "Insufficient":
        setTransactionState(TransactionStateEnum.INSUFFICIENT);
        break;
    }
  }, [status]);

  const { formattedDate, formattedTime } = datePrettier(updateDate);

  const [creditorUsername, setCreditorUsername] = useState("");
  const { fetchCreditorUsername, loading, error } = useFetchCreditorUsername();

  useEffect(() => {
    let isMounted = true;
  
    async function fetchData() {
      try {
        const CUN = await fetchCreditorUsername({ txId, creditorId });
        if (isMounted) {
          setCreditorUsername(CUN);
        }
      } catch (error) {
        console.error("Error fetching creditor username:", error);
      }
    }
  
    fetchData();
  
    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted component
    };
  }, [txId, creditorId]);

  const handleShowCard = () =>
    renderCard({
      txId,
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
    "tx-pending": state.Pending,
  });

  const statusText = classNames({
    Verified: state.Verified,
    Declined: state.Declined,
    Pending: state.Pending,
  });

  const color = classNames({
    "#009A2B": state.Verified,
    "#F62525": state.Declined,
    "#FFB800": state.Pending,
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
    if (state.Pending)
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
