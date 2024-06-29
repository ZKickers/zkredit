import * as yup from "yup";
import { DATA_LIMITS } from "config";

export const ClientRequestValidationSchema = yup.object().shape({
  address: yup.string()
    .max(DATA_LIMITS["address"],"Address limit is 100 characters")
    .required("Address is required"),
  birthdate: yup
    .string()
    .matches(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format")
    .test("birthdate", "Birthdate must be in the past", (value) => {
      if (!value) return true;
      const birthdate = new Date(value);
      const currentDate = new Date();
      return birthdate < currentDate;
    })
    .required("Birthdate is required"),
  ssn: yup
    .string()
    .matches(/^\d{9}$/, "SSN must be 9 digits")
    .required("SSN is required"),
  confirmSSN: yup
    .string()
    .oneOf([yup.ref("ssn"), null], "SSN confirmation must match SSN")
    .required("SSN confirmation is required"),
});
