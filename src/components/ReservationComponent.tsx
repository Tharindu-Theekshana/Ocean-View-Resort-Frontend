import { useEffect, useState } from "react"
import { getReservationsByUserId } from "../services/reservationService"
import { Reservation, tokenPayload } from "../const/interfaces";
import { jwtDecode } from "jwt-decode";
import {
  CalendarDays, BedDouble, MapPin, Phone, User,
  Loader2, Inbox, ChevronRight, DollarSign, FileText, Clock
} from "lucide-react";

const calcNights = (checkIn: string, checkOut: string) => {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric"
  });
};

const getStatus = (checkIn: string, checkOut: string) => {
  const now = new Date();
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (now < inDate) return { label: "Upcoming", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
  if (now >= inDate && now <= outDate) return { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
  return { label: "Completed", color: "text-slate-400", bg: "bg-slate-700/40 border-white/8" };
};

export default function ReservationComponent() {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<tokenPayload>(token) : null;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Reservation | null>(null);

  useEffect(() => {
    const getReservations = async () => {
      setLoading(true);
      try {
        const response = await getReservationsByUserId(decoded?.userId);
        setReservations(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getReservations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">

      <div className="max-w-5xl mx-auto px-6 lg:px-12 mb-12">
        <div className="flex items-center gap-2 text-amber-400/50 text-xs tracking-[0.3em] uppercase mb-4">
          <span>Ocean View Resort</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-400">My Reservations</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight">My Reservations</h1>
            <div className="w-12 h-px bg-gradient-to-r from-amber-400 to-transparent mt-3 mb-3" />
            <p className="text-slate-500 text-sm font-light">
              Welcome back, <span className="text-amber-400/80">{reservations[0]?.userDetail?.name }</span>. Here are all your bookings.
            </p>
          </div>
          {!loading && (
            <p className="text-slate-600 text-xs tracking-widest uppercase">
              {reservations.length} {reservations.length === 1 ? "reservation" : "reservations"}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12">

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-500 text-sm tracking-widest uppercase">Loading your reservations...</p>
          </div>
        )}

        {!loading && reservations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 rounded-sm bg-slate-800 border border-amber-500/15 flex items-center justify-center">
              <Inbox className="w-6 h-6 text-amber-400/40" />
            </div>
            <p className="text-slate-400 text-sm">You have no reservations yet.</p>
            <a href="" className="text-amber-400 text-xs tracking-widest uppercase hover:text-amber-300 transition-colors">
              Browse rooms →
            </a>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <div className="flex flex-col gap-4">
            {reservations.map((res) => {
              const nights = calcNights(res.checkInDate, res.checkOutDate);
              const status = getStatus(res.checkInDate, res.checkOutDate);
              return (
                <div key={res.id}
                  className="group bg-slate-900 border border-white/5 rounded-sm hover:border-amber-500/15 transition-all duration-300 overflow-hidden">

                  <div className="flex flex-col sm:flex-row">

                    <div className="w-full sm:w-1 bg-gradient-to-b from-amber-500/40 to-amber-500/10 flex-shrink-0" />

                    <div className="flex-1 p-5 flex flex-col sm:flex-row gap-5">

                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-sm bg-slate-800 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
                          <BedDouble className="w-5 h-5 text-amber-400/70" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-white text-sm font-medium">
                              Room {res.room.id.toString().padStart(3, "0")}
                            </span>
                            <span className="text-[10px] tracking-[0.15em] uppercase text-slate-500 bg-slate-800 border border-white/5 px-2 py-0.5 rounded-sm">
                              {res.room.type}
                            </span>
                            <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm border ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs font-light truncate">{res.room.description}</p>

                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5 text-amber-400/50" />
                              <span className="text-slate-400 text-xs">{formatDate(res.checkInDate)}</span>
                            </div>
                            <ChevronRight className="w-3 h-3 text-slate-600" />
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5 text-amber-400/50" />
                              <span className="text-slate-400 text-xs">{formatDate(res.checkOutDate)}</span>
                            </div>
                            <span className="flex items-center gap-1 text-[10px] text-slate-600 tracking-wide">
                              <Clock className="w-3 h-3" />
                              {nights} {nights === 1 ? "night" : "nights"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3 sm:min-w-[120px]">
                        <div className="text-right">
                          {res.netTotal != null ? (
                            <>
                              <div className="flex items-baseline gap-0.5 justify-end">
                                <span className="text-xs text-amber-400/60">Rs.</span>
                                <span className="text-xl font-light text-amber-400">{res.netTotal.toFixed(2)}</span>
                              </div>
                              <p className="text-[10px] text-slate-600 tracking-wide">total</p>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic">Pending</span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelected(res)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/25 text-amber-400 text-[10px] tracking-widest uppercase rounded-sm hover:bg-amber-500/10 hover:border-amber-400/40 transition-all duration-200 bg-transparent cursor-pointer whitespace-nowrap">
                          <FileText className="w-3 h-3" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                <p className="text-white text-sm font-medium">Reservation #{selected.id.toString().padStart(4, "0")}</p>
                <p className="text-amber-400/50 text-[10px] tracking-widest uppercase mt-0.5">Booking Details</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-7 h-7 bg-slate-800 border border-white/8 rounded-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xs">
                ✕
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
                  <BedDouble className="w-4 h-4 text-amber-400/60" strokeWidth={1.5} />
                  <div>
                    <p className="text-white text-sm font-medium">Room {selected.room.id.toString().padStart(3, "0")} — {selected.room.type}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{selected.room.description}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-amber-400 text-sm font-light">Rs.{selected.room.price}</p>
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
                    { icon: User, label: selected.userDetail.name },
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
                {selected.netTotal != null ? (
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-amber-400/60">Rs.</span>
                    <span className="text-xl font-light text-amber-400">{selected.netTotal.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs italic">Not calculated yet</span>
                )}
              </div>

              <button onClick={() => setSelected(null)}
                className="w-full py-2.5 border border-white/10 text-slate-400 text-xs tracking-widest uppercase rounded-sm hover:border-white/20 hover:text-white transition-colors bg-transparent cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}