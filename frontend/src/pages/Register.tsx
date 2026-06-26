import { useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        { username, email, password }
      );

      setSuccess(true);
      setMessage(response.data.message || "Account created successfully.");
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="mb-7">
        <div className="mb-4 inline-flex rounded-md border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
          Get started
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
          Create your account
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Set up your workspace and start improving your career materials.
        </p>
      </div>

      {message && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium ${
            success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {success && <CheckCircle2 size={17} />}
          {message}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <AuthField
          id="register-name"
          label="Username"
          icon={<User size={18} />}
          type="text"
          autoComplete="username"
          placeholder="How should we address you?"
          value={username}
          onChange={setUsername}
        />
        <AuthField
          id="register-email"
          label="Email address"
          icon={<Mail size={18} />}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />

        <div>
          <label htmlFor="register-password" className="block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div className="relative mt-2">
            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
          {loading ? "Creating account" : success ? "Account created" : "Create account"}
          {!loading && !success && <ArrowRight size={17} />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-violet-700 hover:text-violet-800">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthField({
  id,
  label,
  icon,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative mt-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </div>
    </div>
  );
}
