import { useState } from "react";
import "./App.css";

// ── CategoriesView ─────────────────────────────────────────
const CAT_META: Record<string, {label: string; icon: string; color: string}> = {
  housing:       { label: "Moradia",        icon: "🏠", color: "#7C3AED" },
  food:          { label: "Alimentação",    icon: "🍔", color: "#EC4899" },
  transport:     { label: "Transporte",     icon: "🚗", color: "#F97316" },
  entertainment: { label: "Lazer",          icon: "🎬", color: "#8B5CF6" },
  health:        { label: "Saúde",          icon: "💊", color: "#EF4444" },
  other:         { label: "Outros",         icon: "📦", color: "#F59E0B" },
};

function CategoriesView({
  expenses,
  totalFixed,
  storedIncome,
  currency,
}: {
  expenses: {id:number;amount:number;date:string;description:string;category:string}[];
  totalFixed: number;
  storedIncome: number;
  currency: string;
}) {
  // Group variable expenses by category
  const catTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  // Add fixed expenses as housing
  if (totalFixed > 0) {
    catTotals["housing"] = (catTotals["housing"] || 0) + totalFixed;
  }

  const grandTotal = Object.values(catTotals).reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...Object.values(catTotals), 1);

  // Sort by amount desc
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="cat-wrap">
      {/* Stacked bar */}
      <div className="cat-stacked-bar">
        {sorted.map(([key, val]) => {
          const meta = CAT_META[key] || { color: "#666" };
          return (
            <div
              key={key}
              className="cat-stacked-seg"
              style={{ flex: val, background: meta.color }}
            />
          );
        })}
      </div>

      {/* List */}
      {sorted.map(([key, val]) => {
        const meta = CAT_META[key] || { label: key, icon: "📦", color: "#666" };
        const pct = grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0;
        const barW = grandTotal > 0 ? (val / maxVal) * 100 : 0;
        return (
          <div className="cat-row" key={key}>
            <div className="cat-row-top">
              <span className="cat-dot" style={{ background: meta.color }} />
              <span className="cat-name">{meta.icon} {meta.label}</span>
              <span className="cat-amount">{currency} {val.toFixed(2)}</span>
              <span className="cat-pct">{pct}%</span>
            </div>
            <div className="cat-bar-track">
              <div className="cat-bar-fill" style={{ width: `${barW}%`, background: meta.color }} />
            </div>
          </div>
        );
      })}

      {/* Total footer */}
      <div className="cat-footer">
        <div>
          <p className="cat-footer-label">TOTAL</p>
          <p className="cat-footer-total">{currency} {grandTotal.toFixed(2)}</p>
        </div>
        <div className="cat-budget-pill">
          <p className="cat-budget-label">ORÇAMENTO</p>
          <p className="cat-budget-val">{currency} {storedIncome.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<
    "splash" | "login" | "register" | "setup" | "dashboard" | "add" | "transactions" | "settings" | "settings-profile" | "settings-notifications" | "settings-security" | "settings-currency" | "settings-start-month" | "settings-budget" | "settings-export" | "settings-categories"
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
  const [expenses, setExpenses] = useState<{id:number;amount:number;date:string;description:string;category:string;createdAt?:string}[]>(
    () => JSON.parse(localStorage.getItem("lume_expenses") || "[]")
  );
  const [dashTab, setDashTab] = useState<"overview" | "categories">("overview");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
  });
  const [txFilterMonth, setTxFilterMonth] = useState<string>("");
  const [txFilterCat, setTxFilterCat] = useState<string>("");
  const [currency] = useState<string>(() => localStorage.getItem("lume_currency") || "R$");
  const [budgetAlertPct] = useState<number>(() => Number(localStorage.getItem("lume_budget_pct") || "80"));
  const [budgetAlertDismissed, setBudgetAlertDismissed] = useState(false);
  const [txType, setTxType] = useState<"expense" | "income">("expense");
  const [monthlyBudget] = useState<string>(() => localStorage.getItem("lume_monthly_budget") || "");
  const [startDay] = useState<number>(() => Number(localStorage.getItem("lume_start_day") || "1"));
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
    setExpenses(expenses);
    setAmount("");
    setDescription("");
    setCategory("");
    setDate("");
    setScreen("transactions");
  };

  // ── Dados do dashboard ──────────────────
  const storedIncome = parseFloat(localStorage.getItem("lume_income") || "0");
  const storedFixed: { name: string; amount: string }[] = JSON.parse(localStorage.getItem("lume_fixed") || "[]");
  const storedExpenses = expenses;

  const now = new Date();
  // Build last 9 months for chart
  const chartMonths = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (8 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("pt-BR", { month: "short" }).replace(".", ""),
    };
  });
  const totalFixed = storedFixed.reduce((acc, f) => acc + parseFloat(f.amount || "0"), 0);
  // Per-month variable spend from expenses
  const monthVariableSpend = (monthKey: string) =>
    storedExpenses.filter((e) => e.date.startsWith(monthKey)).reduce((acc, e) => acc + e.amount, 0);
  const chartMax = Math.max(...chartMonths.map((m) => monthVariableSpend(m.key) + totalFixed), 1);

  // Selected month data
  const selectedExpenses = storedExpenses.filter((e) => e.date.startsWith(selectedMonth));
  const selectedVariable = selectedExpenses.reduce((acc, e) => acc + e.amount, 0);
  const selectedTotal = totalFixed + selectedVariable;
  const remaining = storedIncome - selectedTotal;
  const savedPct = storedIncome > 0 ? ((remaining / storedIncome) * 100).toFixed(1) : "0";
  const biggestExpense = selectedExpenses.length > 0
    ? selectedExpenses.reduce((max, e) => e.amount > max.amount ? e : max, selectedExpenses[0])
    : null;
  // Recent transactions (last 4, sorted by createdAt desc)
  const recentExpenses = [...storedExpenses]
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 4);
  const categoryIcon: Record<string, string> = {
    food: "🍔", transport: "🚗", housing: "🏠", health: "💊", entertainment: "🎬", other: "📦"
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
              <p className="dash-greeting">{(() => {
                const h = new Date().getHours();
                const gr = h < 12 ? "bom dia" : h < 18 ? "boa tarde" : "boa noite";
                const u = JSON.parse(localStorage.getItem("lume_user") || "{}");
                const firstName = (u.name || "").split(" ")[0];
                return firstName ? `${gr}, ${firstName}` : gr;
              })()}</p>
            </div>
          </div>
          <div className="dash-header-right">
            <div className="dash-live">
              <span className="dash-live-dot"></span>
              Live
            </div>
            <div className="dash-avatar" onClick={() => setScreen("settings")} style={{cursor:"pointer"}}>{(() => { const u = JSON.parse(localStorage.getItem("lume_user") || "{}"); const n = u.name || ""; return n.split(" ").slice(0,2).map((w: string) => w[0]).join("").toUpperCase() || "?"; })()}</div>
          </div>
        </div>
        <div className="dash-net-worth-card">
          <p className="dash-nw-label">SALDO DISPONÍVEL</p>
          <div className="dash-nw-value">
            <span className="dash-nw-main">{currency} {remaining.toFixed(2)}</span>
          </div>
          <p className="dash-nw-sub">Renda: {currency} {storedIncome.toFixed(2)}</p>
        </div>
        <div className="dash-cards-row">
          <div className="dash-card">
            <p className="dash-card-label">RENDA</p>
            <p className="dash-card-value">{currency} {storedIncome.toFixed(0)}</p>
            <p className="dash-card-change positive">mensal</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">GASTO</p>
            <p className="dash-card-value">R$ {selectedTotal.toFixed(0)}</p>
            <p className="dash-card-change negative">este mês</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">SOBROU</p>
            <p className="dash-card-value">{savedPct}%</p>
            <p className="dash-card-change goal">da renda</p>
          </div>
        </div>
        <div className="dash-tabs">
          <button className={`dash-tab ${dashTab === "overview" ? "active" : ""}`} onClick={() => setDashTab("overview")}>Overview</button>
          <button className="dash-tab" onClick={() => setScreen("transactions")}>Transactions</button>
          <button className={`dash-tab ${dashTab === "categories" ? "active" : ""}`} onClick={() => setDashTab("categories")}>Categories</button>
        </div>
        {dashTab === "categories" ? (
          <CategoriesView
            expenses={storedExpenses}
            totalFixed={totalFixed}
            storedIncome={storedIncome}
            currency={currency}
          />
        ) : null}
        <div className="dash-chart-card" style={{display: dashTab === "overview" ? undefined : "none"}}>
          <div className="dash-chart-header">
            <div>
              <p className="dash-chart-label">GASTO DO MÊS</p>
              <p className="dash-chart-value">R$ {selectedTotal.toFixed(2)}</p>
            </div>
            <span className="dash-chart-month-tag">
              {new Date(selectedMonth + "-01").toLocaleString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "")}
            </span>
          </div>
          <div className="dash-bars">
            {chartMonths.map((b) => {
              const spend = monthVariableSpend(b.key) + totalFixed;
              const heightPct = chartMax > 0 ? Math.max((spend / chartMax) * 100, 4) : 4;
              const isActive = b.key === selectedMonth;
              return (
                <div className="dash-bar-col" key={b.key} onClick={() => setSelectedMonth(b.key)} style={{cursor:"pointer"}}>
                  <div
                    className={`dash-bar ${isActive ? "active" : ""}`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <p className={`dash-bar-label ${isActive ? "active" : ""}`}>
                    {b.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="dash-bottom-cards" style={{display: dashTab === "overview" ? undefined : "none"}}>
          <div className="dash-bottom-card">
            <div className="dash-bottom-card-icon">
              {biggestExpense ? (categoryIcon[biggestExpense.category] || "📦") : "📦"}
            </div>
            <div className="dash-bottom-card-info">
              <p className="dash-bottom-card-label">MAIOR GASTO</p>
              <p className="dash-bottom-card-title">{biggestExpense ? biggestExpense.description : "Nenhum ainda"}</p>
              {biggestExpense && <p className="dash-bottom-card-value dash-expense-red">{currency} {biggestExpense.amount.toFixed(2)}</p>}
            </div>
          </div>
          <div className="dash-bottom-card">
            <div className="dash-bottom-card-info" style={{flex:1}}>
              <p className="dash-bottom-card-label">ORÇAMENTO RESTANTE</p>
              <p className={`dash-bottom-card-value dash-remaining-big ${remaining >= 0 ? "positive" : "negative"}`}>{currency} {remaining.toFixed(2)}</p>
              <div className="dash-progress-bar">
                <div className="dash-progress-fill" style={{width: `${Math.min(Math.max((remaining/storedIncome)*100,0),100)}%`}} />
              </div>
            </div>
          </div>
        </div>
        <div className="dash-recent-section" style={{display: dashTab === "overview" ? undefined : "none"}}>
          <div className="dash-recent-header">
            <span className="dash-recent-label">RECENTES</span>
            <button className="dash-recent-seeall" type="button" onClick={() => setScreen("transactions")}>Ver tudo →</button>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="dash-recent-empty">Nenhuma transação ainda</p>
          ) : (
            recentExpenses.map((e) => (
              <div className="dash-recent-item" key={e.id}>
                <div className="dash-recent-icon">{categoryIcon[e.category] || "📦"}</div>
                <div className="dash-recent-info">
                  <p className="dash-recent-name">{e.description}</p>
                  <p className="dash-recent-date">{new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR", {day:"2-digit",month:"short"})}</p>
                </div>
                <p className="dash-recent-amount">-R$ {e.amount.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
        {/* Budget alert toast */}
        {(() => {
          const pct = storedIncome > 0 ? (selectedTotal / storedIncome) * 100 : 0;
          if (pct >= budgetAlertPct && !budgetAlertDismissed && storedIncome > 0) {
            return (
              <div className="budget-toast">
                <span className="budget-toast-icon">⚠️</span>
                <div className="budget-toast-text">
                  <strong>Atenção!</strong> Você já usou {pct.toFixed(0)}% do orçamento este mês.
                </div>
                <button className="budget-toast-close" onClick={() => setBudgetAlertDismissed(true)}>✕</button>
              </div>
            );
          }
          return null;
        })()}
        <div className="bottom-nav">
          <button className={`nav-btn${dashTab === "overview" ? " active" : ""}`} type="button" onClick={() => setDashTab("overview")}>
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
          <button className={`nav-btn${dashTab === "categories" ? " active" : ""}`} type="button" onClick={() => setDashTab("categories")}>
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
            <span>Categorias</span>
          </button>
          <button className="nav-btn" type="button" onClick={() => setScreen("settings")}>
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
            <span>Config</span>
          </button>
        </div>
      </div>
      {/* ── Add ── */}
      <div
        className={`screen ${screen === "add" ? "" : "is-offscreen-right"}`}
        id="screen-add"
      >
        {/* Header */}
        <div className="add-header">
          <button className="add-back" type="button" onClick={() => { setScreen("dashboard"); setEditingId(null); setAmount(""); setDescription(""); setCategory(""); setDate(""); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="add-title">{editingId ? "Editar" : "Nova Transação"}</h1>
          <div style={{width:20}} />
        </div>

        {/* Expense / Income toggle */}
        <div className="tx-type-toggle">
          <button
            type="button"
            className={`tx-type-btn${txType === "expense" ? " active expense" : ""}`}
            onClick={() => setTxType("expense")}
          >
            <span className="tx-type-icon">↑</span> Despesa
          </button>
          <button
            type="button"
            className={`tx-type-btn${txType === "income" ? " active income" : ""}`}
            onClick={() => setTxType("income")}
          >
            <span className="tx-type-icon">↓</span> Receita
          </button>
        </div>

        {/* Large amount display */}
        <div className={`add-amount-hero ${txType === "income" ? "income" : "expense"}`}>
          <span className="add-amount-hero-symbol">{currency}</span>
          <input
            className="add-amount-hero-input"
            type="number"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Preview card — shows when category is selected */}
        {category && (() => {
          const cats: Record<string, {icon:string;label:string;color:string}> = {
            housing:       {icon:"🏠",label:"Moradia",     color:"#7C3AED"},
            food:          {icon:"🍔",label:"Alimentação", color:"#EC4899"},
            transport:     {icon:"🚗",label:"Transporte",  color:"#F97316"},
            entertainment: {icon:"🎬",label:"Lazer",       color:"#8B5CF6"},
            health:        {icon:"💊",label:"Saúde",       color:"#EF4444"},
            other:         {icon:"📦",label:"Outros",      color:"#F59E0B"},
          };
          const cat = cats[category];
          return (
            <div className="add-preview-card">
              <div className="add-preview-icon" style={{background: cat.color + "22"}}>
                {cat.icon}
              </div>
              <div className="add-preview-info">
                <span className="add-preview-label">{description || cat.label}</span>
                <span className="add-preview-sub">{cat.label} · {date || "sem data"}</span>
              </div>
              <span className={`add-preview-value ${txType}`}>
                {txType === "expense" ? "-" : "+"}{currency} {parseFloat(amount || "0").toFixed(2)}
              </span>
            </div>
          );
        })()}

        {/* Form */}
        <div className="add-form">
          <div className="add-field">
            <label className="add-label">Descrição</label>
            <input
              className="add-input"
              type="text"
              placeholder={txType === "expense" ? "Em que você gastou?" : "De onde veio essa receita?"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="add-field">
            <label className="add-label">Categoria</label>
            <div className="cat-grid">
              {[
                { key: "housing",       icon: "🏠", label: "Moradia",     color: "#7C3AED" },
                { key: "food",          icon: "🍔", label: "Alimentação", color: "#EC4899" },
                { key: "transport",     icon: "🚗", label: "Transporte",  color: "#F97316" },
                { key: "entertainment", icon: "🎬", label: "Lazer",       color: "#8B5CF6" },
                { key: "health",        icon: "💊", label: "Saúde",       color: "#EF4444" },
                { key: "other",         icon: "📦", label: "Outros",      color: "#F59E0B" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`cat-grid-btn${category === cat.key ? " selected" : ""}`}
                  style={category === cat.key ? { borderColor: cat.color, background: cat.color + "22" } : {}}
                  onClick={() => setCategory(cat.key)}
                >
                  <span className="cat-grid-icon">{cat.icon}</span>
                  <span className="cat-grid-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="add-field">
            <label className="add-label">Data</label>
            <input
              className="add-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <button
          className={`add-btn ${txType}`}
          type="button"
          onClick={handleSaveExpense}
        >
          {editingId ? "Salvar Alterações" : txType === "expense" ? "Registrar Despesa" : "Registrar Receita"}
        </button>
        <div style={{height:32}} />
      </div>
            {/* ── Transactions ── */}
      <div
        className={`screen ${screen === "transactions" ? "" : "is-offscreen-right"}`}
        id="screen-transactions"
      >
        <div className="tx-scroll">
        <div className="add-header">
          <button className="add-back" type="button" onClick={() => setScreen("dashboard")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="add-title">Histórico</h1>
          <div style={{ width: 20 }} />
        </div>

        {/* Filters */}
        {(() => {
          const txMonths = Array.from(new Set(expenses.map((e) => e.date.slice(0,7)))).sort().reverse();
          return (
            <div className="tx-filters">
              <select
                className="tx-filter-select"
                value={txFilterMonth}
                onChange={(e) => setTxFilterMonth(e.target.value)}
              >
                <option value="">Todos os meses</option>
                {txMonths.map((m) => {
                  const [y,mo] = m.split("-");
                  const label = new Date(Number(y), Number(mo)-1, 1).toLocaleString("pt-BR",{month:"long",year:"numeric"});
                  return <option key={m} value={m}>{label}</option>;
                })}
              </select>
              <select
                className="tx-filter-select"
                value={txFilterCat}
                onChange={(e) => setTxFilterCat(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                <option value="housing">🏠 Moradia</option>
                <option value="food">🍔 Alimentação</option>
                <option value="transport">🚗 Transporte</option>
                <option value="entertainment">🎬 Lazer</option>
                <option value="health">💊 Saúde</option>
                <option value="other">📦 Outros</option>
              </select>
            </div>
          );
        })()}

        <div className="tx-card">
          {(() => {
            const categoryIcon: Record<string, string> = {
              food: "🍔", transport: "🚗", housing: "🏠", health: "💊", entertainment: "🎬", other: "📦"
            };
            const categoryColor: Record<string, string> = {
              food: "#E85002", transport: "#3B82F6", housing: "#8B5CF6", health: "#10B981", entertainment: "#F59E0B", other: "#6B7280"
            };
            const catLabels: Record<string, string> = {
              food: "Alimentação", transport: "Transporte", housing: "Moradia",
              health: "Saúde", entertainment: "Lazer", other: "Outros"
            };
            const handleDelete = (id: number) => {
              const updated = expenses.filter((e) => e.id !== id);
              localStorage.setItem("lume_expenses", JSON.stringify(updated));
              setExpenses(updated);
            };
            const handleEdit = (e: typeof expenses[0]) => {
              setEditingId(e.id);
              setAmount(String(e.amount));
              setDescription(e.description);
              setCategory(e.category);
              setDate(e.date);
              setScreen("add");
            };
            const filtered = [...expenses]
              .filter((e) => !txFilterMonth || e.date.startsWith(txFilterMonth))
              .filter((e) => !txFilterCat || e.category === txFilterCat)
              .reverse();
            return (
              <>
                <div className="tx-card-header">
                  <span className="tx-card-label">TRANSAÇÕES</span>
                  <span className="tx-card-badge">{filtered.length} itens</span>
                </div>
                {filtered.length === 0 ? (
                  <div className="tx-empty-state">
                    <div className="tx-empty-icon">🔍</div>
                    <p className="tx-empty">Nenhuma transação encontrada.</p>
                    <p className="tx-empty-sub">Tente mudar os filtros ou adicione um novo gasto.</p>
                  </div>
                ) : (
                  filtered.map((e) => {
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
                          <p className="tx-date">{catLabels[e.category] || e.category} · {e.date}{timeStr ? " · " + timeStr : ""}</p>
                        </div>
                        <div className="tx-right">
                          <p className="tx-amount">{currency} {e.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                          <button className="tx-delete" onClick={() => handleDelete(e.id)}>✕</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            );
          })()}
        </div>
        </div>
        <div className="bottom-nav">
          <button className="nav-btn" type="button" onClick={() => { setScreen("dashboard"); setDashTab("overview"); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Home</span>
          </button>
          <button className="nav-btn active" type="button">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>Histórico</span>
          </button>
          <button className="nav-btn nav-add" type="button" onClick={() => setScreen("add")}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button className="nav-btn" type="button" onClick={() => { setScreen("dashboard"); setDashTab("categories"); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <span>Categorias</span>
          </button>
          <button className="nav-btn" type="button" onClick={() => setScreen("settings")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Config</span>
          </button>
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

      {/* ── Settings ── */}
      <div
        id="screen-settings"
        className={`screen ${screen === "settings" ? "" : ["settings-profile","settings-notifications","settings-security","settings-currency","settings-start-month","settings-budget","settings-export","settings-categories"].includes(screen) ? "is-offscreen-left" : "is-offscreen-right"}`}
      >
        <div className="settings-scroll">
          {/* Header */}
          <div className="settings-header">
            <button className="settings-back" type="button" onClick={() => setScreen("dashboard")}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="settings-title">Settings</span>
          </div>

          {/* Profile Card */}
          <div className="settings-profile-card">
            <div className="settings-avatar">
              {(() => {
                const u = JSON.parse(localStorage.getItem("lume_user") || "{}");
                return u.name ? u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0,2) : "CS";
              })()}
            </div>
            <div className="settings-profile-info">
              <div className="settings-profile-name">
                {(() => {
                  const u = JSON.parse(localStorage.getItem("lume_user") || "{}");
                  return u.name || "Carol Silva";
                })()}
              </div>
              <div className="settings-profile-email">
                {(() => {
                  const u = JSON.parse(localStorage.getItem("lume_user") || "{}");
                  return u.email || "carol@email.com";
                })()}
              </div>
            </div>
            <button className="settings-edit-btn" type="button" onClick={() => setScreen("settings-profile")}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* CONTA */}
          <div className="settings-section-label">CONTA</div>
          <div className="settings-group">
            <button className="settings-row" type="button" onClick={() => setScreen("settings-profile")}>
              <div className="settings-row-icon" style={{background:"#1a1a2e"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#818CF8" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <span className="settings-row-label">Perfil</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button" onClick={() => setScreen("settings-notifications")}>
              <div className="settings-row-icon" style={{background:"#1a2e1a"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <span className="settings-row-label">Notificações</span>
              <span className="settings-row-value">{budgetAlertPct}%</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button" onClick={() => setScreen("settings-security")}>
              <div className="settings-row-icon" style={{background:"#2e1a1a"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <span className="settings-row-label">Segurança</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* PREFERÊNCIAS */}
          <div className="settings-section-label">PREFERÊNCIAS</div>
          <div className="settings-group">
            <button className="settings-row" type="button" onClick={() => setScreen("settings-currency")}>
              <div className="settings-row-icon" style={{background:"#1a2e2a"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#2DD4BF" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="settings-row-label">Moeda</span>
              <span className="settings-row-value">{currency}</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button" onClick={() => setScreen("setup")}>
              <div className="settings-row-icon" style={{background:"#1e1a2e"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A78BFA" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <span className="settings-row-label">Renda e Gastos Fixos</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button" onClick={() => setScreen("settings-start-month")}>
              <div className="settings-row-icon" style={{background:"#1a2028"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <span className="settings-row-label">Início do Mês</span>
              <span className="settings-row-value">Dia {startDay}</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button" onClick={() => setScreen("settings-budget")}>
              <div className="settings-row-icon" style={{background:"#1a2816"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4ADE80" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <span className="settings-row-label">Orçamento Mensal</span>
              {monthlyBudget && <span className="settings-row-value">{currency} {parseFloat(monthlyBudget).toFixed(0)}</span>}
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* DADOS */}
          <div className="settings-section-label">DADOS</div>
          <div className="settings-group">
            <button className="settings-row" type="button" onClick={() => setScreen("settings-export")}>
              <div className="settings-row-icon" style={{background:"#1a2416"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#86EFAC" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <span className="settings-row-label">Exportar Dados</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button" onClick={() => setScreen("settings-categories")}>
              <div className="settings-row-icon" style={{background:"#2e1f0a"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#FCD34D" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <span className="settings-row-label">Categorias</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* SUPORTE */}
          <div className="settings-section-label">SUPORTE</div>
          <div className="settings-group">
            <button className="settings-row" type="button">
              <div className="settings-row-icon" style={{background:"#1a2230"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <span className="settings-row-label">Ajuda & FAQ</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button">
              <div className="settings-row-icon" style={{background:"#2e1a0a"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#FB923C" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <span className="settings-row-label">Avaliar App</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="settings-divider" />
            <button className="settings-row" type="button">
              <div className="settings-row-icon" style={{background:"#1a1a1a"}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <span className="settings-row-label">Política de Privacidade</span>
              <svg className="settings-row-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Version */}
          <div className="settings-version">Lume v1.0.0</div>

          {/* Sign Out */}
          <button
            className="settings-signout"
            type="button"
            onClick={() => {
              localStorage.clear();
              setScreen("login");
            }}
          >
            Sair da Conta
          </button>

          <div style={{height: "40px"}} />
        </div>

      </div>
    </div>
  );
}

export default App;
