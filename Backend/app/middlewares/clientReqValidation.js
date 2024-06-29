const { check, validationResult } = require('express-validator');
const sanitizer = require('sanitizer');

const validateIssueTXParams = [
  check('creditorUsername')
    .isAlphanumeric().withMessage('Creditor username must contain only letters and numbers')
    .notEmpty().withMessage('Creditor username is required')
    .customSanitizer(value => sanitizer.escape(value)),
  check('clientFullName')
    .isString().withMessage('Client full name must be a string')
    .notEmpty().withMessage('Client full name is required')
    .customSanitizer(value => sanitizer.escape(value)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateProofParams = [
  check('txId')
    .isMongoId().withMessage('Transaction ID must be a valid MongoDB ID')
    .notEmpty().withMessage('Transaction ID is required')
    .customSanitizer(value => sanitizer.escape(value)),
  check('address')
    .isString().withMessage('Address must be a string')
    .notEmpty().withMessage('Address is required')
    .customSanitizer(value => sanitizer.escape(value)),
  check('birthdate')
    .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage('Birthdate must be in the format DD-MM-YYYY')
    .notEmpty().withMessage('Birthdate is required')
    .customSanitizer(value => sanitizer.escape(value)),
  check('ssn')
    .isNumeric().withMessage('SSN must contain only numbers')
    .notEmpty().withMessage('SSN is required')
    .isLength({ min: 9, max: 9 }).withMessage('SSN must be exactly 9 digits')
    .customSanitizer(value => sanitizer.escape(value)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateIssueTXParams,
  validateProofParams
};
