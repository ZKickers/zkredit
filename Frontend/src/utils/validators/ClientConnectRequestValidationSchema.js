import * as yup from "yup";
import { DATA_LIMITS } from "config";

export const ClientConnectRequestValidationSchema = yup.object().shape({
  clientFullName: yup
    .string()
    .matches(
      /^[a-zA-Z .]+$/,
      "Full name can only contain alphabets, spaces, or dots"
    )
    .max(DATA_LIMITS["fullname"],"Full name limit is 70 characters")
    .required("Full name is required"),

    creditorUsername: yup
    .string()
    .matches(/^\S*$/, "Creditor username cannot contain spaces")
    .required("Creditor user name is required"),
});
