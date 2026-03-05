import { use, useEffect, useState } from "react";
import {
  LayoutDashboard, CalendarPlus, CalendarDays,
  UserPlus, LogOut, Waves, ChevronRight, Menu, X, BedDouble, HelpCircle
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { tokenPayload } from "../const/interfaces";

const navItems = [
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    key: "/create-reservation",
    label: "Create Reservation",
    icon: CalendarPlus,
    description: "Book a new room",
  },
  {
    key: "/view-reservations",
    label: "View Reservations",
    icon: CalendarDays,
    description: "All bookings",
  },
  {
    key: "/create-user",
    label: "Create Users",
    icon: UserPlus,
    description: "Add a new account",
  },
  {
    key: "/add-room",       
    label: "Add Room",
    icon: BedDouble,
    description: "Register a new room",
  },
  {
    key: "/help",      
    label: "Help",
    icon: HelpCircle,
    description: "Support & guidance",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState<String>();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decode = jwtDecode<tokenPayload>(token);
      setUsername(decode.name);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    alert("You have been logged out.");
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/5 ${collapsed ? "justify-center px-3" : ""}`}>
        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
          <Waves className="w-4 h-4 text-slate-900" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none overflow-hidden">
            <span className="text-white text-sm font-semibold tracking-wide truncate">Ocean View</span>
            <span className="text-amber-400/50 text-[9px] tracking-[0.25em] uppercase mt-0.5">Resort & Spa</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon, description }) => {
          const isActive = location.pathname === key;
          return (
            <button
              key={key}
              onClick={() => { navigate(key); setMobileOpen(false); }}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 rounded-sm transition-all duration-200 cursor-pointer border-none group relative
                ${collapsed ? "justify-center px-0 py-3" : "px-3 py-3"}
                ${isActive
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-transparent border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-r-full" />
              )}

              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"}`}
                strokeWidth={1.75} />

              {!collapsed && (
                <div className="flex-1 text-left overflow-hidden">
                  <p className={`text-xs font-medium tracking-wide truncate ${isActive ? "text-amber-400" : ""}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5 group-hover:text-slate-500 transition-colors">
                    {description}
                  </p>
                </div>
              )}

              {!collapsed && isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-amber-400/50 flex-shrink-0" />
              )}

              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-sm text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl">
                  {label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-white/10 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5 flex flex-col gap-2">

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-800/50 border border-white/5 rounded-sm">
            <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium uppercase">
                {username?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-xs font-medium truncate">{username}</p>
              <p className="text-slate-500 text-[10px] truncate">Logged in</p>
            </div>
          </div>
        )}

        <button
          onClick={()=>handleLogout()}
          title={collapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border border-transparent text-slate-500 hover:text-red-400 hover:bg-red-500/8 hover:border-red-500/15 transition-all duration-200 cursor-pointer bg-transparent group relative
            ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-red-400" strokeWidth={1.75} />
          {!collapsed && (
            <span className="text-xs font-medium tracking-wide">Sign Out</span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-sm text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl">
              Sign Out
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-white/10 rotate-45" />
            </div>
          )}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center py-3 border-t border-white/5 text-slate-600 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-x-0 border-b-0 w-full"
      >
        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-slate-900 border border-white/10 rounded-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <Menu className="w-4 h-4" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 left-0 h-full w-64 bg-slate-900 border-r border-white/5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 bg-slate-800 border border-white/8 rounded-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <aside className={`hidden lg:flex flex-col h-screen bg-slate-900 border-r border-white/5 sticky top-0 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarContent />
      </aside>
    </>
  );
}