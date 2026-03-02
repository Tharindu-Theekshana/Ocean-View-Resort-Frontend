import { useEffect, useState } from "react";
import { ChevronDown, Star } from "lucide-react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950">

      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80"
          alt="Ocean View Resort"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/30 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/30" />
      </div>

      <div className="absolute top-24 left-8 w-px h-32 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent hidden lg:block" />
      <div className="absolute top-24 left-8 w-20 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent hidden lg:block" />

      <div className="absolute bottom-32 right-8 w-px h-32 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent hidden lg:block" />
      <div className="absolute bottom-32 right-8 w-20 h-px bg-gradient-to-l from-transparent via-amber-400/30 to-transparent hidden lg:block" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-12">

        <div className={`transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-amber-400/30 rounded-full bg-amber-400/5 backdrop-blur-sm mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-amber-300/90 text-xs tracking-[0.2em] uppercase font-light">
              5-Star Luxury Resort
            </span>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light text-white tracking-tight leading-none mb-4">
            Where The
            <br />
            <span className="italic font-extralight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
              Ocean Meets
            </span>
            <br />
            Luxury
          </h1>
        </div>

        <div className={`transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-slate-300/80 text-base sm:text-lg font-light tracking-wide max-w-xl mx-auto mt-4 mb-10 leading-relaxed">
            Immerse yourself in breathtaking ocean panoramas, world-class amenities,
            and unparalleled serenity at Ocean View Resort & Spa.
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <a href="/rooms">
            <button className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 text-sm tracking-widest uppercase font-semibold rounded-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-400/40 hover:-translate-y-0.5 cursor-pointer border-none">
              Explore Rooms
            </button>
          </a>
          <a href="#booking">
            <button className="px-8 py-3.5 border border-white/25 text-white text-sm tracking-widest uppercase font-medium rounded-sm hover:border-amber-400/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm cursor-pointer bg-transparent hover:-translate-y-0.5">
              Book a Stay
            </button>
          </a>
        </div>

        <div className={`flex items-center gap-8 sm:gap-12 transition-all duration-700 delay-[600ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {[
            { value: "25+", label: "Years of Excellence" },
            { value: "120", label: "Luxury Rooms" },
            { value: "4.9", label: "Guest Rating" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-light text-amber-300 tracking-tight">{stat.value}</span>
              <span className="text-xs text-slate-400 tracking-widest uppercase mt-1 font-light">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-6">
        <a href="#rooms" className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors duration-200 group">
          <span className="text-[9px] tracking-[0.3em] uppercase font-light">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-amber-400" />
        </a>
      </div>

    </section>
  );
}