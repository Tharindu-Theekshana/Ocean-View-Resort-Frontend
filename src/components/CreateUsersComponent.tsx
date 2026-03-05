import { useState } from "react";
import {
  User, MapPin, Phone, Lock, Shield,
  ChevronRight, UserPlus, Eye, EyeOff, ChevronDown
} from "lucide-react";
import { register } from "../services/authService";

interface CreateUserForm {
  role: string;
  name: string;
  address: string;
  phoneNumber: string;
  username: string;
  password: string;
}

const ROLES = [
  { value: "ADMIN", label: "Admin", description: "Full system access" },
  { value: "RECEPTIONIST", label: "Receptionist", description: "Reservations & guests" },
];

function Field({ label, icon: Icon, value, onChange, error, placeholder, type = "text", rightEl }: {
  label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; error?: string;
  placeholder?: string; type?: string; rightEl?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-amber-400/60 font-medium">
        <Icon className="w-3 h-3" />{label}
      </label>
      <div className="relative">
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-800/60 border rounded-sm px-3 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none transition-all duration-200 ${
            error
              ? "border-red-500/40 focus:border-red-400/60 bg-red-500/5"
              : value
              ? "border-amber-500/30 focus:border-amber-500/50"
              : "border-white/8 focus:border-amber-500/40"
          } ${rightEl ? "pr-10" : ""}`}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      {error && <p className="text-red-400/90 text-[11px] flex items-center gap-1"><span></span>{error}</p>}
    </div>
  );
}

export default function CreateUsersComponent() {
  const [form, setForm] = useState<CreateUserForm>({
    role: "", name: "", address: "",
    phoneNumber: "", username: "", password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [roleOpen, setRoleOpen] = useState(false);

  const set = (key: keyof CreateUserForm) => (v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.role) e.role = "Please select a role.";
    if (!form.name) e.name = "Name is required.";
    if (!form.address) e.address = "Address is required.";
    if (!form.phoneNumber) e.phoneNumber = "Phone number is required.";
    if (!form.username) e.username = "Username is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 5) e.password = "Use at least 5 characters.";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await register(form); 
  };

  const selectedRole = ROLES.find((r) => r.value === form.role);

  return (
    <div className="flex-1 overflow-auto bg-slate-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 lg:px-10 py-8">

        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400/40 text-xs tracking-[0.3em] uppercase mb-3">
            <span>Ocean View Resort</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400/70">Create User</span>
          </div>
          <h1 className="text-2xl font-light text-white">Create User</h1>
          <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent mt-2 mb-2" />
          <p className="text-slate-500 text-xs font-light">
            Add a new staff member to the system with the appropriate role and access level.
          </p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-sm overflow-hidden">

          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
            <UserPlus className="w-4 h-4 text-amber-400/70" strokeWidth={1.75} />
            <p className="text-white text-sm font-medium">New Staff Account</p>
          </div>

          <div className="p-6 flex flex-col gap-6">

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Access Role</p>
                <div className="flex-1 h-px bg-white/4" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <button key={role.value}
                    onClick={() => { set("role")(role.value); setRoleOpen(false); }}
                    className={`flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-sm border text-left transition-all duration-200 cursor-pointer ${
                      form.role === role.value
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-slate-800/40 border-white/8 hover:border-white/15 hover:bg-slate-800/60"
                    }`}>
                    <div className="flex items-center gap-2 w-full">
                      <Shield className={`w-3.5 h-3.5 flex-shrink-0 ${form.role === role.value ? "text-amber-400" : "text-slate-500"}`} strokeWidth={1.75} />
                      <span className={`text-xs font-medium tracking-wide ${form.role === role.value ? "text-amber-400" : "text-slate-300"}`}>
                        {role.label}
                      </span>
                      {form.role === role.value && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 pl-5">{role.description}</p>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-400/90 text-[11px] flex items-center gap-1"><span></span>{errors.role}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Personal Details</p>
                <div className="flex-1 h-px bg-white/4" />
              </div>

              <Field label="Full Name" icon={User}
                value={form.name} onChange={set("name")}
                placeholder="e.g. Kasun Perera"
                error={errors.name}
              />
              <Field label="Address" icon={MapPin}
                value={form.address} onChange={set("address")}
                placeholder="e.g. 12 Galle Road, Colombo"
                error={errors.address}
              />
              <Field label="Phone Number" icon={Phone}
                value={form.phoneNumber} onChange={set("phoneNumber")}
                placeholder="e.g. +94 77 123 4567"
                error={errors.phoneNumber}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Account Credentials</p>
                <div className="flex-1 h-px bg-white/4" />
              </div>

              <Field label="Username" icon={User}
                value={form.username} onChange={set("username")}
                placeholder="e.g. kasun_perera"
                error={errors.username}
              />
              <Field label="Password" icon={Lock}
                type={showPassword ? "text" : "password"}
                value={form.password} onChange={set("password")}
                placeholder="Min. 5 characters"
                error={errors.password}
                rightEl={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            {(form.name || form.role) && (
              <div className="flex items-center gap-3 bg-slate-800/40 border border-white/5 rounded-sm px-4 py-3">
                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-sm font-medium uppercase">
                    {form.name ? form.name.charAt(0) : "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{form.name || "—"}</p>
                  <p className="text-slate-500 text-[10px]">
                    {selectedRole ? selectedRole.label : "No role selected"} · {form.username || "no username"}
                  </p>
                </div>
                {selectedRole && (
                  <span className="text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm border text-amber-400 bg-amber-500/10 border-amber-500/20 flex-shrink-0">
                    {selectedRole.label}
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setForm({ role: "", name: "", address: "", phoneNumber: "", username: "", password: "" });
                  setErrors({});
                  setShowPassword(false);
                }}
                className="flex-1 py-2.5 border border-white/10 text-slate-400 text-xs tracking-widest uppercase rounded-sm hover:border-white/20 hover:text-white transition-colors bg-transparent cursor-pointer">
                Clear
              </button>
              <button onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 cursor-pointer border-none">
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}