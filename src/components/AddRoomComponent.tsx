import { useState, useRef } from "react";
import {
  BedDouble, FileText, DollarSign, ChevronRight,
  ImagePlus, X, Upload, CheckCircle
} from "lucide-react";
import { createRoom } from "../services/roomService";

const ROOM_TYPES = ["SINGLE", "DOUBLE", "AC", "NON_AC"];
const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE: "Single", DOUBLE: "Double", AC: "AC", NON_AC: "Non-AC",
};

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
        }`}
      />
      {error && <p className="text-red-400/90 text-[11px] flex items-center gap-1"><span></span>{error}</p>}
    </div>
  );
}

export default function AddRoomComponent() {
  const [roomType, setRoomType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setErr = (key: string) => (v: string) => {
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, image: "Please select a valid image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: "Image must be under 5MB." }));
      return;
    }
    setImage(file);
    setErrors((e) => ({ ...e, image: "" }));
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange(file);
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!roomType)    e.roomType    = "Please select a room type.";
    if (!description) e.description = "Description is required.";
    if (!price)       e.price       = "Price is required.";
    else if (isNaN(Number(price)) || Number(price) <= 0) e.price = "Enter a valid price.";
    if (!image)       e.image       = "Please upload a room image.";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "roomDetails",
        new Blob(
          [
            JSON.stringify({
              type: roomType,
              description,
              price: Number(price),
            }),
          ],
          { type: "application/json" }
        )
      );
      formData.append("image", image!);
      await createRoom(formData);
      setSuccess(true);
      setRoomType(""); setDescription(""); setPrice("");
      clearImage();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      setErrors({ roomType: "Failed to create room. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRoomType(""); setDescription(""); setPrice("");
    setErrors({}); setSuccess(false);
    clearImage();
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 lg:px-10 py-8">

        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400/40 text-xs tracking-[0.3em] uppercase mb-3">
            <span>Ocean View Resort</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400/70">Add Room</span>
          </div>
          <h1 className="text-2xl font-light text-white">Add Room</h1>
          <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent mt-2 mb-2" />
          <p className="text-slate-500 text-xs font-light">
            Register a new room to make it available for reservations.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm px-4 py-3 mb-6">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-xs">Room created successfully!</p>
          </div>
        )}

        <div className="bg-slate-900 border border-white/5 rounded-sm overflow-hidden">

          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
            <BedDouble className="w-4 h-4 text-amber-400/70" strokeWidth={1.75} />
            <p className="text-white text-sm font-medium">Room Details</p>
          </div>

          <div className="p-6 flex flex-col gap-6">

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Room Image</p>
                <div className="flex-1 h-px bg-white/4" />
              </div>

              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-3 h-48 border-2 border-dashed rounded-sm cursor-pointer transition-all duration-200 group ${
                    errors.image
                      ? "border-red-500/30 bg-red-500/5 hover:border-red-400/50"
                      : "border-white/10 bg-slate-800/30 hover:border-amber-500/30 hover:bg-amber-500/5"
                  }`}>
                  <div className="w-10 h-10 rounded-sm bg-slate-800 border border-white/8 flex items-center justify-center group-hover:border-amber-500/20 transition-colors">
                    <ImagePlus className="w-5 h-5 text-slate-500 group-hover:text-amber-400/70 transition-colors" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs font-medium">Drop your image here or <span className="text-amber-400">browse</span></p>
                    <p className="text-slate-600 text-[10px] mt-1">PNG, JPG, WEBP — max 5MB</p>
                  </div>
                  <input
                    ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                  />
                </div>
              ) : (
                <div className="relative h-48 rounded-sm overflow-hidden group">
                  <img src={preview} alt="Room preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-white/15 rounded-sm text-xs text-white hover:border-amber-500/30 transition-colors cursor-pointer">
                      <Upload className="w-3 h-3" /> Replace
                    </button>
                    <button
                      onClick={clearImage}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-red-500/20 rounded-sm text-xs text-red-400 hover:border-red-400/40 transition-colors cursor-pointer">
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 border border-white/10 rounded-sm">
                    <p className="text-[10px] text-slate-300 truncate max-w-[200px]">{image?.name}</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)} />
                </div>
              )}
              {errors.image && (
                <p className="text-red-400/90 text-[11px] flex items-center gap-1"><span></span>{errors.image}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Room Type</p>
                <div className="flex-1 h-px bg-white/4" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROOM_TYPES.map((type) => (
                  <button key={type}
                    onClick={() => { setRoomType(type); setErrors((e) => ({ ...e, roomType: "" })); }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-sm border text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                      roomType === type
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-slate-800/40 border-white/8 text-slate-400 hover:border-white/15 hover:text-white"
                    }`}>
                    <BedDouble className={`w-4 h-4 ${roomType === type ? "text-amber-400" : "text-slate-600"}`} strokeWidth={1.5} />
                    {ROOM_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
              {errors.roomType && (
                <p className="text-red-400/90 text-[11px] flex items-center gap-1"><span></span>{errors.roomType}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40 font-medium">Room Info</p>
                <div className="flex-1 h-px bg-white/4" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-amber-400/60 font-medium">
                  <FileText className="w-3 h-3" />Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErr("description")(""); }}
                  placeholder="e.g. Cozy room with ocean view, king-size bed, and private balcony."
                  rows={3}
                  className={`w-full bg-slate-800/60 border rounded-sm px-3 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none transition-all duration-200 resize-none ${
                    errors.description
                      ? "border-red-500/40 focus:border-red-400/60 bg-red-500/5"
                      : description
                      ? "border-amber-500/30 focus:border-amber-500/50"
                      : "border-white/8 focus:border-amber-500/40"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-400/90 text-[11px] flex items-center gap-1"><span></span>{errors.description}</p>
                )}
              </div>

              <Field label="Price Per Night" icon={DollarSign}
                type="number" value={price}
                onChange={(v) => { setPrice(v); setErr("price")(""); }}
                placeholder="e.g. 8500"
                error={errors.price}
              />
            </div>

            {(roomType || price) && (
              <div className="flex items-center gap-3 bg-slate-800/40 border border-white/5 rounded-sm px-4 py-3">
                <div className="w-8 h-8 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <BedDouble className="w-4 h-4 text-amber-400/70" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium">
                    {roomType ? ROOM_TYPE_LABELS[roomType] : "—"} Room
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    {price ? `Rs.${price} / night` : "No price set"}
                  </p>
                </div>
                {roomType && (
                  <span className="text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm border text-amber-400 bg-amber-500/10 border-amber-500/20 flex-shrink-0">
                    {ROOM_TYPE_LABELS[roomType]}
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={handleClear}
                className="flex-1 py-2.5 border border-white/10 text-slate-400 text-xs tracking-widest uppercase rounded-sm hover:border-white/20 hover:text-white transition-colors bg-transparent cursor-pointer">
                Clear
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-xs tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed">
                {loading
                  ? <><span className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> Uploading...</>
                  : <><Upload className="w-3.5 h-3.5" /> Add Room</>
                }
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}