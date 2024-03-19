import "./ClientRequestForm.css";
//import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Home, CalendarMonth } from "@mui/icons-material";
import { maskIcon, signatureIcon, idCardIcon } from "assets";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { ClientRequestValidationSchema } from "utils/validators/ClientRequestValidationSchema";

//  Sample JSON data for the form{
//   "fullname": "John Q. Doe",
//   "creditorUserName": "joe",
//   "address": "123 Oak Saint Anytown, WI. 1111",
//   "birthdate": "02-07-2001",
//   "ssn": "210734803"
// }

export default function ClientRequestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    clearErrors,
  } = useForm({ resolver: yupResolver(ClientRequestValidationSchema) });

  const onRequestSubmit = (data) => {};

  const textStyle = {
    fontWeight: "bold",
    fontSize: "1rem",
  };

  return (
    <div className="client-request-form d-flex flex-column align-items-center">
      <div className="form-header">
        <div className="form-header-text">
          <h1>New Client Request</h1>
          <h4>
            Fill in the necessary data. Please be advised your data will be
            reviewed by a credit bureau.
          </h4>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onRequestSubmit)}
        className="d-flex flex-column"
        style={{ width: "85%" }}
      >
        <div className="row mt-5 mx-auto w-100">
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
        <div className="row mt-5 mx-auto w-100">
          <TextField
            label="Creditor User Name"
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
        <div className="row mt-5 mx-auto w-100">
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
                <Home style={{ marginRight: "10px", ...textStyle }} />
              ),
            }}
          />
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="Birthdate"
            control={control}
            shouldValidate={true}
            defaultValue={null}
            render={() => (
              <DateTimePicker
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
                    error: !!errors.birthdate,
                    helperText: errors.birthdate?.message || "",
                    InputLabelProps: { style: textStyle },
                    InputProps: {
                      style: { borderRadius: "14px", ...textStyle },
                      startAdornment: (
                        <CalendarMonth
                          style={{ marginRight: "10px", ...textStyle }}
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

        <div className="row gap-sm-4 gap-md-0 mx-auto w-100 d-flex justify-content-between">
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
              {...register("confirmSsn")}
              error={!!errors.confirmSsn}
              helperText={errors.confirmSsn?.message || ""}
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
          <Button
            className="submissionButton"
            type="submit"
            variant="contained"
            size="large"
            style={{ fontSize: "20px" }}
          >
            Initiate Request
          </Button>
        </div>
      </form>
    </div>
  );
}
