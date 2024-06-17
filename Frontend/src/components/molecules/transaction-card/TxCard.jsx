import classNames from "classnames";
import "./TxCard.css";
import { CloseIcon, LockIcon, LockOpenIcon } from "assets";
import { useEffect, useState } from "react";
import {
  renderThresholdField,
  contentContainer,
  iconClasses,
  renderClientDataButton,
} from "./TxCardComps";
import { useSendThreshold, sendProofStatus } from "API/proofsAPIs";
import useVerify from "utils/useVerify";
import TransactionStateEnum from "utils/TransactionStateEnum";

export default function TxCard(props) {
  const {
    txId,
    date,
    creditorUsername,
    clientFullName,
    transactionState,
    setTransactionState,
  } = props;

  const state = {
    Verified: transactionState === TransactionStateEnum.SUCCESS,
    Declined: transactionState === TransactionStateEnum.FAIL,
    Pending_Threshold:
      transactionState === TransactionStateEnum.PENDING_THRESHOLD,
    Pending_Validation:
      transactionState === TransactionStateEnum.PENDING_VALIDATION,
    Pending_Proof: transactionState === TransactionStateEnum.PENDING_PROOF,
    Pending_Client_Data:
      transactionState === TransactionStateEnum.PENDING_CLIENT_DATA,
  };

  const pending =
    state.Pending_Threshold ||
    state.Pending_Validation ||
    state.Pending_Proof ||
    state.Pending_Client_Data;

  const statusText = classNames({
    Verified: state.Verified,
    Declined: state.Declined,
    "Pending Threshold": state.Pending_Threshold,
    "Pending Validation": state.Pending_Validation,
    "Pending Client Data": state.Pending_Client_Data,
  });

  const color = classNames({
    "#009A2B": state.Verified,
    "#F62525": state.Declined,
    "#FFB800": pending,
  });

  const iconStyle = { color: "white", fontSize: "160px" };

  const renderStatusIcon = () => {
    if (state.Verified) return <LockIcon sx={iconStyle} />;
    else if (state.Declined) return <CloseIcon sx={iconStyle} />;
    else if (pending) return <LockOpenIcon sx={iconStyle} />;
  };

  const [threshold, setThreshold] = useState(0);

  const { proof, error: thresholdError, sendThreshold } = useSendThreshold();

  const {
    verify,
    isVerified,
    verificationResult,
    error: verificationError,
  } = useVerify();

  useEffect(() => {
    if (threshold != 0) {
      // TODO:: set UI to be pending the proof
      setTransactionState(TransactionStateEnum.PENDING_PROOF);
      sendThreshold(threshold, txId);
    }
  }, [threshold]);

  useEffect(() => {
    if (thresholdError) {
      // TODO:: handle error in UI
      alert(thresholdError);
    }
  }, [thresholdError]);

  useEffect(() => {
    if (proof != null) {
      // TODO:: set UI to be pending the verification
      console.log("proof is valid");
      console.log(proof);
      setTransactionState(TransactionStateEnum.PENDING_VALIDATION);
      verify(proof);
    }
  }, [proof]);

  const sendProofStatusHandler = async (verificationResult) => {
    try {
      const response = await sendProofStatus(txId, verificationResult);
      alert(response);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (isVerified && verificationResult != null) {
      alert(verificationResult ? "Threshold reached" : "Threshold not reached");
      if (verificationResult) {
        setTransactionState(TransactionStateEnum.SUCCESS);
      } else {
        setTransactionState(TransactionStateEnum.FAIL);
      }
      sendProofStatusHandler(true);
      // TODO:: change the status of the transaction to verified and update the UI accordingly
      // TODO:: send the proof to the backend to update the status of the transaction
    } else if (isVerified === false) {
      alert("Error verifying the proof, proof is invalid");
      setTransactionState(TransactionStateEnum.INSUFFICIENT);
      sendProofStatusHandler(false);
      //TODO:: change the status of the transaction to inverified and update the UI accordingly
      //TODO:: send the proof to the backend to update the status of the transaction
    }
  }, [isVerified, verificationResult]);

  useEffect(() => {
    if (verificationError) {
      alert(verificationError);
      sendProofStatusHandler(false);
    }
  }, [verificationError]);

  return (
    <div className="row container-fluid h-100 p-4">
      <div className={contentContainer}>
        <div className="w-100" style={{ height: "fit-content" }}>
          <h1 style={{ color: color, fontSize: "36px", fontWeight: "bold" }}>
            {date}
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
          {state.Pending_Threshold && renderThresholdField({ setThreshold, color })}
          {state.Pending_Client_Data && renderClientDataButton({ color })}
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
