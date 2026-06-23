import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth/AuthContext";
import { FiUser, FiUserPlus, FiClock } from "react-icons/fi";

const LiveClock = () => {
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const [time, ampm] = timeString.split(' ');
  const [hh, mm, ss] = time.split(':');

  return (
    <article className="rounded-[24px] border border-[#e5eaf4] bg-gradient-to-b from-white to-[#fcfdfe] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex flex-col justify-between h-full flex-1">
      {/* Top: Header & pulsing icon */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Live Clock
        </span>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eef4ff] text-[#2459ff]">
          <FiClock className="h-4 w-4 animate-pulse" />
        </span>
      </div>

      {/* Middle: Big digital time */}
      <div className="my-auto py-2">
        <div className="flex items-baseline justify-start">
          <span className="text-3xl font-black tracking-tight text-[#07122f] tabular-nums">
            {hh}:{mm}
          </span>
          <span className="text-[10px] font-black text-slate-400 ml-1 uppercase">
            {ampm}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2459ff] animate-ping" />
          Ticking: {ss}s
        </div>
      </div>

      {/* Bottom: Date */}
      <div className="border-t border-slate-100/80 pt-3 text-left">
        <p className="text-[9px] font-black uppercase tracking-wider text-[#2459ff]">
          {liveTime.toLocaleDateString([], { weekday: 'long' })}
        </p>
        <p className="text-xs font-black text-[#07122f] mt-0.5">
          {liveTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </article>
  );
};

const DocHandleRec = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasHired = user?.associatedReceptionistId && user?.associationStatus === "active";
  const hasPendingSent = user?.associatedReceptionistId && user?.associationStatus === "pending";

  const activeRec = hasHired ? user.associatedReceptionistId : null;

  const goToSettings = () => navigate('/doctor/settings?tab=receptionist');

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Card 1: Receptionist Status */}
      <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col justify-between h-full flex-1 h-0">
        {hasHired && activeRec ? (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#2459ff]">
                Receptionist
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#2459ff] border border-[#e8efff] shadow-xs">
                <span className="h-1 w-1 rounded-full bg-[#2459ff]" />
                Linked
              </span>
            </div>

            <div className="flex items-center gap-3 text-left my-auto py-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#2459ff] border border-[#e8efff] shadow-xs shrink-0">
                <FiUser className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-[#07122f] truncate max-w-[150px]">
                  {activeRec.fullName}
                </h3>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate max-w-[150px]">
                  @{activeRec.username}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={goToSettings}
              className="w-full justify-center inline-flex items-center gap-1.5 rounded-full bg-[#f1f5ff] py-2 text-[10px] font-black text-[#2459ff] transition hover:bg-[#eef4ff] cursor-pointer shrink-0"
            >
              Manage
            </button>
          </div>
        ) : hasPendingSent ? (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                Connection
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-600 border border-amber-200 shadow-xs animate-pulse">
                Pending
              </span>
            </div>

            <div className="flex items-center gap-3 text-left my-auto py-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-650 border border-amber-100/50 shadow-xs shrink-0">
                <FiUser className="h-5 w-5 animate-pulse text-amber-500" />
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-[#07122f] truncate max-w-[150px]">
                  @{user.associatedReceptionistId.username}
                </h3>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                  Waiting to accept
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={goToSettings}
              className="w-full justify-center inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-2 text-[10px] font-black text-amber-700 transition hover:bg-amber-100 cursor-pointer shrink-0 border border-amber-200"
            >
              Manage
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Receptionist
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-slate-400 border border-slate-200/50 shadow-xs">
                Not Linked
              </span>
            </div>

            <div className="flex items-center gap-3 text-left my-auto py-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100 shadow-xs shrink-0">
                <FiUserPlus className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 font-bold leading-normal">
                  Link a receptionist.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={goToSettings}
              className="w-full justify-center inline-flex items-center gap-1.5 rounded-full bg-[#2459ff] py-2 text-[10px] font-black text-white transition hover:bg-[#1a44cc] cursor-pointer shrink-0 shadow-sm"
            >
              Search
            </button>
          </div>
        )}
      </article>

      {/* Card 2: Clock Bar */}
      <LiveClock />
    </div>
  );
};

export default DocHandleRec;
