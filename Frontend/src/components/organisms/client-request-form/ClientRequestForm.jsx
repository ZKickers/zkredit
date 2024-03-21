import "./ClientRequestForm.css";
//import { useState } from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Home, CalendarMonth } from "@mui/icons-material";
import { maskIcon, signatureIcon, idCardIcon } from "assets";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientRequestValidationSchema } from "utils/validators/ClientRequestValidationSchema";
import SubmitButton from "components/atoms/submit-button/SubmitButton";
import { toast } from "react-toastify";

import useClientRequest from "api/use-client-request";

//  Sample JSON data for the form{
//   "fullname": "John Q. Doe",
//   "creditorUserName": "joe",
//   "address": "123 Oak Saint Anytown, WI. 1111",
//   "birthdate": "02-07-2001",
//   "ssn": "210734803"
// }

export default function ClientRequestForm({ handleClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    clearErrors,
  } = useForm({ resolver: yupResolver(ClientRequestValidationSchema) });

  const clientRequest = useClientRequest();

  const onRequestSubmit = (data) => {
    //create json object from form data
    const jsonData = {
      fullname: data.fullname,
      creditorUserName: data.creditorUserName,
      address: data.address,
      birthdate: data.birthdate,
      ssn: data.ssn,
    };

    //TODO: send jsonData to backend
    try {
      const response = clientRequest(jsonData);
      console.log(response);
      toast("Request initiated successfully!");
    } catch (error) {
      console.log(error);
      toast(error.message);
    }

    //clear form
    setValue("fullname", "");
    setValue("creditorUserName", "");
    setValue("address", "");
    setValue("birthdate", "");
    setValue("ssn", "");
    setValue("confirmSSN", "");

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
          <h1 className="my-5">New Client Request</h1>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onRequestSubmit)}
        className="d-flex flex-column"
        style={{ width: "85%" }}
      >
        <div className="row mt-5 mx-auto w-100">
          <h4>
            Fill in the necessary data. Please be advised your data will be
            reviewed by a credit bureau.
          </h4>
        </div>
        <div className="row mt-3 mx-auto w-100">
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            {...register("fullname")}
            error={!!errors.fullname}
            helperText={errors.fullname?.message || ""}
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
            {...register("creditorUserName")}
            error={!!errors.creditorUserName}
            helperText={errors.creditorUserName?.message || ""}
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
        <div className="row mt-3 mx-auto w-100">
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            {...register("address")}
            error={!!errors.address}
            helperText={errors.address?.message || ""}
            InputLabelProps={{ style: textStyle }}
            InputProps={{
              style: { borderRadius: "14px", ...textStyle },
              startAdornment: (
                <Home style={{ marginRight: "10px", fontSize: "28px" }} />
              ),
            }}
          />
        </div>
        <div className="row mt-3 mx-auto w-100">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="Birthdate"
              control={control}
              shouldValidate={true}
              defaultValue={null}
              render={() => (
                <DatePicker
                  className="date-picker"
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = dayjs(date).format("MM-DD-YYYY");
                      setValue("birthdate", formattedDate);
                      clearErrors("birthdate");
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      label: "Birthdate",
                      error: !!errors.birthdate,
                      helperText: errors.birthdate?.message || "",
                      InputLabelProps: { style: textStyle },
                      InputProps: {
                        style: { borderRadius: "14px", ...textStyle },
                        startAdornment: (
                          <CalendarMonth
                            style={{ marginRight: "10px", fontSize: "28px" }}
                          />
                        ),
                      },
                    },
                  }}
                  closeOnSelect={true}
                  minDateTime={dayjs("1900-01-01")}
                />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="row mt-3 gap-sm-4 gap-md-0 mx-auto w-100 d-flex justify-content-between">
          <div className="col-md-6 col-sm-12 p-0 pe-md-2">
            <TextField
              label="SSN"
              variant="outlined"
              fullWidth
              {...register("ssn")}
              error={!!errors.ssn}
              helperText={errors.ssn?.message || ""}
              InputLabelProps={{ style: textStyle }}
              InputProps={{
                style: { borderRadius: "14px", ...textStyle },
                startAdornment: (
                  <img
                    src={idCardIcon}
                    alt="id-card-icon"
                    style={{ marginRight: "10px", ...textStyle }}
                  />
                ),
              }}
            />
          </div>
          <div className="col-md-6 col-sm-12 p-0 pe-md-2" sx={{ width: "90%" }}>
            <TextField
              label="Confirm SSN"
              variant="outlined"
              fullWidth
              {...register("confirmSSN")}
              error={!!errors.confirmSSN}
              helperText={errors.confirmSSN?.message || ""}
              InputLabelProps={{ style: textStyle }}
              InputProps={{
                style: { borderRadius: "14px", ...textStyle },
                startAdornment: (
                  <img
                    src={idCardIcon}
                    alt="id-card-icon"
                    style={{ marginRight: "10px", ...textStyle }}
                  />
                ),
              }}
            />
          </div>
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
