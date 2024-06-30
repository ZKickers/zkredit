require('dotenv').config();
const express = require("express");
const axios = require("axios");

const router = express.Router();
const secretKey = process.env.EXPRESS_APP_RECAPTCHA_SECRET_KEY;

router.post("/submit-recaptcha-token", async (req, res) => {
  const { recaptchaToken } = req.body;

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
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res
      .status(500)
      .json({ success: false, error: "reCAPTCHA verification failed" });
  }
});

module.exports = router;
