import React, { useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [captchaType, setCaptchaType] = useState("numeric");
  const [captcha, setCaptcha] = useState(generateCaptcha("numeric"));
  const [userInput, setUserInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function generateCaptcha(type) {
    if (type === "numeric") {
      return Math.floor(100000 + Math.random() * 900000).toString();
    } else if (type === "alphanumeric") {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    } else if (type === "math") {
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      return `${a} + ${b} = ?`;
    }
    return "";
  }

  function getCorrectAnswer(type, value) {
    if (type === "math") {
      const [a, , b] = value.split(" ");
      return (parseInt(a) + parseInt(b)).toString();
    }
    return value;
  }

  const switchCaptcha = (type) => {
    setCaptchaType(type);
    setCaptcha(generateCaptcha(type));
    setUserInput("");
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha(captchaType));
    setUserInput("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = formData;
    const correctAnswer = getCorrectAnswer(captchaType, captcha);

    if (!name || !email || !password) {
      toast.warn("⚠️ All fields are required.");
      return;
    }

    if (userInput.trim() !== correctAnswer) {
      toast.error("❌ CAPTCHA verification failed.");
      return;
    }

    toast.success("✅ Registration successful!");
    setFormData({ name: "", email: "", password: "" });
    refreshCaptcha();
    setUserInput("");
  };

  return (
    <div className="captcha-container">
      <ToastContainer />
      <h1>User Registration with CAPTCHA</h1>
      <form onSubmit={handleSubmit} className="form-section">
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <div className="toggle-buttons">
          <button
            type="button"
            className={captchaType === "numeric" ? "active" : ""}
            onClick={() => switchCaptcha("numeric")}
          >
            Numeric
          </button>
          <button
            type="button"
            className={captchaType === "alphanumeric" ? "active" : ""}
            onClick={() => switchCaptcha("alphanumeric")}
          >
            Alphanumeric
          </button>
          <button
            type="button"
            className={captchaType === "math" ? "active" : ""}
            onClick={() => switchCaptcha("math")}
          >
            Math
          </button>
        </div>

        <div className="captcha-box">
          <div className="captcha-code">{captcha}</div>
          <button type="button" className="refresh-button" onClick={refreshCaptcha}>
            🔄
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter CAPTCHA"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <button type="submit" className="verify-button">Register</button>
      </form>
    </div>
  );
}

export default App;
