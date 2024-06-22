import "./ClientConnectRequestForm.css";
import { TextField } from "@mui/material";
import { maskIcon, signatureIcon, idCardIcon } from "assets";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientConnectRequestValidationSchema } from "utils/validators/ClientConnectRequestValidationSchema";
import SubmitButton from "components/atoms/submit-button/SubmitButton";
import useClientConnectReq from "API/useClientConnectReq";

export default function ClientConnectRequestForm({ handleClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(ClientConnectRequestValidationSchema) });

  const ClientConnectReq = useClientConnectReq();

  const onRequestSubmit = async (data) => {
    const jsonData = {
      ...data,
    };

    try{
      await ClientConnectReq(jsonData);
    }catch(err){
      console.log(err);
    }

    //clear form
    setValue("clientFullName", "");
    setValue("creditorUsername", "");

    handleClose();
  };

  const textStyle = {
    fontWeight: "bold",
    fontSize: "1rem",
  };

  return (
    <div className="client-request-form d-flex flex-column align-items-center">
      <div className="form-header">
        <div className="form-header-text">
          <h1 className="my-5">New Client Session</h1>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onRequestSubmit)}
        className="d-flex flex-column"
        style={{ width: "85%" }}
      >
        <div className="row mt-5 mx-auto w-100">
          <h4>Fill in the necessary data to cennect to the Creditor.</h4>
        </div>
        <div className="row mt-3 mx-auto w-100">
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            {...register("clientFullName")}
            error={!!errors.clientFullName}
            helperText={errors.clientFullName?.message || ""}
            InputLabelProps={{ style: textStyle }}
            InputProps={{
              style: { borderRadius: "14px", ...textStyle },
              startAdornment: (
                <img
                  src={signatureIcon}
                  alt="signature-icon"
                  style={{ marginRight: "10px", ...textStyle }}
                />
              ),
            }}
          />
        </div>
        <div className="row mt-3 mx-auto w-100">
          <TextField
            label="Creditor Username"
            variant="outlined"
            fullWidth
            {...register("creditorUsername")}
            error={!!errors.creditorUsername}
            helperText={errors.creditorUsername?.message || ""}
            InputLabelProps={{ style: textStyle }}
            InputProps={{
              style: { borderRadius: "14px", ...textStyle },
              startAdornment: (
                <img
                  src={maskIcon}
                  alt="mask-icon"
                  style={{ marginRight: "10px", ...textStyle }}
                />
              ),
            }}
          />
        </div>
        <div className="my-5 mx-auto" style={{ width: "fit-content" }}>
          <SubmitButton
            className="submissionButton"
            type="submit"
            style={{ width: "200px", fontSize: "20px" }}
          >
            Initiate Request
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
