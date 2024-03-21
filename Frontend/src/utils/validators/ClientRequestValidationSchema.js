import * as yup from "yup";

export const ClientRequestValidationSchema = yup.object().shape({
  fullname: yup
    .string()
    .matches(
      /^[a-zA-Z .]+$/,
      "Full name can only contain alphabets, spaces, or dots"
    )
    .required("Full name is required"),

  creditorUserName: yup
    .string()
    .matches(/^\S*$/, "Creditor user name cannot contain spaces")
    .required("Creditor user name is required"),

  address: yup.string().required("Address is required"),

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