import {
    CalendarDays, BedDouble, Users, DollarSign,
    Clock, Star, TrendingUp, Activity,
    ArrowUpRight, ArrowDownRight, ChevronRight
  } from "lucide-react";
  
  interface StatCardProps {
    label: string;
    value: string;
    icon: React.ElementType;
    trend?: string;
    trendUp?: boolean;
    sub?: string;
  }
  
  function StatCard({ label, value, icon: Icon, trend, trendUp, sub }: StatCardProps) {
    return (
      <div className="bg-slate-900 border border-white/5 rounded-sm p-5 hover:border-amber-500/15 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="w-9 h-9 rounded-sm bg-amber-500/10 border border-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/15 transition-colors">
            <Icon className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-[11px] font-medium ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
              {trendUp
                ? <ArrowUpRight className="w-3.5 h-3.5" />
                : <ArrowDownRight className="w-3.5 h-3.5" />
              }
              {trend}
            </div>
          )}
        </div>
        <p className="text-2xl font-light text-white mb-1">{value}</p>
        <p className="text-xs text-slate-500 tracking-wide">{label}</p>
        {sub && <p className="text-[10px] text-slate-600 mt-1">{sub}</p>}
      </div>
    );
  }
  
  const recentBookings = [
    { id: 1, guest: "Tharindu P.", room: "Room 003", type: "SINGLE", checkIn: "Apr 12", checkOut: "Apr 13", total: 8500,  status: "upcoming"  },
    { id: 2, guest: "Amara S.",    room: "Room 007", type: "DOUBLE", checkIn: "Apr 10", checkOut: "Apr 14", total: 34000, status: "active"    },
    { id: 3, guest: "Kasun R.",    room: "Room 001", type: "AC",     checkIn: "Mar 30", checkOut: "Mar 02", total: 20000, status: "completed" },
    { id: 4, guest: "Nimali W.",   room: "Room 005", type: "SINGLE", checkIn: "Apr 15", checkOut: "Apr 16", total: 8500,  status: "upcoming"  },
    { id: 5, guest: "Ruwan M.",    room: "Room 010", type: "NON-AC", checkIn: "Mar 01", checkOut: "Mar 03", total: 12000, status: "completed" },
  ];
  
  const roomOccupancy = [
    { type: "Single",  total: 10, occupied: 7 },
    { type: "Double",  total: 8,  occupied: 5 },
    { type: "AC",      total: 6,  occupied: 6 },
    { type: "Non-AC",  total: 4,  occupied: 2 },
  ];
  
  const statusStyle: Record<string, string> = {
    upcoming:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
    active:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    completed: "text-slate-400 bg-slate-700/40 border-white/8",
  };
  
  const totalRooms    = roomOccupancy.reduce((s, r) => s + r.total, 0);
  const totalOccupied = roomOccupancy.reduce((s, r) => s + r.occupied, 0);
  const overallPct    = Math.round((totalOccupied / totalRooms) * 100);
  
  export default function DashboardComponent() {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 flex flex-col gap-8">
  
          <div>
            <div className="flex items-center gap-2 text-amber-400/40 text-xs tracking-[0.3em] uppercase mb-3">
              <span>Ocean View Resort</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-amber-400/70">Dashboard</span>
            </div>
            <h1 className="text-2xl font-light text-white">Dashboard</h1>
            <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent mt-2 mb-2" />
            <p className="text-slate-500 text-xs font-light">
              Welcome back. Here's what's happening at Ocean View Resort today.
            </p>
          </div>
  
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total Reservations" value="128"
              icon={CalendarDays} trend="12%" trendUp
              sub="vs last month"
            />
            <StatCard
              label="Active Guests" value="24"
              icon={Users} trend="4%" trendUp
              sub="currently checked in"
            />
            <StatCard
              label="Monthly Revenue" value="Rs.6,84000"
              icon={DollarSign} trend="8%" trendUp
              sub="May 2026"
            />
            <StatCard
              label="Avg. Stay Duration" value="2.4 nights"
              icon={Clock} trend="0.3" trendUp={false}
              sub="per reservation"
            />
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  
            <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400/70" strokeWidth={1.75} />
                  <p className="text-white text-sm font-medium">Recent Bookings</p>
                </div>
                <button className="text-[10px] tracking-widest uppercase text-amber-400/50 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none">
                  View all →
                </button>
              </div>
              <div className="divide-y divide-white/4">
                {recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">
                    <div className="w-7 h-7 rounded-sm bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400/60" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{b.guest}</p>
                      <p className="text-slate-500 text-[10px] truncate">{b.room} · {b.type}</p>
                    </div>
                    <div className="text-center hidden sm:block flex-shrink-0">
                      <p className="text-slate-400 text-[10px]">{b.checkIn} → {b.checkOut}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-amber-400 text-xs font-light">Rs.{b.total}</p>
                    </div>
                    <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border flex-shrink-0 ${statusStyle[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="bg-slate-900 border border-white/5 rounded-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
                <BedDouble className="w-4 h-4 text-amber-400/70" strokeWidth={1.75} />
                <p className="text-white text-sm font-medium">Room Occupancy</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">
                {roomOccupancy.map(({ type, total, occupied }) => {
                  const pct = Math.round((occupied / total) * 100);
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400">{type}</span>
                        <span className="text-xs text-slate-500">{occupied}/{total}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct === 100 ? "bg-emerald-400" : pct >= 70 ? "bg-amber-400" : "bg-amber-400/50"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1">{pct}% occupied</p>
                    </div>
                  );
                })}
  
                <div className="mt-1 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Overall Occupancy</span>
                    <span className="text-amber-400 text-sm font-light">{overallPct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${overallPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Star,      label: "Guest Rating",          value: "4.8 / 5.0", sub: "Based on 312 reviews"   },
              { icon: TrendingUp, label: "This Week's Revenue",  value: "Rs.2,46000",     sub: "14 reservations"        },
              { icon: Users,     label: "Total Guests (April)",    value: "87",         sub: "↑ 9 from last month"    },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="bg-slate-900 border border-white/5 rounded-sm px-5 py-4 flex items-center gap-4 hover:border-amber-500/15 transition-all duration-300">
                <div className="w-9 h-9 rounded-sm bg-amber-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-white text-sm font-light">{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                  <p className="text-slate-600 text-[10px] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
  
        </div>
      </div>
    );
  }