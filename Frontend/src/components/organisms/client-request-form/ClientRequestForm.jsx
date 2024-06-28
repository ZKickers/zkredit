import "./ClientRequestForm.css";
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
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import useClientRequest from "api/useClientRequest";

//  Sample JSON data for the form {
//   "address": "123 Oak Saint Anytown, WI. 1111",
//   "birthdate": "02-07-2001",
//   "ssn": "210734803"
// }

export default function ClientRequestForm({ handleClose, txId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
    clearErrors,
  } = useForm({ resolver: yupResolver(ClientRequestValidationSchema) });

  const postClientData = useClientRequest();

  const onRequestSubmit = async (data) => {
    const response = await postClientData({ ...data, txId });
    console.log(response);
    try {
      toast.success("Request initiated successfully!", {
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        autoClose: 5000,
      });
    }

    //clear form
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
          <ToastContainer />
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
              name="birthdate"
              control={control}
              shouldValidate={true}
              defaultValue={null}
              render={() => (
                <DatePicker
                  value={
                    getValues("birthdate")
                      ? dayjs(getValues("birthdate")).toDate()
                      : null
                  } // Get the value of birthdate from getValues
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
