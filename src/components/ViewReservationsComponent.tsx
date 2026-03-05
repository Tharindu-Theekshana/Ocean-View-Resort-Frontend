import { useEffect, useState } from "react"
import { getAllReservations, getReservationBill } from "../services/reservationService"
import {
  BedDouble, CalendarDays, ChevronRight, Clock, DollarSign,
  FileText, Loader2, Inbox, User, Phone, MapPin, Printer,
  Search, X
} from "lucide-react";

interface UserInfo {
  id: number;
  username: string;
}

interface UserDetail {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  user: UserInfo;
}

interface Room {
  id: number;
  type: string;
  price: number;
  description: string;
  imagePath: string;
}

interface Reservation {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  netTotal: number | null;
  userDetail: UserDetail;
  room: Room;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

const calcNights = (checkIn: string, checkOut: string) => {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const getStatus = (checkIn: string, checkOut: string) => {
  const now = new Date();
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (now < inDate) return { label: "Upcoming",color:"text-amber-400",bg:"bg-amber-500/10 border-amber-500/20"};
  if (now >= inDate && now <= outDate) return { label:"Active",color:"text-emerald-400",bg:"bg-emerald-500/10 border-emerald-500/20"};
  return { label:"Completed",color:"text-slate-400",bg:"bg-slate-700/40 border-white/8"};
};

export default function ViewReservationsComponent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filtered, setFiltered] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await getAllReservations();
        setReservations(response ?? []);
        setFiltered(response ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    let result = [...reservations];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.userDetail.name.toLowerCase().includes(q) ||
        r.userDetail.user.username.toLowerCase().includes(q) ||
        r.room.type.toLowerCase().includes(q) ||
        r.id.toString().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter((r) => getStatus(r.checkInDate, r.checkOutDate).label === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, reservations]);

  const handlePrintBill = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try{
        const data = await getReservationBill(id);

        const blob = new Blob([data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        window.open(url, "_blank");

    }catch(e){
        alert("Failed to generate bill. Please try again.");
    }
  };

  const STATUS_FILTERS = ["ALL", "Upcoming", "Active", "Completed"];

  return (
    <div className="flex-1 overflow-auto bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">

        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400/40 text-xs tracking-[0.3em] uppercase mb-3">
            <span>Ocean View Resort</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400/70">All Reservations</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light text-white">All Reservations</h1>
              <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent mt-2 mb-2" />
              <p className="text-slate-500 text-xs font-light">Manage and view all guest reservations.</p>
            </div>
            {!loading && (
              <p className="text-slate-600 text-xs tracking-widest uppercase flex-shrink-0">
                {filtered.length} of {reservations.length} reservations
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by guest, room type, or ID..."
              className="w-full bg-slate-900 border border-white/8 rounded-sm pl-9 pr-9 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer bg-transparent border-none">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {STATUS_FILTERS.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-sm text-xs font-medium tracking-wide border transition-all duration-200 cursor-pointer ${
                  statusFilter === s
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                    : "bg-transparent border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-500 text-sm tracking-widest uppercase">Loading reservations...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 rounded-sm bg-slate-800 border border-amber-500/15 flex items-center justify-center">
              <Inbox className="w-6 h-6 text-amber-400/40" />
            </div>
            <p className="text-slate-400 text-sm">No reservations found.</p>
            {(search || statusFilter !== "ALL") && (
              <button onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
                className="text-amber-400/60 text-xs hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none">
                Clear filters →
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="bg-slate-900 border border-white/5 rounded-sm overflow-hidden">

            <div className="hidden lg:grid grid-cols-13 gap-4 px-5 py-3 border-b border-white/5 bg-slate-800/30">
              {["ID", "Guest", "Room", "Check In", "Check Out", "Nights", "Total", "Status", "Bill"].map((h, i) => (
                <div key={i} className={`text-[9px] tracking-[0.25em] uppercase text-slate-600 font-medium ${
                  i === 0 ? "col-span-1" :
                  i === 1 ? "col-span-2" :
                  i === 2 ? "col-span-2" :
                  i === 3 ? "col-span-2" :
                  i === 4 ? "col-span-2" :
                  i === 5 ? "col-span-1" :
                  i === 6 ? "col-span-1" :
                  i === 7 ? "col-span-1" : "col-span-1 text-right"
                }`}>{h}</div>
              ))}
            </div>

            <div className="divide-y divide-white/4">
              {filtered.map((res) => {
                const nights = calcNights(res.checkInDate, res.checkOutDate);
                const status = getStatus(res.checkInDate, res.checkOutDate);
                return (
                  <div key={res.id}
                    onClick={() => setSelected(res)}
                    className="grid grid-cols-2 lg:grid-cols-13 gap-4 px-5 py-4 hover:bg-white/2 transition-colors cursor-pointer group items-center">

                    <div className="col-span-1">
                      <span className="text-slate-500 text-xs font-mono">
                        #{res.id.toString().padStart(4, "0")}
                      </span>
                    </div>

                    <div className="col-span-1 lg:col-span-2 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{res.userDetail.name}</p>
                    </div>

                    <div className="col-span-1 lg:col-span-2 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="w-3 h-3 text-amber-400/50 flex-shrink-0" strokeWidth={1.5} />
                        <p className="text-slate-300 text-xs truncate">Room {res.room.id.toString().padStart(3, "0")}</p>
                      </div>
                      <p className="text-slate-500 text-[10px] ml-4.5">{res.room.type}</p>
                    </div>

                    <div className="col-span-1 lg:col-span-2 hidden lg:block">
                      <p className="text-slate-400 text-xs">{formatDate(res.checkInDate)}</p>
                    </div>

                    <div className="col-span-1 lg:col-span-2 hidden lg:block">
                      <p className="text-slate-400 text-xs">{formatDate(res.checkOutDate)}</p>
                    </div>

                    <div className="hidden lg:flex items-center gap-1 col-span-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span className="text-slate-500 text-xs">{nights}n</span>
                    </div>

                    <div className="col-span-1 hidden lg:block">
                      {res.netTotal != null
                        ? <span className="text-amber-400 text-xs font-light">Rs.{res.netTotal.toFixed(0)}</span>
                        : <span className="text-slate-600 text-xs italic">—</span>
                      }
                    </div>

                    <div className="col-span-1 hidden lg:block">
                      <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-2">
                      <span className={`lg:hidden text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                      <button
                        onClick={(e) => handlePrintBill(e, res.id)}
                        title="Print Bill"
                        className="w-7 h-7 flex items-center justify-center rounded-sm border border-white/8 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/8 transition-all duration-200 cursor-pointer bg-transparent flex-shrink-0">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="bg-slate-900 border border-amber-500/15 rounded-sm w-full max-w-md shadow-2xl shadow-black/60 overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <p className="text-white text-sm font-medium">
                  Reservation #{selected.id.toString().padStart(4, "0")}
                </p>
                <p className="text-amber-400/50 text-[10px] tracking-widest uppercase mt-0.5">Booking Details</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-7 h-7 bg-slate-800 border border-white/8 rounded-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">

              {(() => {
                const s = getStatus(selected.checkInDate, selected.checkOutDate);
                return (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-sm border ${s.bg}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${s.color.replace("text-", "bg-")}`} />
                    <span className={`text-xs font-medium ${s.color}`}>{s.label} Reservation</span>
                  </div>
                );
              })()}

              <div className="flex flex-col gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Room</p>
                <div className="flex items-center gap-3 bg-slate-800/50 border border-white/5 rounded-sm px-4 py-3">
                  <BedDouble className="w-4 h-4 text-amber-400/60 flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      Room {selected.room.id.toString().padStart(3, "0")} — {selected.room.type}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{selected.room.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-amber-400 text-sm">Rs.{selected.room.price}</p>
                    <p className="text-slate-600 text-[10px]">/ night</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Stay Duration</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-800/50 border border-white/5 rounded-sm px-3 py-2.5 text-center">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">Check In</p>
                    <p className="text-white text-xs font-medium">{formatDate(selected.checkInDate)}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-white/5 rounded-sm px-3 py-2.5 text-center flex flex-col items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-amber-400/50 mb-1" />
                    <p className="text-amber-400 text-xs font-medium">
                      {calcNights(selected.checkInDate, selected.checkOutDate)}N
                    </p>
                  </div>
                  <div className="bg-slate-800/50 border border-white/5 rounded-sm px-3 py-2.5 text-center">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">Check Out</p>
                    <p className="text-white text-xs font-medium">{formatDate(selected.checkOutDate)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Guest</p>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: User,  label: selected.userDetail.name },
                    { icon: Phone, label: selected.userDetail.phoneNumber },
                    { icon: MapPin, label: selected.userDetail.address },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <Icon className="w-3.5 h-3.5 text-amber-400/40 flex-shrink-0" strokeWidth={1.5} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-800/60 border border-amber-500/10 rounded-sm px-4 py-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400/50" />
                  Total Charged
                </div>
                {selected.netTotal != null
                  ? <div className="flex items-baseline gap-0.5">
                      <span className="text-xs text-amber-400/60">Rs.</span>
                      <span className="text-xl font-light text-amber-400">{selected.netTotal.toFixed(2)}</span>
                    </div>
                  : <span className="text-slate-500 text-xs italic">Not calculated yet</span>
                }
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-white/10 text-slate-400 text-xs tracking-widest uppercase rounded-sm hover:border-white/20 hover:text-white transition-colors bg-transparent cursor-pointer">
                  Close
                </button>
                <button
                  onClick={(e) => { handlePrintBill(e, selected.id); setSelected(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 cursor-pointer border-none">
                  <Printer className="w-3.5 h-3.5" />
                  Print Bill
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}