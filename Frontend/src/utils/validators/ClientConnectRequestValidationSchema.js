import * as yup from "yup";

export const ClientConnectRequestValidationSchema = yup.object().shape({
  clientFullName: yup
    .string()
    .matches(
      /^[a-zA-Z .]+$/,
      "Full name can only contain alphabets, spaces, or dots"
    )
    .required("Full name is required"),

    creditorUsername: yup
    .string()
    .matches(/^\S*$/, "Creditor user name cannot contain spaces")
    .required("Creditor user name is required"),
});
