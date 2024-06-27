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
import { useDispatch } from "react-redux";
import { showSnackbar } from "features/snackbar/snackbarSlice";

const TxCardButton = (props) => {
  const { isClient, state, setTransactionState, color, txId } = props;

  const [proof, setProof] = useState(null);
  const [showProof, setShowProof] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const dispatch = useDispatch();

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
        sendProofStatusHandler(true);
      } else {
        setTransactionState(TransactionStateEnum.FAILED);
        sendProofStatusHandler(false);
      }
    } else if (isVerified === false) {
      dispatch(showSnackbar("Error verifying the proof, proof is invalid"));
    }
  }, [isVerified, verificationResult]);

  useEffect(() => {
    if (verificationError) {
      dispatch(showSnackbar("Error verifying the proof, proof is invalid"));
    }
  }, [verificationError]);

  const sendProofStatusHandler = async (verificationResult) => {
    try {
      // const response = await validateProof(txId, verificationResult);
      // console.log("response", response);
    } catch (error) {
      dispatch(showSnackbar(error.message));
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
