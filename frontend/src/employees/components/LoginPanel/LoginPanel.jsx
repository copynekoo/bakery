import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import "./LoginPanel.css";

const EmployeeLoginPanel = function () {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const requestBody = { username, password };
      const response = await axios.post(
        import.meta.env.VITE_API_DOMAIN + "/api/employees/auth/login",
        requestBody
      );

      // employee token
      document.cookie = `employee-token=${response.data.token}; path=/; SameSite=Strict`;
      navigate({ to: "/employees/products" });
    } catch (err) {
      console.log(err);
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="login-page login-page--employee">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Employee sign in</h1>
          <p className="login-subtitle">
            Internal access. Please enter your credentials.
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
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
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="input-field password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // eye-on
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  // eye-off
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 3 18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.88 4.24A9.87 9.87 0 0 1 12 4c7 0 10 6 10 6a13.32 13.32 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61C3.55 8.08 2 12 2 12a13.15 13.15 0 0 0 4.62 5.11A9.77 9.77 0 0 0 12 20c.87 0 1.71-.11 2.5-.31" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLoginPanel;
