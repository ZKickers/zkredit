import {
  renderThresholdField,
  renderGetProofButton,
  renderShowProofButton,
  renderProofModal,
  renderValidationButton,
  renderClientDataButton,
} from "./TxCardComps";
import useVerify from "utils/useVerify";
import TransactionStateEnum from "utils/TransactionStateEnum";
import { validateProof } from "API/proofsAPIs";
import { useEffect, useState } from "react";

const TxCardButton = (props) => {
  const { isClient, state, setTransactionState, color, txId } = props;

  const [proof, setProof] = useState(null);
  const [showProof, setShowProof] = useState(null);

  // to verify the proof
  const {
    verify,
    isVerified,
    verificationResult,
    error: verificationError,
  } = useVerify();

  useEffect(() => {
    if (isVerified && verificationResult != null) {
      //alert(verificationResult ? "Threshold reached" : "Threshold not reached");
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
      // TODO:: snakebar
      sendProofStatusHandler(false);
    }
  }, [verificationError]);

  const sendProofStatusHandler = async (verificationResult) => {
    try {
      const response = await validateProof(txId, verificationResult);
      alert(response);
    } catch (error) {
      alert(error);
    }
  };

  const handleVerification = () => {
    if (proof != null) {
      verify(proof);
    } else {
      alert(
        "Proof is not available, please provide proof to verify the transaction"
      );
    }
  };

  if (isClient) {
    if (state.Pending_Client_Data) return renderClientDataButton(color, txId);
  } else {
    // creditor
    if (state.Pending_Threshold) return renderThresholdField({ color, txId });
    if (state.Pending_Verification) {
      if (!proof) return renderGetProofButton(color, txId, setProof);
      // if proof is available
      return (
        <div>
          {renderShowProofButton(color, setShowProof)}
          {renderProofModal({ showProof, setShowProof, proof })}
          {renderValidationButton(color, handleVerification)}
        </div>
      );
    }
  }
};

export default TxCardButton;