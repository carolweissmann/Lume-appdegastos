import { useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState<
    "splash" | "login" | "register" | "dashboard"
  >("splash");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const goToLogin = () => setScreen("login");
  const goToRegister = () => setScreen("register");

  const handleLogin = () => {
    if (email === "carol@lume.com" && password === "123456") {
      setScreen("dashboard");
    } else {
      alert("Email ou senha incorretos");
    }
  };

  const handleRegister = () => {
    if (!name || !email || !phone || !password) {
      alert("Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    localStorage.setItem(
      "lume_user",
      JSON.stringify({ name, email, phone, password }),
    );
    setScreen("dashboard");
  };

  return (
    <div id="app">
      {/* ── Splash ── */}
      <div
        className={`screen ${screen === "login" || screen === "dashboard" || screen === "register" ? "is-offscreen-left" : ""}`}
        id="screen-splash"
      >
        <div className="splash-hero">
          <div className="splash-icon">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="19"
                y1="4"
                x2="19"
                y2="34"
                stroke="#E85002"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1="4"
                y1="19"
                x2="34"
                y2="19"
                stroke="#E85002"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1="8.1"
                y1="8.1"
                x2="29.9"
                y2="29.9"
                stroke="#E85002"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1="29.9"
                y1="8.1"
                x2="8.1"
                y2="29.9"
                stroke="#E85002"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="splash-body">
          <h1 className="splash-title">Bem-vindo ao Lume</h1>
          <p className="splash-sub">
            Controle seus gastos de forma inteligente
          </p>
          <button className="btn-continue" id="js-continue" onClick={goToLogin}>
            Continuar
          </button>
          <button className="btn-skip" id="js-skip" onClick={goToLogin}>
            Pular
          </button>
        </div>
      </div>

      {/* ── Login ── */}
      <div
        className={`screen ${screen === "login" ? "" : screen === "splash" ? "is-offscreen-right" : "is-offscreen-left"}`}
        id="screen-login"
      >
        <div className="login-header">
          <h1 className="login-title">Sign in</h1>
          <p className="login-sub">
            New user?{" "}
            <a href="#" onClick={goToRegister}>
              Create an account
            </a>
          </p>
        </div>

        <div className="form-group">
          <div className="input-wrap">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrap">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="js-pwd"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="input-eye"
              id="js-eye"
              type="button"
              aria-label="Mostrar senha"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ color: showPassword ? "var(--orange)" : undefined }}
            >
              <svg
                id="eye-icon"
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="forgot">
          <a href="#">Forgot password?</a>
        </div>

        <button
          className="btn-login"
          id="js-login"
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>

        <div className="divider">
          <div className="divider-line"></div>
          <span>or</span>
          <div className="divider-line"></div>
        </div>

        <p className="social-label">
          Join With Your Favourite Social Media Account
        </p>

        <div className="social-row">
          <button className="social-btn" aria-label="Google" type="button">
            <svg viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
          <button className="social-btn" aria-label="Apple" type="button">
            <svg viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
          </button>
        </div>

        <p className="terms">
          By signing in with an account, you agree to SO's
          <br />
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>

      {/* ── Register ── */}
      <div
        className={`screen ${screen === "register" ? "" : "is-offscreen-right"}`}
        id="screen-register"
      >
        <div className="login-header">
          <h1 className="login-title">Create account</h1>
          <p className="login-sub">
            Already have one?{" "}
            <a href="#" onClick={goToLogin}>
              Sign in
            </a>
          </p>
        </div>

        <div className="form-group">
          <div className="input-wrap">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrap">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrap">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"
                />
              </svg>
            </span>
            <input
              type="tel"
              placeholder="Phone Number"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrap">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrap">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-login" type="button" onClick={handleRegister}>
          Create account
        </button>

        <div className="divider">
          <div className="divider-line"></div>
          <span>or</span>
          <div className="divider-line"></div>
        </div>

        <p className="social-label">
          Join With Your Favourite Social Media Account
        </p>

        <div className="social-row">
          <button className="social-btn" aria-label="Google" type="button">
            <svg viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>

          <button className="social-btn" aria-label="Apple" type="button">
            <svg viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Dashboard ── */}
      <div
        className={`screen ${screen === "dashboard" ? "" : "is-offscreen-right"}`}
        id="screen-dashboard"
      >
        <div className="dash-header">
          <div className="dash-header-left">
            <div className="dash-logo">
              <svg width="20" height="20" viewBox="0 0 38 38" fill="none">
                <line
                  x1="19"
                  y1="4"
                  x2="19"
                  y2="34"
                  stroke="#E85002"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <line
                  x1="4"
                  y1="19"
                  x2="34"
                  y2="19"
                  stroke="#E85002"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <line
                  x1="8.1"
                  y1="8.1"
                  x2="29.9"
                  y2="29.9"
                  stroke="#E85002"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <line
                  x1="29.9"
                  y1="8.1"
                  x2="8.1"
                  y2="29.9"
                  stroke="#E85002"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="dash-app-name">Lume</p>
              <p className="dash-greeting">bom dia, Carol</p>
            </div>
          </div>
          <div className="dash-header-right">
            <div className="dash-live">
              <span className="dash-live-dot"></span>
              Live
            </div>
            <div className="dash-avatar">CS</div>
          </div>
        </div>
        <div className="dash-net-worth-card">
          <p className="dash-nw-label">NET WORTH</p>
          <div className="dash-nw-value">
            <span className="dash-nw-main">$24,819</span>
            <span className="dash-nw-cents">.32</span>
          </div>
          <p className="dash-nw-sub">↑ $582.40 this month</p>
        </div>
        <div className="dash-cards-row">
          <div className="dash-card">
            <p className="dash-card-label">BALANCE</p>
            <p className="dash-card-value">$24,819</p>
            <p className="dash-card-change positive">+2.4%</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">SPENT</p>
            <p className="dash-card-value">$3,820</p>
            <p className="dash-card-change negative">-8.1%</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">SAVED</p>
            <p className="dash-card-value">34.1%</p>
            <p className="dash-card-change goal">Goal: 30%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
