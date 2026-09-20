import { useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState<
    "splash" | "login" | "register" | "setup" | "dashboard" | "add" | "transactions"
  >("splash");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [income, setIncome] = useState("");
const [fixedExpenses, setFixedExpenses] = useState<{name: string; amount: string}[]>([
  { name: "", amount: "" }
]);

  const goToLogin = () => setScreen("login");
  const goToRegister = () => setScreen("register");

  const handleLogin = () => {
    if (email === "carol@lume.com" && password === "123456") {
      setScreen("dashboard");
      return;
    }
    const stored = localStorage.getItem("lume_user");
    if (stored) {
      const user = JSON.parse(stored);
      if (email === user.email && password === user.password) {
        setScreen("dashboard");
        return;
      }
    }
    alert("Email ou senha incorretos");
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
    setScreen("setup");
  };

  const handleSaveSetup = () => {
    if (!income) {
      alert("Informe sua renda mensal");
      return;
    }
    localStorage.setItem("lume_income", income);
    const validFixed = fixedExpenses.filter((f) => f.name && f.amount);
    localStorage.setItem("lume_fixed", JSON.stringify(validFixed));
    setScreen("dashboard");
  };

  const handleSaveExpense = () => {
    if (!amount || !description || !category || !date) {
      alert("Preencha todos os campos");
      return;
    }
    const expenses = JSON.parse(localStorage.getItem("lume_expenses") || "[]");
    if (editingId !== null) {
      const idx = expenses.findIndex((e: { id: number }) => e.id === editingId);
      if (idx !== -1) {
        expenses[idx] = { ...expenses[idx], amount: parseFloat(amount), description, category, date };
      }
      setEditingId(null);
    } else {
      expenses.push({
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        category,
        date,
        createdAt: new Date().toISOString(),
      });
    }
    localStorage.setItem("lume_expenses", JSON.stringify(expenses));
    setAmount("");
    setDescription("");
    setCategory("");
    setDate("");
    setScreen("transactions");
  };

  // ── Dados do dashboard ──────────────────
const storedIncome = parseFloat(localStorage.getItem("lume_income") || "0");
const storedFixed: { name: string; amount: string }[] = JSON.parse(localStorage.getItem("lume_fixed") || "[]");
const storedExpenses: { id: number; amount: number; date: string; description: string; category: string }[] = JSON.parse(localStorage.getItem("lume_expenses") || "[]");

const now = new Date();
const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
const monthExpenses = storedExpenses.filter((e) => e.date.startsWith(thisMonth));

const totalFixed = storedFixed.reduce((acc, f) => acc + parseFloat(f.amount || "0"), 0);
const totalVariable = monthExpenses.reduce((acc, e) => acc + e.amount, 0);
const totalSpent = totalFixed + totalVariable;
const remaining = storedIncome - totalSpent;
const savedPct = storedIncome > 0 ? ((remaining / storedIncome) * 100).toFixed(1) : "0";

const biggestExpense = monthExpenses.length > 0
  ? monthExpenses.reduce((max, e) => e.amount > max.amount ? e : max, monthExpenses[0])
  : null;
  
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
          <p className="dash-nw-label">SALDO DISPONÍVEL</p>
          <div className="dash-nw-value">
            <span className="dash-nw-main">R$ {remaining.toFixed(2)}</span>
          </div>
          <p className="dash-nw-sub">Renda: R$ {storedIncome.toFixed(2)}</p>
        </div>
        <div className="dash-cards-row">
          <div className="dash-card">
            <p className="dash-card-label">RENDA</p>
            <p className="dash-card-value">R$ {storedIncome.toFixed(0)}</p>
            <p className="dash-card-change positive">mensal</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">GASTO</p>
            <p className="dash-card-value">R$ {totalSpent.toFixed(0)}</p>
            <p className="dash-card-change negative">este mês</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">SOBROU</p>
            <p className="dash-card-value">{savedPct}%</p>
            <p className="dash-card-change goal">da renda</p>
          </div>
        </div>
        <div className="dash-tabs">
          <button className="dash-tab active">Overview</button>
          <button className="dash-tab">Transactions</button>
          <button className="dash-tab">Categories</button>
        </div>
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <div>
              <p className="dash-chart-label">GASTO DO MÊS</p>
              <p className="dash-chart-value">R$ {totalSpent.toFixed(2)}</p>
            </div>
            <div className="dash-chart-badge">↓ 8.1%</div>
          </div>
          <div className="dash-bars">
            {[
              { month: "Jan", h: 45 },
              { month: "Feb", h: 55 },
              { month: "Mar", h: 40 },
              { month: "Apr", h: 60 },
              { month: "May", h: 50 },
              { month: "Jun", h: 48 },
              { month: "Jul", h: 42 },
              { month: "Aug", h: 65 },
              { month: "Sep", h: 80, active: true },
            ].map((b) => (
              <div className="dash-bar-col" key={b.month}>
                <div
                  className={`dash-bar ${b.active ? "active" : ""}`}
                  style={{ height: `${b.h}%` }}
                ></div>
                <p className={`dash-bar-label ${b.active ? "active" : ""}`}>
                  {b.month}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-bottom-cards">
          <div className="dash-bottom-card">
            <div className="dash-bottom-card-icon">🔴</div>
            <div className="dash-bottom-card-info">
              <p className="dash-bottom-card-label">MAIOR GASTO</p>
              <p className="dash-bottom-card-value">
                {biggestExpense ? `${biggestExpense.description} — R$ ${biggestExpense.amount.toFixed(2)}` : "Nenhum ainda"}
              </p>
            </div>
          </div>
          <div className="dash-bottom-card">
            <div className="dash-bottom-card-icon">🟢</div>
            <div className="dash-bottom-card-info">
              <p className="dash-bottom-card-label">ORÇAMENTO RESTANTE</p>
              <p className="dash-bottom-card-value">R$ {remaining.toFixed(2)} restando</p>
            </div>
            <p className={"dash-bottom-card-pct " + (remaining >= 0 ? "positive" : "negative")}>
              {savedPct}%
            </p>
          </div>
        </div>
        <div className="bottom-nav">
          <button className="nav-btn active" type="button">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span>Home</span>
          </button>
          <button className="nav-btn" type="button" onClick={() => setScreen("transactions")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>History</span>
          </button>

          <button
            className="nav-btn nav-add"
            type="button"
            onClick={() => setScreen("add")}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <button className="nav-btn" type="button">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6z"
              />
            </svg>
            <span>Categories</span>
          </button>
          <button className="nav-btn" type="button">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </div>
      {/* ── Add ── */}
      <div
        className={`screen ${screen === "add" ? "" : "is-offscreen-right"}`}
        id="screen-add"
      >
        <div className="add-header">
          <button
            className="add-back"
            type="button"
            onClick={() => setScreen("dashboard")}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="add-title">New Expense</h1>
          <div style={{ width: 20 }} />
        </div>

        <div className="add-amount-wrap">
          <span className="add-currency">$</span>
          <input
            className="add-amount-input"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="add-form">
          <div className="add-field">
            <label className="add-label">Description</label>
            <input
              className="add-input"
              type="text"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="add-field">
            <label className="add-label">Category</label>
            <select
              className="add-input add-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="food">🍔 Food</option>
              <option value="transport">🚗 Transport</option>
              <option value="housing">🏠 Housing</option>
              <option value="health">💊 Health</option>
              <option value="entertainment">🎬 Entertainment</option>
              <option value="other">📦 Other</option>
            </select>
          </div>
          <div className="add-field">
            <label className="add-label">Date</label>
            <input
              className="add-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <button className="add-btn" type="button" onClick={handleSaveExpense}>
          Save Expense
        </button>
      </div>
            {/* ── Transactions ── */}
      <div
        className={`screen ${screen === "transactions" ? "" : "is-offscreen-right"}`}
        id="screen-transactions"
      >
        <div className="add-header">
          <button className="add-back" type="button" onClick={() => setScreen("dashboard")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="add-title">Histórico</h1>
          <div style={{ width: 20 }} />
        </div>

        <div className="tx-list">
          {(() => {
            const expenses: { id: number; description: string; category: string; amount: number; date: string; createdAt?: string }[] = JSON.parse(localStorage.getItem("lume_expenses") || "[]");
            if (expenses.length === 0) {
              return <p className="tx-empty">Nenhuma transação ainda. Adicione seu primeiro gasto!</p>;
            }
            const categoryIcon: Record<string, string> = {
              food: "🍔", transport: "🚗", housing: "🏠", health: "💊", entertainment: "🎬", other: "📦"
            };
            const categoryColor: Record<string, string> = {
              food: "#E85002", transport: "#3B82F6", housing: "#8B5CF6", health: "#10B981", entertainment: "#F59E0B", other: "#6B7280"
            };
            const handleDelete = (id: number) => {
              const updated = expenses.filter((e) => e.id !== id);
              localStorage.setItem("lume_expenses", JSON.stringify(updated));
              window.location.reload();
            };
            const handleEdit = (e: typeof expenses[0]) => {
              setEditingId(e.id);
              setAmount(String(e.amount));
              setDescription(e.description);
              setCategory(e.category);
              setDate(e.date);
              setScreen("add");
            };
            return [...expenses].reverse().map((e) => {
              const timeStr = e.createdAt
                ? new Date(e.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                : "";
              return (
                <div className="tx-item" key={e.id}>
                  <div className="tx-icon-box" style={{ background: categoryColor[e.category] || "#6B7280" }}>
                    {categoryIcon[e.category] || "📦"}
                  </div>
                  <div className="tx-info" onClick={() => handleEdit(e)}>
                    <p className="tx-desc">{e.description}</p>
                    <p className="tx-date">{e.category} · {e.date}{timeStr ? " · " + timeStr : ""}</p>
                  </div>
                  <div className="tx-right">
                    <p className="tx-amount">R$ {e.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    <button className="tx-delete" onClick={() => handleDelete(e.id)}>✕</button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

        {/* SETUP SCREEN */}
        <div
          id="screen-setup"
          className={`screen ${
            screen === "setup"
              ? "is-active"
              : screen === "dashboard" || screen === "add" || screen === "transactions"
              ? "is-offscreen-left"
              : "is-offscreen-right"
          }`}
        >
          <div className="setup-header">
            <h1 className="setup-title">Vamos configurar<br />o seu Lume ✦</h1>
            <p className="setup-subtitle">Essas infos ajudam a calcular seu saldo real</p>
          </div>

          <div className="setup-form">
            <div className="setup-section">
              <label className="setup-label">Qual é a sua renda mensal?</label>
              <div className="setup-income-wrap">
                <span className="setup-currency">R$</span>
                <input
                  className="setup-income-input"
                  type="number"
                  placeholder="0,00"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
            </div>

            <div className="setup-section">
              <label className="setup-label">Gastos fixos mensais</label>
              <p className="setup-hint">Netflix, academia, aluguel…</p>
              {fixedExpenses.map((item, index) => (
                <div className="setup-fixed-row" key={index}>
                  <input
                    className="setup-fixed-name"
                    type="text"
                    placeholder="Nome"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...fixedExpenses];
                      updated[index].name = e.target.value;
                      setFixedExpenses(updated);
                    }}
                  />
                  <input
                    className="setup-fixed-amount"
                    type="number"
                    placeholder="R$"
                    value={item.amount}
                    onChange={(e) => {
                      const updated = [...fixedExpenses];
                      updated[index].amount = e.target.value;
                      setFixedExpenses(updated);
                    }}
                  />
                  {fixedExpenses.length > 1 && (
                    <button
                      className="setup-fixed-remove"
                      onClick={() => setFixedExpenses(fixedExpenses.filter((_, i) => i !== index))}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                className="setup-add-more"
                onClick={() => setFixedExpenses([...fixedExpenses, { name: "", amount: "" }])}
              >
                + adicionar mais
              </button>
            </div>
          </div>

          <button className="setup-btn" onClick={handleSaveSetup}>
            Continuar
          </button>
        </div>
    </div>

  );
}

export default App;
