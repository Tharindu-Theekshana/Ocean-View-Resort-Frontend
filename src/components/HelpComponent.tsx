import {
    HelpCircle, ChevronRight, Shield, UserCheck,
    CalendarPlus, CalendarDays, BedDouble, Users,
    LayoutDashboard, ChevronDown, ChevronUp, Info,
    CheckCircle, AlertCircle
  } from "lucide-react";
  import { useState } from "react";
  
  // ── Types ──────────────────────────────────────────────────
  interface GuideSection {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    steps: string[];
    tips?: string[];
    adminOnly?: boolean;
  }
  
  const commonSections: GuideSection[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "The dashboard gives you a quick overview of the resort's current activity.",
      icon: LayoutDashboard,
      steps: [
        "Navigate to Dashboard from the sidebar.",
        "View key stats: total reservations, active guests, monthly revenue, and average stay.",
        "Check the Recent Bookings table for the latest reservation activity.",
        "Monitor Room Occupancy to see availability across all room types.",
      ],
      tips: [
        "Stats are updated in real time - refresh the page to get the latest figures.",
        "Use the occupancy panel to quickly identify which room types are fully booked.",
      ],
    },
    {
      id: "create-reservation",
      title: "Create a Reservation",
      description: "Book a room for a guest - either an existing registered guest or a walk-in.",
      icon: CalendarPlus,
      steps: [
        "Go to Create Reservation from the sidebar.",
        "Browse available rooms. Use the category filter (Single, Double, AC, Non-AC) to narrow down options.",
        "Click Select Room on the room you want to book.",
        "In the modal, choose the guest type: Registered Guest or New Guest.",
        "For a Registered Guest - enter their User Detail ID, check-in date, and check-out date.",
        "For a New Guest - fill in their name, address, phone number, check-in date, and check-out date.",
        "Click Reserve Room to confirm the booking.",
      ],
      tips: [
        "Check-out date is automatically disabled until a check-in date is selected.",
        "The night count and estimated total appear automatically once both dates are chosen.",
        "For walk-in guests without an account, always use the New Guest option.",
      ],
    },
    {
      id: "view-reservations",
      title: "View Reservations",
      description: "Browse, search, and manage all guest reservations in one place.",
      icon: CalendarDays,
      steps: [
        "Go to View Reservations from the sidebar.",
        "Use the search bar to find reservations by guest name, room type, or reservation ID.",
        "Use the status filter (All, Upcoming, Active, Completed) to narrow results.",
        "Click the printer icon in the Bill column to generate and print a guest's bill.",
      ],
      tips: [
        "Upcoming = check-in is in the future. Active = guest is currently checked in. Completed = stay is over.",
        "Reservations with a '-' in the Total column have not yet had a bill generated.",
      ],
    },
  ];
  
  const adminSections: GuideSection[] = [
    {
      id: "create-user",
      title: "Create a User Account",
      description: "Add new staff members to the system and assign them the correct role.",
      icon: Users,
      adminOnly: true,
      steps: [
        "Go to Create Users from the sidebar.",
        "Select a role - Admin (full access) or Receptionist (reservations & guests only).",
        "Fill in the staff member's full name, address, and phone number.",
        "Choose a unique username and a secure password (min. 6 characters).",
        "Click Create Account to register the user.",
      ],
      tips: [
        "Assign the Receptionist role for day-to-day front desk staff.",
        "Only assign Admin to trusted senior staff - it grants full system access.",
        "Usernames must be unique. The system will alert you if one is already taken.",
      ],
    },
    {
      id: "add-room",
      title: "Add a New Room",
      description: "Register a new room to make it available for booking.",
      icon: BedDouble,
      adminOnly: true,
      steps: [
        "Go to Add Room from the sidebar.",
        "Upload a clear photo of the room by dragging and dropping or clicking the upload area.",
        "Select the room type: Single, Double, AC, or Non-AC.",
        "Write a brief description highlighting the room's key features.",
        "Enter the price per night in USD.",
        "Click Add Room to save the room to the system.",
      ],
      tips: [
        "Use high-quality images - they appear on the guest-facing booking page.",
        "Accepted formats: PNG, JPG, WEBP. Maximum file size: 5MB.",
        "Double-check the price before saving - it will be used in all future billing.",
      ],
    },
  ];
  
  function AccordionItem({ section }: { section: GuideSection }) {
    const [open, setOpen] = useState(false);
    const Icon = section.icon;
  
    return (
      <div className={`border rounded-sm overflow-hidden transition-all duration-200 ${
        open ? "border-amber-500/20 bg-slate-800/30" : "border-white/5 bg-slate-900 hover:border-white/10"
      }`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer bg-transparent border-none text-left">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
            open ? "bg-amber-500/15 border border-amber-500/25" : "bg-slate-800 border border-white/8"
          }`}>
            <Icon className={`w-4 h-4 ${open ? "text-amber-400" : "text-slate-500"}`} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium tracking-wide ${open ? "text-amber-400" : "text-white"}`}>
                {section.title}
              </p>
              {section.adminOnly && (
                <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border text-amber-400/70 bg-amber-500/8 border-amber-500/15">
                  Admin only
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs font-light mt-0.5 truncate">{section.description}</p>
          </div>
          {open
            ? <ChevronUp className="w-4 h-4 text-amber-400/50 flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
          }
        </button>
  
        {open && (
          <div className="px-5 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
  
            <div className="flex flex-col gap-2">
              <p className="text-[9px] tracking-[0.25em] uppercase text-amber-400/40 font-medium mb-1">Step by Step</p>
              {section.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] text-amber-400 font-medium">{i + 1}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
  
            {section.tips && section.tips.length > 0 && (
              <div className="flex flex-col gap-2 bg-slate-800/50 border border-white/5 rounded-sm p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Info className="w-3.5 h-3.5 text-amber-400/60" />
                  <p className="text-[9px] tracking-[0.25em] uppercase text-amber-400/40 font-medium">Helpful Tips</p>
                </div>
                {section.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-xs leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  export default function HelpComponent() {
    const [activeRole, setActiveRole] = useState<"ADMIN" | "RECEPTIONIST">("RECEPTIONIST");
  
    const sectionsToShow = activeRole === "ADMIN"
      ? [...commonSections, ...adminSections]
      : commonSections;
  
    return (
      <div className="flex-1 overflow-auto bg-slate-950 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-8">
  
          <div className="mb-8">
            <div className="flex items-center gap-2 text-amber-400/40 text-xs tracking-[0.3em] uppercase mb-3">
              <span>Ocean View Resort</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-amber-400/70">Help & Guidelines</span>
            </div>
            <h1 className="text-2xl font-light text-white">Help & Guidelines</h1>
            <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent mt-2 mb-2" />
            <p className="text-slate-500 text-xs font-light">
              A complete guide to using the Ocean View Resort reservation system. Select your role to see relevant instructions.
            </p>
          </div>
  
          <div className="grid grid-cols-2 gap-3 mb-8">
            {([
              { role: "RECEPTIONIST", icon: UserCheck, label: "Receptionist", desc: "Reservations & guest management" },
              { role: "ADMIN", icon: Shield,    label: "Admin", desc: "Full system access + staff & rooms" },
            ] as const).map(({ role, icon: Icon, label, desc }) => (
              <button key={role} onClick={() => setActiveRole(role)}
                className={`flex items-start gap-3 px-4 py-4 rounded-sm border text-left transition-all duration-200 cursor-pointer ${
                  activeRole === role
                    ? "bg-amber-500/10 border-amber-500/25"
                    : "bg-slate-900 border-white/5 hover:border-white/10"
                }`}>
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                  activeRole === role ? "bg-amber-500/15 border border-amber-500/25" : "bg-slate-800 border border-white/8"
                }`}>
                  <Icon className={`w-4 h-4 ${activeRole === role ? "text-amber-400" : "text-slate-500"}`} strokeWidth={1.75} />
                </div>
                <div>
                  <p className={`text-sm font-medium tracking-wide ${activeRole === role ? "text-amber-400" : "text-white"}`}>
                    {label}
                  </p>
                  <p className="text-slate-500 text-[11px] font-light mt-0.5">{desc}</p>
                </div>
                {activeRole === role && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1" />
                )}
              </button>
            ))}
          </div>
  
          {activeRole === "ADMIN" && (
            <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/15 rounded-sm px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-0.5" />
              <p className="text-amber-400/70 text-xs leading-relaxed">
                You're viewing the <span className="font-medium text-amber-400">Admin</span> guide.
                This includes additional sections for managing staff accounts and rooms, which are not available to Receptionists.
              </p>
            </div>
          )}
  
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] tracking-[0.3em] uppercase text-slate-600 font-medium">
              {sectionsToShow.length} sections available
            </p>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3 h-3 text-slate-600" />
              <p className="text-[10px] text-slate-600">Click a section to expand</p>
            </div>
          </div>
  
          <div className="flex flex-col gap-2">
  
            <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/30 font-medium px-1 mb-1">
              General :  Available to all roles
            </p>
            {commonSections.map((section) => (
              <AccordionItem key={section.id} section={section} />
            ))}
  
            {activeRole === "ADMIN" && (
              <>
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/30 font-medium px-1 mt-4 mb-1">
                  Admin only :  Restricted access
                </p>
                {adminSections.map((section) => (
                  <AccordionItem key={section.id} section={section} />
                ))}
              </>
            )}
          </div>
  
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/5">
            <Info className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <p className="text-slate-600 text-[11px] leading-relaxed">
              If you encounter an issue not covered here, please contact your system administrator.
            </p>
          </div>
  
        </div>
      </div>
    );
  }