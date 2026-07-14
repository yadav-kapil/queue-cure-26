import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth/AuthContext";
import { FiUser, FiUserPlus, FiSearch, FiCheck, FiRefreshCw, FiActivity } from "react-icons/fi";

const RecHandleDoc = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasHired = user?.associatedDoctorId && user?.associationStatus === "active";
  const hasPendingSent = user?.associatedDoctorId && user?.associationStatus === "pending";

  const activeDoc = hasHired ? user.associatedDoctorId : null;

  let ctaText = "Manage Doctor";
  if (!hasHired && !hasPendingSent) {
    ctaText = "Search For Doctor";
  }

  return (
    <>
      <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col justify-between h-full min-h-[280px]">
        {hasHired && activeDoc && (
          <div className="absolute top-5 right-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#2459ff] border border-[#dbeafe] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2459ff]" />
              Linked
            </span>
          </div>
        )}
        
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2459ff] mb-4">
            {hasHired && activeDoc ? "Doctor Status" : "Doctor Connection"}
          </p>
        </div>
        
        {hasHired && activeDoc ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-3 p-5 rounded-2xl bg-gradient-to-b from-[#f8fbff] to-[#f4f7ff]/70 border border-[#e8efff]">
            <div className="relative mb-3">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-[#2459ff] shadow-[0_8px_20px_rgba(77,124,254,0.1)] border border-[#e8efff]">
                <FiUser className="h-8 w-8" />
              </span>
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#2459ff] border-2 border-white" />
            </div>
            <h3 className="text-base font-extrabold text-[#07122f] truncate max-w-full px-2">
              Dr. {activeDoc.fullName.replace(/^Dr\.\s*/i, "")}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 mt-1 truncate max-w-full px-2">
              {activeDoc.clinicName || `@${activeDoc.username}`}
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-3 flex-1 flex flex-col justify-center">
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              No active doctor has been assigned to your account.
            </p>

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
          onClick={() => navigate('/rec/settings?tab=doctor', { viewTransition: true })}
          className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#315cf0] text-white hover:bg-[#204ad0] transition text-xs font-bold cursor-pointer mt-2"
        >
          {ctaText === "Search For Doctor" ? <FiUserPlus className="text-base" /> : <FiActivity className="text-base" />}
          {ctaText}
        </button>
      </article>
    </>
  );
};

export default RecHandleDoc;
