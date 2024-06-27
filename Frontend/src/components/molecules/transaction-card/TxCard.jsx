import classNames from "classnames";
import "./TxCard.css";
import { CloseIcon, LockIcon, LockOpenIcon } from "assets";
import { contentContainer, iconClasses } from "./TxCardComps";
import TransactionStateEnum from "utils/TransactionStateEnum";
import { datePrettier } from "../transaction/datePrettier";
import TxCardButton from "./TxCardButton";

export default function TxCard(props) {
  const {
    txId,
    updateDate,
    isClient,
    creditorUsername,
    clientFullName,
    transactionState,
    setTransactionState,
  } = props;

  // the state of the transaction in map form
  const state = {
    Pending_Threshold:
      transactionState === TransactionStateEnum.PENDING_THRESHOLD,
    Pending_Client_Data:
      transactionState === TransactionStateEnum.PENDING_CLIENT_DATA,
    Pending_Proof: transactionState === TransactionStateEnum.PENDING_PROOF,
    Pending_Verification:
      transactionState === TransactionStateEnum.PENDING_VERIFICATION,
    Passed: transactionState === TransactionStateEnum.PASSED,
    Failed: transactionState === TransactionStateEnum.FAILED,
  };

  const { formattedDate, formattedTime } = datePrettier(updateDate);

  const pending =
    state.Pending_Threshold ||
    state.Pending_Verification ||
    state.Pending_Proof ||
    state.Pending_Client_Data;

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

  const iconStyle = { color: "white", fontSize: "160px" };

  const renderStatusIcon = () => {
    if (state.Passed) return <LockIcon sx={iconStyle} />;
    else if (state.Failed) return <CloseIcon sx={iconStyle} />;
    else if (pending) return <LockOpenIcon sx={iconStyle} />;
  };

  return (
    <div className="row container-fluid h-100 p-4">
      <div className={contentContainer}>
        <div className="w-100" style={{ height: "fit-content" }}>
          <h1 style={{ color: color, fontSize: "36px", fontWeight: "bold" }}>
            {formattedDate} {formattedTime}
          </h1>
          <h2 style={{ fontSize: "24px", fontWeight: "400" }}>
            Creditor Username: &nbsp;
            <span className="fw-bold">{creditorUsername}</span>
          </h2>
          <h2 style={{ fontSize: "24px", fontWeight: "400" }}>
            Client Full Name: <span className="fw-bold">{clientFullName}</span>
          </h2>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            Status: <span style={{ color: color }}>{statusText}</span>
          </h3>
          <TxCardButton
            isClient={isClient}
            state={state}
            setTransactionState={setTransactionState}
            color={color}
            txId={txId}
          />
        </div>
      </div>
      <div className={iconClasses}>
        <div className="rounded-circle p-4" style={{ backgroundColor: color }}>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
}
