import * as yup from 'yup';

//  Sample JSON data for the form{
//   "fullname": "John Q. Doe",
//   "creditorUserName": "joe",
//   "address": "123 Oak Saint Anytown, WI. 1111",
//   "birthdate": "02-07-2001",
//   "ssn": "210734803"
// }

export const ClientRequestValidationSchema = yup.object().shape({
    fullname: yup.string().required(),
    creditorUserName: yup.string().required(),
    address: yup.string().required(),
    birthdate: yup.string().required(),
    ssn: yup.string().required(),
    confirmSSN: yup.string().required().oneOf([yup.ref('ssn'), null], 'SSN does not match'),
});
