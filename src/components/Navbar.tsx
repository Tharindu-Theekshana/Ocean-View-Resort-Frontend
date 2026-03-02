import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, BedSingle, BedDouble, Wind, Leaf, Waves, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roomOptions = [
  { label: "Single Room", description: "Perfect for solo travellers", icon: BedSingle, value: "SINGLE" },
  { label: "Double Room", description: "Ideal for couples and duos", icon: BedDouble, value: "DOUBLE" },
  { label: "AC Room", description: "Climate-controlled comfort", icon: Wind, value: "AC" },
  { label: "Non-AC Room", description: "Natural breezy ambiance", icon: Leaf, value: "NON_AC" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setRoomsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleOptionClick = (value: any) => {
    setRoomsOpen(false);
    navigate("/rooms", { state: { roomType: value } });
  }

  const handleLogout = () => {
    localStorage.clear();
    alert("You have been logged out.");
    navigate("/");
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-amber-500/10" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between py-4 lg:py-5">

          <a href="/" className="flex items-center gap-3 group select-none">
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow duration-300">
              <Waves className="w-5 h-5 text-slate-900" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-semibold tracking-wide text-lg">Ocean View</span>
              <span className="text-amber-400/70 text-[10px] tracking-[0.25em] uppercase font-light">Resort & Spa</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">

            <a href="/" className="relative text-slate-300 hover:text-white text-sm tracking-widest uppercase font-medium transition-colors duration-200 group py-1">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-full transition-all duration-300" />
            </a>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRoomsOpen(!roomsOpen)}
                className={`flex items-center gap-1.5 text-sm tracking-widest uppercase font-medium transition-colors duration-200 group py-1 relative bg-transparent border-none cursor-pointer ${
                  roomsOpen ? "text-amber-400" : "text-slate-300 hover:text-white"
                }`}
              >
                Rooms
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${roomsOpen ? "rotate-180" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300 ${roomsOpen ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>

              <div className={`absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-72 transition-all duration-300 ${
                roomsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
              }`}>
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-l border-t border-amber-500/20 rotate-45" />
                <div className="bg-slate-800 border border-amber-500/15 rounded-sm overflow-hidden shadow-2xl shadow-black/50">
                  <div className="px-4 py-2.5 border-b border-white/5 bg-slate-900/50">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/50 font-medium">Accommodations</p>
                  </div>
                  {roomOptions.map((room, i) => {
                    const Icon = room.icon;
                    return (
                      <div key={room.label}  onClick={() => handleOptionClick(room.value)}
                        className={`flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/5 transition-colors duration-150 group/item ${
                          i < roomOptions.length - 1 ? "border-b border-white/5" : ""
                        }`}>
                        <div className="w-9 h-9 rounded-sm bg-slate-700/70 border border-amber-500/15 flex items-center justify-center flex-shrink-0 group-hover/item:bg-amber-500/15 group-hover/item:border-amber-500/30 transition-all duration-200">
                          <Icon className="w-4 h-4 text-amber-400/70 group-hover/item:text-amber-400 transition-colors duration-200" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-200 group-hover/item:text-white font-medium tracking-wide transition-colors duration-200">{room.label}</p>
                          <p className="text-xs text-slate-500 group-hover/item:text-slate-400 mt-0.5 transition-colors duration-200">{room.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isLoggedIn ? 
              <button onClick={() => handleLogout()} className="flex items-center gap-2 text-sm tracking-widest uppercase font-medium px-5 py-2 border border-amber-500/40 text-amber-400 hover:text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-300 rounded-sm group cursor-pointer bg-transparent">
                <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                Logout
              </button> :
              <a href="/login">
                <button className="flex items-center gap-2 text-sm tracking-widest uppercase font-medium px-5 py-2 border border-amber-500/40 text-amber-400 hover:text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-300 rounded-sm group cursor-pointer bg-transparent">
                    <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    Login
                </button>
               </a>
            }  
          </div>

          <button className="md:hidden text-slate-300 hover:text-amber-400 transition-colors duration-200 p-1 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-slate-900/98 backdrop-blur-xl border-t border-amber-500/10 ${
        mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-6 py-4 flex flex-col gap-1">

          <a href="/" onClick={() => setMobileOpen(false)}
            className="text-slate-300 hover:text-white text-sm tracking-widest uppercase font-medium py-3.5 border-b border-white/5 transition-colors duration-200">
            Home
          </a>

          <div className="border-b border-white/5">
            <button onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
              className="w-full flex items-center justify-between text-slate-300 hover:text-white text-sm tracking-widest uppercase font-medium py-3.5 transition-colors duration-200 bg-transparent border-none cursor-pointer">
              Rooms
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileRoomsOpen ? "rotate-180 text-amber-400" : ""}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${mobileRoomsOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pb-3 pl-2 flex flex-col gap-1">
                {roomOptions.map((room) => {
                  const Icon = room.icon;
                  return (
                    <div key={room.label}
                      onClick={() => { setMobileOpen(false); setMobileRoomsOpen(false); handleOptionClick(room.value);}}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-white/5 transition-colors duration-150 group/m">
                      <div className="w-8 h-8 rounded-sm bg-slate-800 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-amber-400/70 group-hover/m:text-amber-400 transition-colors" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 group-hover/m:text-white font-medium transition-colors">{room.label}</p>
                        <p className="text-xs text-slate-600 group-hover/m:text-slate-400 transition-colors">{room.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 pb-1">
            <a href="/login" onClick={() => setMobileOpen(false)}>
              <button className="w-full flex items-center justify-center gap-2 text-sm tracking-widest uppercase font-medium px-5 py-3 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all duration-300 rounded-sm cursor-pointer bg-transparent">
                <LogIn className="w-4 h-4" />
                Login
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}