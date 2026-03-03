import { useState } from "react";
import {
  Eye, EyeOff, User, Lock, Phone, MapPin, UserPlus,
  LogIn, Waves, Loader2
} from "lucide-react";
import { login, register } from "../services/authService";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "register";

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  address: string;
  phoneNumber: string;
}

interface FieldProps {
  label: string;
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  rightEl?: React.ReactNode;
}

function Field({ label, icon: Icon, type = "text", value, onChange, error, placeholder, rightEl }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-amber-400/60 font-medium">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-800/60 border rounded-sm px-3 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none transition-colors duration-200 ${
            error ? "border-red-500/40 focus:border-red-400/60" : "border-white/8 focus:border-amber-500/40"
          } ${rightEl ? "pr-10" : ""}`}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      {error && <p className="text-red-400 text-[11px]">{error}</p>}
    </div>
  );
}

export default function LoginComponent() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: "", password: "", confirmPassword: "",
    name: "", address: "", phoneNumber: "",
  });

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginForm.username) e.username = "Please enter your username.";
    if (!loginForm.password) e.password = "Please enter your password.";
    return e;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!registerForm.name) e.name = "Name is required for your reservation.";
    if (!registerForm.username) e.username = "Pick a username for your account.";
    if (!registerForm.phoneNumber) e.phoneNumber = "We'll use this to confirm your booking.";
    if (!registerForm.address) e.address = "We need this for your reservation records.";
    if (!registerForm.password) e.password = "Choose a secure password.";
    else if (registerForm.password.length < 6) e.password = "Use at least 6 characters to keep your account safe.";
    if (registerForm.password !== registerForm.confirmPassword)
      e.confirmPassword = "Passwords don't match. Try again.";
    return e;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const response = await login(loginForm);
      if(response.token){
        localStorage.clear();
        localStorage.setItem('token', response.token);
        localStorage.setItem('isLoggedIn', "true");
        alert("Welcome to the ocean view resort!");
        setLoginForm({
            username: "", password: ""
        });
        navigate("/dashboard")

      }else{
        alert("Login failed. Please try again.");
      }
    } catch(e){
      alert("Login failed. Please try again.");
      console.error(e);
    }finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRegister();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = registerForm;
      const payload = { ...rest, role: "GUEST" };
      await register(payload); 
      alert("Registration successful! You can now log in with your new account.");
      switchMode("login");
      setRegisterForm({
        username: "", password: "", confirmPassword: "",
        name: "", address: "", phoneNumber: "",
      });
    } catch(e){
        alert("Registration failed. Please try again.");
        console.error(e);
    }finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/25 mb-4">
            <Waves className="w-6 h-6 text-slate-900" strokeWidth={2} />
          </div>
          <h1 className="text-white text-xl font-semibold tracking-wide">Ocean View</h1>
          <p className="text-amber-400/50 text-[10px] tracking-[0.3em] uppercase mt-0.5">Resort & Spa</p>
        </div>

        <div className="bg-slate-900 border border-white/6 rounded-sm shadow-2xl shadow-black/50 overflow-hidden">

          <div className="flex border-b border-white/6">
            {(["login", "register"] as Mode[]).map((m) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer border-none relative ${
                  mode === m ? "text-amber-400 bg-slate-800/50" : "text-slate-500 hover:text-slate-300 bg-transparent"
                }`}
              >
                {m === "login" ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {m === "login" ? "Sign In" : "Register"}
                {mode === m && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                )}
              </button>
            ))}
          </div>

          <div className="p-7">

            {mode === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <p className="text-white text-base font-light mb-1">Good to see you again 👋</p>
                  <p className="text-slate-500 text-xs font-light">Sign in to manage your reservations.</p>
                </div>

                <div className="h-px bg-white/5" />

                <Field
                  label="Username" icon={User}
                  value={loginForm.username}
                  onChange={(v) => setLoginForm({ ...loginForm, username: v })}
                  placeholder="Your username"
                  error={errors.username}
                />

                <Field
                  label="Password" icon={Lock}
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(v) => setLoginForm({ ...loginForm, password: v })}
                  placeholder="Your password"
                  error={errors.password}
                  rightEl={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <div className="flex justify-end">
                  <button type="button" className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing you in...</> : <><LogIn className="w-4 h-4" /> Sign In to My Account</>}
                </button>

                <p className="text-center text-xs text-slate-500">
                  New to Ocean View?{" "}
                  <button type="button" onClick={() => switchMode("register")}
                    className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-transparent border-none font-medium">
                    Create a free account →
                  </button>
                </p>
              </form>
            )}

            {mode === "register" && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <p className="text-white text-base font-light mb-1">Join Ocean View Resort ✨</p>
                  <p className="text-slate-500 text-xs font-light">Create your account and unlock seamless booking.</p>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex flex-col gap-3">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Personal Details</p>

                  <Field label="Full Name" icon={User}
                    value={registerForm.name}
                    onChange={(v) => setRegisterForm({ ...registerForm, name: v })}
                    placeholder="e.g. John Perera"
                    error={errors.name}
                  />
                  <Field label="Phone Number" icon={Phone}
                    value={registerForm.phoneNumber}
                    onChange={(v) => setRegisterForm({ ...registerForm, phoneNumber: v })}
                    placeholder="e.g. +94 77 123 4567"
                    error={errors.phoneNumber}
                  />
                  <Field label="Home Address" icon={MapPin}
                    value={registerForm.address}
                    onChange={(v) => setRegisterForm({ ...registerForm, address: v })}
                    placeholder="e.g. 12 Galle Road, Colombo"
                    error={errors.address}
                  />
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex flex-col gap-3">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Account Credentials</p>

                  <Field label="Username" icon={User}
                    value={registerForm.username}
                    onChange={(v) => setRegisterForm({ ...registerForm, username: v })}
                    placeholder="Choose a username"
                    error={errors.username}
                  />
                  <Field label="Password" icon={Lock}
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(v) => setRegisterForm({ ...registerForm, password: v })}
                    placeholder="Min. 6 characters"
                    error={errors.password}
                    rightEl={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  <Field label="Confirm Password" icon={Lock}
                    type={showConfirm ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(v) => setRegisterForm({ ...registerForm, confirmPassword: v })}
                    placeholder="Type it one more time"
                    error={errors.confirmPassword}
                    rightEl={
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating your account...</> : <><UserPlus className="w-4 h-4" /> Create My Account</>}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Already a member?{" "}
                  <button type="button" onClick={() => switchMode("login")}
                    className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-transparent border-none font-medium">
                    Sign in here →
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-[11px] mt-5 tracking-wide">
          © {new Date().getFullYear()} Ocean View Resort. All rights reserved.
        </p>
      </div>
    </div>
  );
}