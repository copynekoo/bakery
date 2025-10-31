import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import axios from "axios";
import "./RegisterPanel.css";

const RegisterPanel = function () {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const requestBody = {
        username,
        password,
        firstname,
        lastname,
      };

      await axios.post(
        import.meta.env.VITE_API_DOMAIN + "/api/auth/register",
        requestBody
      );

      // after success, go to login
      navigate({ to: "/login" });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create an Account</h1>
          <p className="register-subtitle">Join our bakery family.</p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="register-row">
            <div className="form-group">
              <label htmlFor="firstname" className="input-label">
                First Name
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                className="input-field"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname" className="input-label">
                Last Name
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                className="input-field"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmpassword" className="input-label">
              Confirm Password
            </label>
            <input
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              className="input-field"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <div className="register-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="register-footer-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPanel;
