import classNames from "classnames";
import { useState } from "react";
import { Snackbar, TextField } from "@mui/material";
import SubmitButton from "components/atoms/submit-button/SubmitButton";
import { DataThresholdingIcon } from "assets";
import useSendThreshold from "api/useSendThreshold";
import { useGetProof } from "api/proofsAPIs";
import ProofModal from "components/organisms/proof-modal/ProofModal";
import ClientRequestForm from "components/organisms/client-request-form/ClientRequestForm";
import ModalPage from "pages/modal-page/ModalPage";

const renderThresholdField = ({ color, txId, threshold, setThreshold }) => {
  const { sendThreshold } = useSendThreshold();

  const handleThresholdSubmit = async () => {
    try {
      sendThreshold(threshold, txId);
    }catch(error){
      console.log(error);
    }
  };

  return (
    <div className="mt-4">
      <TextField
        type="number"
        fullWidth
        label="Threshold"
        onChange={(e) => setThreshold(e.target.value)}
        InputLabelProps={{
          style: {
            color: color,
            fontWeight: "bold",
            fontSize: "1.5rem",
          },
        }}
        InputProps={{
          style: {
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "2rem",
          },
          min: 0,
          inputMode: "numeric",
          pattern: "[0-9]",
          startAdornment: (
            <DataThresholdingIcon
              sx={{ paddingRight: "10px", color: color, fontSize: "3rem" }}
            />
          ),
          endAdornment: (
            <SubmitButton
              onClick={() => handleThresholdSubmit()}
              style={{
                backgroundColor: color,
                margin: "10px 0 10px 10px",
                borderRadius: "10px",
              }}
            >
              Submit
            </SubmitButton>
          ),
        }}
      />
    </div>
  );
};

const renderGetProofButton = (color, txId, setProof) => {
  const getProof = useGetProof();

  const handleGetProofClicked = async (txId, setProof) => {
    const proof = await getProof(txId);  
    setProof(proof);
  };

  return (
    <SubmitButton
      className="mt-4"
      onClick={() => handleGetProofClicked(txId, setProof)}
      style={{
        backgroundColor: color,
        width: "100%",
        height: "75px",
        fontSize: "24px",
        borderRadius: "10px",
      }}
    >
      Get Proof
    </SubmitButton>
  );
};

const renderShowProofButton = (color, setShowProof) => {
  return (
    <SubmitButton
      className="mt-4"
      onClick={() => setShowProof(true)}
      style={{
        backgroundColor: color,
        width: "100%",
        height: "75px",
        fontSize: "24px",
        borderRadius: "10px",
      }}
    >
      Show Proof
    </SubmitButton>
  );
};

const renderProofModal = ({ showProof, setShowProof, proof }) => {
  return (
    <ModalPage show={showProof} handleClose={() => setShowProof(false)}>
      <ProofModal proof={proof} handleClose={() => setShowProof(false)} />
    </ModalPage>
  );
};
const renderClientDataButton = (color, txId, showForm, setShowForm) => {
  return (
    <>
      <SubmitButton
        className="mt-4"
        onClick={() => setShowForm(true)}
        style={{
          backgroundColor: color,
          width: "100%",
          height: "75px",
          fontSize: "24px",
          borderRadius: "10px",
        }}
      >
        Send Your Data
      </SubmitButton>
      <ModalPage show={showForm} handleClose={() => setShowForm(false)}>
        <ClientRequestForm handleClose={() => setShowForm(false)} txId={txId} />
      </ModalPage>
    </>
  );
};

const renderValidationButton = (color, handleVerification) => {
  return (
    <SubmitButton
      className="mt-4"
      onClick={() => handleVerification()}
      style={{
        backgroundColor: color,
        width: "100%",
        height: "75px",
        fontSize: "24px",
        borderRadius: "10px",
      }}
    >
      Begin Proof Validation
    </SubmitButton>
  );
};

const contentContainer = classNames(
  "col-md-8",
  "col-sm-12",
  "d-flex",
  "flex-column",
  "justify-content-center",
  "align-items-md-start",
  "align-items-sm-center",
  "p-5"
);

const iconClasses = classNames(
  "col-md-4",
  "col-sm-12",
  "d-flex",
  "justify-content-md-center",
  "justify-content-sm-center",
  "align-items-center",
  "p-5"
);

export {
  renderThresholdField,
  renderGetProofButton,
  renderShowProofButton,
  renderProofModal,
  renderClientDataButton,
  renderValidationButton,
  contentContainer,
  iconClasses,
};
