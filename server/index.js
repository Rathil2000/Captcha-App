const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "6Lfv6y0rAAAAAB9haAxn5bfYo0SE_QtgtGKJCZsK"; // Replace with your reCAPTCHA secret key

app.post("/verify", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "No token provided" });
  }

  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`;
    const response = await axios.post(url);
    const data = response.data;
    if (data.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
