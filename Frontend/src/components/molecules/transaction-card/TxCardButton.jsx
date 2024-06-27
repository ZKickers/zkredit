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
  const [showForm, setShowForm] = useState(false);
  const [threshold, setThreshold] = useState(0);

  // to verify the proof
  const {
    verify,
    isVerified,
    verificationResult,
    error: verificationError,
    reset: resetVerification,
  } = useVerify();

  // Reset proof, verification result, and verification status when txId changes
  useEffect(() => {
    setProof(null);
    setShowProof(null);
    setShowForm(false);
    setThreshold(0);
    resetVerification();
  }, [txId]);

  useEffect(() => {
    if (isVerified && verificationResult != null) {
      if (verificationResult) {
        setTransactionState(TransactionStateEnum.PASSED);
      } else {
        setTransactionState(TransactionStateEnum.FAILED);
      }
      sendProofStatusHandler(true);
    } else if (isVerified === false) {
      console.log("Error verifying the proof, proof is invalid aaaaaaaaaaaaaaaaaaaaa");
    }
  }, [isVerified, verificationResult]);

  useEffect(() => {
    if (verificationError) {
      console.log("verificationError", verificationError);
      // TODO:: snakebar
      // sendProofStatusHandler(false);
    }
  }, [verificationError]);

  const sendProofStatusHandler = async (verificationResult) => {
    try {
      const response = await validateProof(txId, verificationResult);
      console.log("response", response);
    } catch (error) {
      console.error("response", response);
    }
  };

  const handleVerification = () => {
    if (proof != null) {
      verify(proof);
    } else {
      console.error(
        "Proof is not available, please provide proof to verify the transaction"
      );
    }
  };
  console.log("isVerified", isVerified, verificationResult);
  console.log("proof", !!proof);
  console.log("isClient", isClient);

  if (isClient) {
    if (state.Pending_Client_Data)
      return renderClientDataButton(color, txId, showForm, setShowForm);
  } else {
    // creditor
    if (state.Pending_Threshold) {
      return renderThresholdField({ color, txId, threshold, setThreshold });
    }
    if (state.Pending_Verification) {
      if (!proof) return renderGetProofButton(color, txId, setProof);
      // if proof is available
      if (isVerified === null || isVerified === false) {
        console.log("isVerified", isVerified, verificationResult);
        console.log("proof", !!proof);
        return renderValidationButton(color, handleVerification);
      }
    }
    if (proof && isVerified) {
      // if proof is verified
      return (
        <>
          {renderShowProofButton(color, setShowProof)}
          {renderProofModal({ showProof, setShowProof, proof })}
        </>
      );
    }
  }
};

export default TxCardButton;
