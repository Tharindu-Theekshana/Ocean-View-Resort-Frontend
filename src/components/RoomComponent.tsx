import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getRoomsByCategory } from "../services/roomService";
import { BedDouble, ChevronRight, Loader2, Inbox, CalendarDays } from "lucide-react";
import { tokenPayload } from "../const/interfaces";
import { jwtDecode } from "jwt-decode";
import { makeReservation } from "../services/reservationService";

interface Room {
  id: number;
  type: string;
  price: number;
  description: string;
  image: string;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE: "Single Rooms",
  DOUBLE: "Double Rooms",
  AC: "AC Rooms",
  NON_AC: "Non-AC Rooms",
};

const ROOM_TYPE_DESCRIPTIONS: Record<string, string> = {
  SINGLE: "Intimate spaces crafted for the solo traveller seeking comfort and privacy.",
  DOUBLE: "Spacious retreats designed for two, with panoramic ocean views.",
  AC: "Climate-controlled sanctuaries ensuring perfect comfort year-round.",
  NON_AC: "Naturally ventilated rooms that breathe with the ocean breeze.",
};

export default function RoomComponent() {
  const location = useLocation();
  const { roomType } = location.state || {};
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dateError, setDateError] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<tokenPayload>(token) : null;

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calcNights();
  const total = selectedRoom ? (nights * selectedRoom.price).toFixed(2) : "0.00";

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    setDateError("");
    if (checkOut && val >= checkOut) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (val: string) => {
    if (val <= checkIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    setDateError("");
    setCheckOut(val);
  };

  const handleOpenModal = (room: Room) => {
    if(isLoggedIn){
        setSelectedRoom(room);
        setCheckIn("");
        setCheckOut("");
        setDateError("");
    }else{
        alert("Please log in to book a room.");
    }
  };

  const handleConfirm = async () => {
    if (!checkIn || !checkOut) {
      setDateError("Please select both check-in and check-out dates.");
      return;
    }
    const payload = {
        roomId: selectedRoom?.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        reservedByGuest: true,
        userId: decoded?.userId,
    }
    await makeReservation(payload);
    alert(`Booked Room ${selectedRoom?.id} from ${checkIn} to ${checkOut} for $${total}`);
    setSelectedRoom(null);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await getRoomsByCategory(roomType);
        setRooms(response);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [roomType]);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-14">
        <div className="flex items-center gap-2 text-amber-400/50 text-xs tracking-[0.3em] uppercase mb-4">
          <span>Ocean View Resort</span>
          <ChevronRight className="w-3 h-3" />
          <span>Rooms</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-400">{ROOM_TYPE_LABELS[roomType] ?? roomType}</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-light text-white tracking-tight">
              {ROOM_TYPE_LABELS[roomType] ?? roomType}
            </h1>
            <div className="w-12 h-px bg-gradient-to-r from-amber-400 to-transparent mt-3 mb-4" />
            <p className="text-slate-400 text-sm font-light max-w-lg leading-relaxed">
              {ROOM_TYPE_DESCRIPTIONS[roomType] ?? "Discover our thoughtfully designed rooms."}
            </p>
          </div>
          {!loading && (
            <p className="text-slate-500 text-sm tracking-widest uppercase">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"} available
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-500 text-sm tracking-widest uppercase">Loading rooms...</p>
          </div>
        )}
        {!loading && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 rounded-sm bg-slate-800 border border-amber-500/15 flex items-center justify-center">
              <Inbox className="w-6 h-6 text-amber-400/40" />
            </div>
            <p className="text-slate-400 text-sm">No rooms available at the moment.</p>
          </div>
        )}
        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <div key={room.id} className="group relative bg-slate-900 border border-white/5 rounded-sm overflow-hidden hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
                style={{ animationDelay: `${index * 80}ms` }}>
                <div className="relative h-56 overflow-hidden bg-slate-800">
                  <img src={`data:image/jpeg;base64,${room.image}`} alt={`${room.type} - Room ${room.id}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm border border-amber-500/20 rounded-sm text-[10px] tracking-[0.2em] uppercase text-amber-400 font-medium">
                      <BedDouble className="w-3 h-3" />{room.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium tracking-wide text-sm">Room {room.id.toString().padStart(3, "0")}</h3>
                      <p className="text-slate-500 text-xs mt-0.5 tracking-wide">{ROOM_TYPE_LABELS[room.type] ?? room.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs text-amber-400/60">Rs.</span>
                        <span className="text-xl font-light text-amber-400">{room.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 tracking-wide">per night</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5 mb-3" />
                  <p className="text-slate-400 text-xs font-light leading-relaxed mb-4 line-clamp-2">{room.description}</p>
                  <button onClick={() => handleOpenModal(room)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-amber-500/30 text-amber-400 text-xs tracking-widest uppercase font-medium rounded-sm hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 bg-transparent cursor-pointer group/btn">
                    Book This Room
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedRoom(null)}>
          <div className="bg-slate-900 border border-amber-500/15 rounded-sm overflow-hidden w-full max-w-lg shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}>

            <div className="relative h-48 bg-slate-800">
              <img src={`data:image/jpeg;base64,${selectedRoom.image}`} alt={selectedRoom.type}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
              <button onClick={() => setSelectedRoom(null)}
                className="absolute top-3 right-3 w-7 h-7 bg-slate-900/80 border border-white/10 rounded-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-6">

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-white text-lg font-medium tracking-wide">
                    Room {selectedRoom.id.toString().padStart(3, "0")}
                  </h2>
                  <p className="text-amber-400/60 text-xs tracking-widest uppercase mt-0.5">
                    {ROOM_TYPE_LABELS[selectedRoom.type] ?? selectedRoom.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm text-amber-400/60">$</span>
                    <span className="text-3xl font-light text-amber-400">{selectedRoom.price}</span>
                  </div>
                  <p className="text-xs text-slate-500">per night</p>
                </div>
              </div>

              <div className="h-px bg-white/5 mb-5" />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-amber-400/60 font-medium">
                    <CalendarDays className="w-3 h-3" />
                    Check In
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="bg-slate-800 border border-white/10 rounded-sm px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500/40 transition-colors duration-200 cursor-pointer w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-amber-400/60 font-medium">
                    <CalendarDays className="w-3 h-3" />
                    Check Out
                  </label>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    disabled={!checkIn}
                    onChange={(e) => handleCheckOutChange(e.target.value)}
                    className="bg-slate-800 border border-white/10 rounded-sm px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500/40 transition-colors duration-200 cursor-pointer w-full disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {dateError && (
                <p className="text-red-400 text-xs mb-3">{dateError}</p>
              )}

              {nights > 0 && (
                <div className="flex items-center justify-between bg-slate-800/60 border border-amber-500/10 rounded-sm px-4 py-3 mb-5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-400/50" />
                    <span>{nights} {nights === 1 ? "night" : "nights"}</span>
                    <span className="text-slate-600">×</span>
                    <span>Rs.{selectedRoom.price}</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-amber-400/60">Rs.</span>
                    <span className="text-xl font-light text-amber-400">{total}</span>
                    <span className="text-xs text-slate-500 ml-1">total</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setSelectedRoom(null)}
                  className="flex-1 py-2.5 border border-white/10 text-slate-400 text-xs tracking-widest uppercase rounded-sm hover:border-white/20 hover:text-white transition-colors bg-transparent cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirm}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 cursor-pointer border-none disabled:opacity-50"
                  disabled={!checkIn || !checkOut || nights === 0}>
                  Confirm Booking
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}