import React from "react";
import extractProof from "./proofParser";
import SubmitButton from "components/atoms/submit-button/SubmitButton";

export default function ProofModal({ proof, handleClose }) {
  const { threshold, result, timestamp, clientFullName } = extractProof(proof);

  // Format the timestamp
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleString();

  // Display the proof data
  return (
    <div className="proof-modal">
      <h2>Proof Details</h2>
      <p>
        <strong>Threshold:</strong> {threshold}
      </p>
      <p>
        <strong>Exceeding the Threshold:</strong> {result ? "True" : "False"}
      </p>
      <p>
        <strong>Timestamp:</strong> {formattedDate}
      </p>
      <p>
        <strong>Client Full Name:</strong> {clientFullName}
      </p>

      <SubmitButton
        onClick={handleClose}
        style={{
          backgroundColor: "red",
          margin: "10px 0 10px 10px",
          borderRadius: "10px",
        }}
      >
        Close
      </SubmitButton>
    </div>
  );
}
