import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import axios from "axios";
import "./LoginPanel.css";

const LoginPanel = function () {
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
        import.meta.env.VITE_API_DOMAIN + "/api/auth/login",
        requestBody
      );
      // customer token
      document.cookie = `token=${response.data.token}; path=/; SameSite=Strict`;
      navigate({ to: "/" });
    } catch (err) {
      console.log(err);
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Sign in to your account</h1>
          <p className="login-subtitle">
            Welcome back! Please enter your details.
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
                {/* inline icon so we don't depend on Material Icons */}
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

        <div className="login-footer">
          <span>Don&apos;t have an account?</span>
          <Link
            to="/register"
            className="login-footer-link [&.active]:font-bold"
          >
            Register an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
