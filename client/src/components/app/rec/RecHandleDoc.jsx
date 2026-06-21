import { useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import ManageDocPopover from "./ManageDocPopover";
import { FiUser, FiUserPlus, FiSearch, FiCheck, FiRefreshCw, FiActivity } from "react-icons/fi";

const RecHandleDoc = () => {
  const { user } = useAuth();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const hasHired = user?.associatedDoctorId && user?.associationStatus === "active";
  const hasPendingSent = user?.associatedDoctorId && user?.associationStatus === "pending";

  const activeDoc = hasHired ? user.associatedDoctorId : null;

  // CTA Text logic
  let ctaText = "Manage Doctor";
  if (!hasHired && !hasPendingSent) {
    ctaText = "Search For Doctor";
  }

  return (
    <>
      {/* Main Dashboard Card */}
      <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <p className="text-xs font-bold uppercase tracking-wider text-[#2459ff] mb-4">
          {hasHired && activeDoc ? "Doctor Status" : "Doctor Connection"}
        </p>
        
        {hasHired && activeDoc ? (
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff]">
              <FiUser className="h-6 w-6" />
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-extrabold text-[#07122f] truncate">{activeDoc.fullName}</h3>
              <p className="text-[10px] font-semibold text-slate-400 truncate">{activeDoc.clinicName || `@${activeDoc.username}`}</p>
            </div>
            <span className="rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-[9px] font-extrabold text-[#16a34a]">
              Active
            </span>
          </div>
        ) : (
          <div className="space-y-3 mb-3">
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              No active doctor has been assigned to your account.
            </p>

            {/* Premium Info Panel */}
            <div className="space-y-3 bg-[#f8fafc] rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 place-items-center rounded-md bg-blue-50 text-blue-600">
                  <FiSearch className="text-[10px]" />
                </span>
                <p className="text-[11px] font-medium text-slate-600 leading-normal">
                  Search available doctors.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 place-items-center rounded-md bg-amber-50 text-amber-600">
                  <FiUserPlus className="text-[10px]" />
                </span>
                <p className="text-[11px] font-medium text-slate-600 leading-normal">
                  Send and manage association requests.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 place-items-center rounded-md bg-emerald-50 text-emerald-600">
                  <FiCheck className="text-[10px]" />
                </span>
                <p className="text-[11px] font-medium text-slate-600 leading-normal">
                  Accept incoming connection requests.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 place-items-center rounded-md bg-purple-50 text-purple-600">
                  <FiRefreshCw className="text-[10px]" />
                </span>
                <p className="text-[11px] font-medium text-slate-600 leading-normal">
                  Replace or remove existing associations anytime.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsPopoverOpen(true)}
          className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#315cf0] text-white hover:bg-[#204ad0] transition text-xs font-bold cursor-pointer"
        >
          {ctaText === "Search For Doctor" ? <FiUserPlus className="text-base" /> : <FiActivity className="text-base" />}
          {ctaText}
        </button>
      </article>

      {/* Popover Modal */}
      {isPopoverOpen && (
        <ManageDocPopover
          setIsPopoverOpen={setIsPopoverOpen}
        />
      )}
    </>
  );
};

export default RecHandleDoc;
