require('dotenv').config();

const axios = require("axios");
const secretKey = process.env.EXPRESS_APP_RECAPTCHA_SECRET_KEY;

async function verifyRecaptchaToken(req, res, next) {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res
      .status(401)
      .json({ message: "Access denied. Recaptcha Token is required." });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      }
    );

    const { success } = response.data;

    if (success) {
      next();
    } else {
      res.status(403).json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res
      .status(500)
      .json({ success: false, error: "reCAPTCHA verification failed" });
  }
}

module.exports = verifyRecaptchaToken;
