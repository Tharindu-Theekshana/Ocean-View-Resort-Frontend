import { useEffect, useState } from "react"
import { getAllRooms, getRoomsByCategory } from "../services/roomService"
import {
  BedDouble, ChevronRight, Loader2, Inbox, Search,
  CalendarDays, User, MapPin, Phone, UserCheck, UserPlus, X, Clock
} from "lucide-react";
import { makeReservation } from "../services/reservationService";

interface Room {
  id: number;
  type: string;
  price: number;
  description: string;
  image: string;
}

const ROOM_TYPES = ["ALL", "SINGLE", "DOUBLE", "AC", "NON_AC"];

const ROOM_TYPE_LABELS: Record<string, string> = {
  ALL: "All Rooms", SINGLE: "Single", DOUBLE: "Double", AC: "AC", NON_AC: "Non-AC",
};

const calcNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const today = new Date().toISOString().split("T")[0];

function DateFields({ checkIn, checkOut, onCheckInChange, onCheckOutChange, errors, selectedRoom}: {
  checkIn: string; checkOut: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  errors: Record<string, string>;
  selectedRoom: any;
}) {
  const nights = calcNights(checkIn, checkOut);
  const total = selectedRoom ? (nights * selectedRoom.price).toFixed(2) : "0.00";
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-amber-400/60 font-medium">
            <CalendarDays className="w-3 h-3" /> Check In
          </label>
          <input type="date" min={today} value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className={`bg-slate-800 border rounded-sm px-3 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors w-full cursor-pointer ${errors.checkIn ? "border-red-500/40" : "border-white/10 focus:border-amber-500/40"}`}
          />
          {errors.checkIn && <p className="text-red-400 text-[11px]">{errors.checkIn}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-amber-400/60 font-medium">
            <CalendarDays className="w-3 h-3" /> Check Out
          </label>
          <input type="date" min={checkIn || today} value={checkOut} disabled={!checkIn}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className={`bg-slate-800 border rounded-sm px-3 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${errors.checkOut ? "border-red-500/40" : "border-white/10 focus:border-amber-500/40"}`}
          />
          {errors.checkOut && <p className="text-red-400 text-[11px]">{errors.checkOut}</p>}
        </div>
      </div>
      {nights > 0 && (
        <div className="flex items-center justify-between bg-slate-800/60 border border-amber-500/10 rounded-sm px-4 py-2.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400/50" />
            {nights} {nights === 1 ? "night" : "nights"}
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs text-amber-400/60"></span>
            <span className="text-lg font-light text-amber-400">Rs.{total}</span>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, icon: Icon, value, onChange, error, placeholder, type = "text" }: {
  label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; error?: string;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-amber-400/60 font-medium">
        <Icon className="w-3 h-3" />{label}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-slate-800 border rounded-sm px-3 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none transition-colors ${error ? "border-red-500/40 focus:border-red-400/60" : "border-white/10 focus:border-amber-500/40"}`}
      />
      {error && <p className="text-red-400 text-[11px]"> {error}</p>}
    </div>
  );
}

export default function CreateReservationComponent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("ALL");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guestType, setGuestType] = useState<"registered" | "new">("registered");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [userDetailId, setUserDetailId] = useState("");
  const [regCheckIn, setRegCheckIn] = useState("");
  const [regCheckOut, setRegCheckOut] = useState("");

  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCheckIn, setNewCheckIn] = useState("");
  const [newCheckOut, setNewCheckOut] = useState("");

  const fetchRooms = async (type: string) => {
    setLoading(true);
    try {
      const data = type === "ALL" ? await getAllRooms() : await getRoomsByCategory(type);
      setRooms(data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(activeType); }, [activeType]);

  const handleTypeChange = (type: string) => { setActiveType(type); };

  const openModal = (room: Room) => {
    setSelectedRoom(room);
    setGuestType("registered");
    setErrors({});
    setUserDetailId(""); setRegCheckIn(""); setRegCheckOut("");
    setNewName(""); setNewAddress(""); setNewPhone(""); setNewCheckIn(""); setNewCheckOut("");
  };

  const closeModal = () => setSelectedRoom(null);

  const handleRegCheckIn = (v: string) => {
    setRegCheckIn(v);
    setErrors((e) => ({ ...e, regCheckIn: "" }));
    if (regCheckOut && v >= regCheckOut) setRegCheckOut("");
  };

  const handleNewCheckIn = (v: string) => {
    setNewCheckIn(v);
    setErrors((e) => ({ ...e, newCheckIn: "" }));
    if (newCheckOut && v >= newCheckOut) setNewCheckOut("");
  };

  const handleReserve = async () => {
    const errs: Record<string, string> = {};

    if (guestType === "registered") {
      if (!userDetailId) errs.userDetailId = "User Detail ID is required.";
      if (!regCheckIn) errs.regCheckIn = "Check-in date is required.";
      if (!regCheckOut) errs.regCheckOut = "Check-out date is required.";
      if (Object.keys(errs).length) { setErrors(errs); return; }

      const payload = {
        roomId: selectedRoom?.id,
        userDetailId: userDetailId,
        checkInDate: regCheckIn,
        checkOutDate: regCheckOut,
        reservedByGuest: false,
        newGuest: false
      };

      try{
          await makeReservation(payload);
          alert("Reservation successful!");

      }catch(e){
        alert("Something went wrong, please try again later.");
      }

    } else {
      if (!newName) errs.newName = "Name is required.";
      if (!newAddress) errs.newAddress = "Address is required.";
      if (!newPhone) errs.newPhone = "Phone number is required.";
      if (!newCheckIn) errs.newCheckIn = "Check-in date is required.";
      if (!newCheckOut) errs.newCheckOut = "Check-out date is required.";
      if (Object.keys(errs).length) { setErrors(errs); return; }

      const payload =  {
        roomId: selectedRoom?.id,
        name: newName,
        address: newAddress,
        phoneNumber: newPhone,
        checkInDate: newCheckIn,
        checkOutDate: newCheckOut,
        reservedByGuest: false,
        newGuest: true
      };

      try{
        await makeReservation(payload);
        alert("Reservation successful!");

    }catch(e){
      alert("Something went wrong, please try again later.");
    }

    }

    closeModal();
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">

        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400/40 text-xs tracking-[0.3em] uppercase mb-3">
            <span>Ocean View Resort</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400/70">Create Reservation</span>
          </div>
          <h1 className="text-2xl font-light text-white">Create Reservation</h1>
          <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent mt-2 mb-2" />
          <p className="text-slate-500 text-xs font-light">Select a room to begin the reservation process.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-6">
          {ROOM_TYPES.map((type) => (
            <button key={type} onClick={() => handleTypeChange(type)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-medium tracking-wide border transition-all duration-200 cursor-pointer ${
                activeType === type
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  : "bg-transparent border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15"
              }`}>
              {activeType === type && <Search className="w-3 h-3" />}
              {ROOM_TYPE_LABELS[type]}
            </button>
          ))}
          {!loading && (
            <span className="ml-auto text-xs text-slate-600 tracking-widest uppercase">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </span>
          )}
        </div>

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
            <p className="text-slate-400 text-sm">No rooms found for this category.</p>
          </div>
        )}

        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <div key={room.id}
                className="group bg-slate-900 border border-white/5 rounded-sm overflow-hidden hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img src={`data:image/jpeg;base64,${room.image}`} alt={room.type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm border border-amber-500/20 rounded-sm text-[10px] tracking-[0.2em] uppercase text-amber-400 font-medium">
                      <BedDouble className="w-3 h-3" />{room.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white text-sm font-medium">Room {room.id.toString().padStart(3, "0")}</h3>
                      <p className="text-slate-500 text-[10px] mt-0.5 tracking-wide">{ROOM_TYPE_LABELS[room.type] ?? room.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs text-amber-400/60">Rs.</span>
                        <span className="text-xl font-light text-amber-400">{room.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-600">per night</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5 mb-3" />
                  <p className="text-slate-400 text-xs font-light leading-relaxed mb-4 line-clamp-2">{room.description}</p>
                  <button onClick={() => openModal(room)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-amber-500/30 text-amber-400 text-xs tracking-widest uppercase font-medium rounded-sm hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-200 bg-transparent cursor-pointer">
                    Select Room <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}>
          <div className="bg-slate-900 border border-amber-500/15 rounded-sm w-full max-w-md shadow-2xl shadow-black/60 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-slate-900 z-10">
              <div>
                <p className="text-white text-sm font-medium">
                  Room {selectedRoom.id.toString().padStart(3, "0")} — {selectedRoom.type}
                </p>
                <p className="text-amber-400/50 text-[10px] tracking-widest uppercase mt-0.5">
                  Rs.{selectedRoom.price} / night
                </p>
              </div>
              <button onClick={closeModal}
                className="w-7 h-7 bg-slate-800 border border-white/8 rounded-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">

              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium mb-3">Guest Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["registered", "new"] as const).map((type) => (
                    <button key={type} onClick={() => { setGuestType(type); setErrors({}); }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-sm border text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                        guestType === type
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-slate-800/50 border-white/8 text-slate-400 hover:text-white hover:border-white/15"
                      }`}>
                      {type === "registered"
                        ? <><UserCheck className="w-4 h-4" /> Registered</>
                        : <><UserPlus className="w-4 h-4" /> New Guest</>
                      }
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {guestType === "registered" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium mb-3">Guest Information</p>
                    <Field
                      label="User Detail ID" icon={User}
                      value={userDetailId} onChange={setUserDetailId}
                      placeholder="Enter user detail ID"
                      error={errors.userDetailId}
                    />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium mb-3">Stay Duration</p>
                    <DateFields
                      checkIn={regCheckIn} checkOut={regCheckOut}
                      onCheckInChange={handleRegCheckIn}
                      onCheckOutChange={(v) => { setRegCheckOut(v); setErrors((e) => ({ ...e, regCheckOut: "" })); }}
                      errors={{ checkIn: errors.regCheckIn, checkOut: errors.regCheckOut }}
                      selectedRoom={selectedRoom}
                    />
                  </div>
                </div>
              )}

              {guestType === "new" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Guest Information</p>
                    <Field label="Full Name" icon={User} value={newName} onChange={setNewName}
                      placeholder="e.g. John Perera" error={errors.newName} />
                    <Field label="Address" icon={MapPin} value={newAddress} onChange={setNewAddress}
                      placeholder="e.g. 12 Galle Road, Colombo" error={errors.newAddress} />
                    <Field label="Phone Number" icon={Phone} value={newPhone} onChange={setNewPhone}
                      placeholder="e.g. +94 77 123 4567" error={errors.newPhone} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Stay Duration</p>
                    <DateFields
                      checkIn={newCheckIn} checkOut={newCheckOut}
                      onCheckInChange={handleNewCheckIn}
                      onCheckOutChange={(v) => { setNewCheckOut(v); setErrors((e) => ({ ...e, newCheckOut: "" })); }}
                      errors={{ checkIn: errors.newCheckIn, checkOut: errors.newCheckOut }}
                      selectedRoom={selectedRoom}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={closeModal}
                  className="flex-1 py-2.5 border border-white/10 text-slate-400 text-xs tracking-widest uppercase rounded-sm hover:border-white/20 hover:text-white transition-colors bg-transparent cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleReserve}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 cursor-pointer border-none">
                  Reserve Room
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}