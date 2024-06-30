import React from "react";
import "./ProofModal.css";
import extractProof from "./proofParser";
import SubmitButton from "components/atoms/submit-button/SubmitButton";
import { circleCheck, circleRefuse, confetti, sadCat } from "assets";
import classNames from "classnames";

export default function ProofModal({ proof, handleClose }) {
  const { threshold, result, timestamp, clientFullName } = extractProof(proof);

  const thresholdInt = Number(threshold);


  // Format the timestamp
  const date = new Date(Number(timestamp));
  const formattedDate = date.toLocaleString();

  const img = result ? confetti : sadCat;

  const mark = result ? circleCheck : circleRefuse;

  const thresholdExceeded = classNames({
    "Exceeded Threshold": result,
    "Didn't Exceed Threshold": !result,
  });

  const thresholdStyle = classNames("fw-bold text-center", {
    "text-success": result,
    "text-danger": !result,
  });

  // Display the proof data
  return (
    <div className="proof-modal">
      <div className="status-img">
        <img src={img} alt="status-confetti" />
      </div>
      <div className="status-mark">
        <img src={mark} alt="circled-mark" />
      </div>
      <div className="content">
        <div className="timestamp">{formattedDate}</div>
        <h1 className={thresholdStyle} style={{ fontSize: "50px" }}>
          {thresholdExceeded}
        </h1>
        <h2
          className="text-center fw-bold text-warning"
          style={{ fontSize: "30px" }}
        >
          {clientFullName} exceeded the {thresholdInt} threshold you provided
        </h2>
        <p className="text-center">
          Please pay attention as this page will no longer be available after you close it.
        </p>
        <SubmitButton
          onClick={handleClose}
          style={{
            backgroundColor: "red",
            margin: "20px auto",
            borderRadius: "10px",
          }}
        >
          Close
        </SubmitButton>
      </div>
    </div>
  );
}
