import { useState, useEffect } from "react";
import { useDoc } from "../../../hooks/useDoc";
import Loading from "../../common/Loading";
import {
  FiUser,
  FiPlus,
  FiSearch,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle
} from "react-icons/fi";

const ManageRecPopover = ({ setIsPopoverOpen, isInline = false }) => {
  const {
    user,
    hasHired,
    hasPendingSent,
    requests,
    loading,
    actionLoading,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    searchError,
    isCancelling,
    hireLoading,
    removeLoading,
    handleAction,
    handleSearch,
    sendRequest,
    cancelSentRequest,
    removeReceptionist,
    fetchIncomingRequests
  } = useDoc();

  const [activeTab, setActiveTab] = useState("received");
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  const activeRec = hasHired ? user.associatedReceptionistId : null;
  const pendingRec = hasPendingSent ? user.associatedReceptionistId : null;

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  const handleHireClick = async (receptionistId) => {
    if (hasPendingSent) {
      setShowReplaceConfirm(receptionistId);
    } else {
      setLocalError("");
      try {
        await sendRequest(receptionistId);
        setActiveTab("sent");
      } catch (err) {
        setLocalError(err.message || "Failed to send request");
      }
    }
  };

  const confirmReplaceRequest = async () => {
    if (!showReplaceConfirm) return;
    setLocalError("");
    try {
      await cancelSentRequest();
      await sendRequest(showReplaceConfirm);
      setShowReplaceConfirm(null);
      setActiveTab("sent");
    } catch (err) {
      setLocalError(err.message || "Failed to replace request");
    }
  };

  const handleActionClick = async (reqId, action) => {
    if (action === "accept" && hasHired) {
      setLocalError("Please remove your current receptionist first before accepting a new one.");
      return;
    }
    setLocalError("");
    try {
      await handleAction(reqId, action);
    } catch (err) {
      setLocalError(err.message || "Action failed");
    }
  };

  if (isInline) {
    return (
      <>
        {hireLoading && <Loading message="Sending connection request..." />}
        <div className="space-y-6">
          {localError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2">
              <FiAlertCircle className="shrink-0" />
              {localError}
            </div>
          )}

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Current Receptionist</h3>
            {hasHired && activeRec ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                      <FiUser className="text-lg" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#07122f]">{activeRec.fullName}</p>
                      <p className="text-[10px] text-slate-500">@{activeRec.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRemoveConfirm(true)}
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500 font-medium">You don't have an active receptionist.</p>
              </div>
            )}

            {showRemoveConfirm && (
              <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-3">
                <p className="text-xs text-red-700 font-medium">Are you sure you want to remove your current receptionist? They will immediately lose access to your queue.</p>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowRemoveConfirm(false)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
                  <button onClick={async () => {
                    setLocalError("");
                    try {
                      await removeReceptionist();
                      setShowRemoveConfirm(false);
                    } catch (err) {
                      setLocalError(err.message || "Failed to remove receptionist");
                    }
                  }} disabled={removeLoading} className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 cursor-pointer">
                    {removeLoading ? "Removing..." : "Yes, Remove"}
                  </button>
                </div>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center border-b border-slate-100 mb-4">
              <button
                className={`pb-2 text-xs font-bold px-4 transition-colors relative cursor-pointer ${activeTab === 'received' ? 'text-[#315cf0]' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => setActiveTab('received')}
              >
                Received Requests
                {requests.length > 0 && <span className="ml-1.5 inline-flex items-center justify-center bg-red-500 text-white text-[9px] h-4 w-4 rounded-full">{requests.length}</span>}
                {activeTab === 'received' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#315cf0] rounded-t-full"></span>}
              </button>
              <button
                className={`pb-2 text-xs font-bold px-4 transition-colors relative cursor-pointer ${activeTab === 'sent' ? 'text-[#315cf0]' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => setActiveTab('sent')}
              >
                Sent Requests
                {hasPendingSent && <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-amber-400 rounded-full"></span>}
                {activeTab === 'sent' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#315cf0] rounded-t-full"></span>}
              </button>
              <button
                className={`pb-2 text-xs font-bold px-4 transition-colors relative cursor-pointer ${activeTab === 'search' ? 'text-[#315cf0]' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => setActiveTab('search')}
              >
                Search
                {activeTab === 'search' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#315cf0] rounded-t-full"></span>}
              </button>
            </div>

            <div>
              {activeTab === 'received' && (
                <div className="space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2.5">
                      <div className="size-6 border-2 border-slate-200 border-t-[#315cf0] rounded-full animate-spin"></div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Loading requests...</p>
                    </div>
                  ) : requests.length > 0 ? (
                    <div className="space-y-2">
                      {requests.map(req => (
                        <div key={req._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-slate-500"><FiUser /></span>
                            <div>
                              <p className="text-xs font-bold text-[#07122f]">{req.fullName}</p>
                              <p className="text-[10px] text-slate-400">@{req.username}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => handleActionClick(req._id, "accept")} disabled={actionLoading?.id === req._id} className="size-7 grid place-items-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition cursor-pointer disabled:cursor-not-allowed">
                              {actionLoading?.id === req._id && actionLoading?.action === 'accept'
                                ? <span className="size-3.5 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
                                : <FiCheck className="text-sm stroke-[3]" />}
                            </button>
                            <button onClick={() => handleActionClick(req._id, "reject")} disabled={actionLoading?.id === req._id} className="size-7 grid place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition cursor-pointer disabled:cursor-not-allowed">
                              {actionLoading?.id === req._id && actionLoading?.action === 'reject'
                                ? <span className="size-3.5 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
                                : <FiX className="text-sm stroke-[3]" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-8">No received requests.</p>
                  )}
                </div>
              )}

              {activeTab === 'sent' && (
                <div className="min-h-[80px]">
                  {hasPendingSent && pendingRec ? (
                    <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-600"><FiClock className="text-lg" /></span>
                          <div>
                            <p className="text-sm font-bold text-[#07122f]">{pendingRec.fullName}</p>
                            <p className="text-[10px] text-amber-600 font-medium">Request Pending</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => { setLocalError(""); try { await cancelSentRequest(); } catch (err) { setLocalError(err.message || "Failed to cancel request"); } }}
                          disabled={isCancelling}
                          className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          {isCancelling ? "Cancelling..." : "Cancel"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-8">You haven't sent any requests.</p>
                  )}
                </div>
              )}

              {activeTab === 'search' && (
                <div className="space-y-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><FiSearch className="text-xs" /></span>
                      <input
                        type="text"
                        placeholder="Search username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-8 pr-3 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                      />
                    </div>
                    <button type="submit" disabled={searchLoading} className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer disabled:opacity-70">Search</button>
                  </form>
                  {searchError && <p className="mt-2 text-[10px] text-red-500 font-semibold">{searchError}</p>}
                  {showReplaceConfirm && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-800 font-bold mb-1">Replace pending request?</p>
                      <p className="text-[10px] text-amber-700 mb-3 leading-relaxed">You already have a pending sent request. Sending a new one will cancel the old one. Continue?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowReplaceConfirm(null)} className="flex-1 px-3 py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
                        <button onClick={confirmReplaceRequest} className="flex-1 px-3 py-2 text-[10px] font-bold text-white bg-amber-500 rounded-lg hover:bg-amber-600 cursor-pointer">Yes, Replace</button>
                      </div>
                    </div>
                  )}
                  {searchResults.length > 0 && !searchLoading && (
                    <div className="space-y-2">
                      {searchResults.map((rec) => (
                        <div key={rec.id || rec._id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition">
                          <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-400"><FiUser className="text-sm" /></span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#07122f] truncate">{rec.fullName}</p>
                            <p className="text-[9px] font-semibold text-slate-400">@{rec.username}</p>
                          </div>
                          <button type="button" onClick={() => handleHireClick(rec.id || rec._id)} disabled={hireLoading} className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-extrabold px-3 py-1.5 rounded-lg text-[#315cf0] transition cursor-pointer">
                            <FiPlus className="stroke-[3]" /> Hire
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchLoading && (
                    <div className="flex flex-col items-center justify-center py-8 gap-2.5">
                      <div className="size-6 border-2 border-slate-200 border-t-[#315cf0] rounded-full animate-spin"></div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Searching receptionists...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      {hireLoading && <Loading message="Sending connection request..." />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
            <h2 className="text-lg font-extrabold text-[#07122f]">Manage Receptionist</h2>
            <button
              onClick={() => setIsPopoverOpen(false)}
              className="grid size-8 place-items-center rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-5 space-y-8 flex-1">
            {localError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2">
                <FiAlertCircle className="shrink-0" />
                {localError}
              </div>
            )}

            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Current Receptionist</h3>
              {hasHired && activeRec ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                         <FiUser className="text-lg" />
                       </span>
                       <div>
                         <p className="text-sm font-bold text-[#07122f]">{activeRec.fullName}</p>
                         <p className="text-[10px] text-slate-500">@{activeRec.username}</p>
                       </div>
                    </div>
                    <button
                      onClick={() => setShowRemoveConfirm(true)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">You don't have an active receptionist.</p>
                </div>
              )}

              {showRemoveConfirm && (
                <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-3">
                  <p className="text-xs text-red-700 font-medium">Are you sure you want to remove your current receptionist? They will immediately lose access to your queue.</p>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowRemoveConfirm(false)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
                    <button onClick={async () => {
                      setLocalError("");
                      try {
                        await removeReceptionist();
                        setShowRemoveConfirm(false);
                      } catch (err) {
                        setLocalError(err.message || "Failed to remove receptionist");
                      }
                    }} disabled={removeLoading} className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 cursor-pointer">
                      {removeLoading ? "Removing..." : "Yes, Remove"}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center border-b border-slate-100 mb-4">
                <button
                  className={`pb-2 text-xs font-bold px-4 transition-colors relative cursor-pointer ${activeTab === 'received' ? 'text-[#315cf0]' : 'text-slate-400 hover:text-slate-600'}`}
                  onClick={() => setActiveTab('received')}
                >
                  Received Requests
                  {requests.length > 0 && <span className="ml-1.5 inline-flex items-center justify-center bg-red-500 text-white text-[9px] h-4 w-4 rounded-full">{requests.length}</span>}
                  {activeTab === 'received' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#315cf0] rounded-t-full"></span>}
                </button>
                <button
                  className={`pb-2 text-xs font-bold px-4 transition-colors relative cursor-pointer ${activeTab === 'sent' ? 'text-[#315cf0]' : 'text-slate-400 hover:text-slate-600'}`}
                  onClick={() => setActiveTab('sent')}
                >
                  Sent Requests
                  {hasPendingSent && <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-amber-400 rounded-full"></span>}
                  {activeTab === 'sent' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#315cf0] rounded-t-full"></span>}
                </button>
                <button
                  className={`pb-2 text-xs font-bold px-4 transition-colors relative cursor-pointer ${activeTab === 'search' ? 'text-[#315cf0]' : 'text-slate-400 hover:text-slate-600'}`}
                  onClick={() => setActiveTab('search')}
                >
                  Search
                  {activeTab === 'search' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#315cf0] rounded-t-full"></span>}
                </button>
              </div>

              <div className="h-[260px] overflow-y-auto pr-2">
                {activeTab === 'received' && (
                  <div className="space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2.5">
                      <div className="size-6 border-2 border-slate-200 border-t-[#315cf0] rounded-full animate-spin"></div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Loading requests...</p>
                    </div>
                  ) : requests.length > 0 ? (
                    <div className="space-y-2">
                      {requests.map(req => (
                        <div key={req._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-slate-500">
                              <FiUser />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#07122f]">{req.fullName}</p>
                              <p className="text-[10px] text-slate-400">@{req.username}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => handleActionClick(req._id, "accept")} disabled={actionLoading?.id === req._id} className="size-7 grid place-items-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition cursor-pointer disabled:cursor-not-allowed">
                              {actionLoading?.id === req._id && actionLoading?.action === 'accept'
                                ? <span className="size-3.5 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
                                : <FiCheck className="text-sm stroke-[3]" />}
                            </button>
                            <button onClick={() => handleActionClick(req._id, "reject")} disabled={actionLoading?.id === req._id} className="size-7 grid place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition cursor-pointer disabled:cursor-not-allowed">
                              {actionLoading?.id === req._id && actionLoading?.action === 'reject'
                                ? <span className="size-3.5 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
                                : <FiX className="text-sm stroke-[3]" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-8">No received requests.</p>
                  )}
                </div>
              )}

              {activeTab === 'sent' && (
                <div className="min-h-[100px]">
                  {hasPendingSent && pendingRec ? (
                     <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/30">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-600">
                              <FiClock className="text-lg" />
                            </span>
                            <div>
                              <p className="text-sm font-bold text-[#07122f]">{pendingRec.fullName}</p>
                              <p className="text-[10px] text-amber-600 font-medium">Request Pending</p>
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              setLocalError("");
                              try {
                                await cancelSentRequest();
                              } catch (err) {
                                setLocalError(err.message || "Failed to cancel request");
                              }
                            }}
                            disabled={isCancelling}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            {isCancelling ? "Cancelling..." : "Cancel"}
                          </button>
                       </div>
                     </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-8">You haven't sent any requests.</p>
                  )}
                </div>
              )}

              {activeTab === 'search' && (
                <div className="space-y-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FiSearch className="text-xs" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-8 pr-3 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={searchLoading}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer disabled:opacity-70"
                    >
                      Search
                    </button>
                  </form>

                  {searchError && <p className="mt-2 text-[10px] text-red-500 font-semibold">{searchError}</p>}
                  
                  {showReplaceConfirm && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-800 font-bold mb-1">Replace pending request?</p>
                      <p className="text-[10px] text-amber-700 mb-3 leading-relaxed">
                        You already have a pending sent request. Sending a new one will cancel the old one. Continue?
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowReplaceConfirm(null)} className="flex-1 px-3 py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
                        <button onClick={confirmReplaceRequest} className="flex-1 px-3 py-2 text-[10px] font-bold text-white bg-amber-500 rounded-lg hover:bg-amber-600 cursor-pointer">Yes, Replace</button>
                      </div>
                    </div>
                  )}

                  {searchResults.length > 0 && !searchLoading && (
                    <div className="space-y-2">
                      {searchResults.map((rec) => (
                        <div key={rec.id || rec._id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition">
                          <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-400">
                            <FiUser className="text-sm" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#07122f] truncate">{rec.fullName}</p>
                            <p className="text-[9px] font-semibold text-slate-400">@{rec.username}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleHireClick(rec.id || rec._id)}
                            disabled={hireLoading}
                            className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-extrabold px-3 py-1.5 rounded-lg text-[#315cf0] transition cursor-pointer"
                          >
                            <FiPlus className="stroke-[3]" />
                            Hire
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchLoading && (
                    <div className="flex flex-col items-center justify-center py-8 gap-2.5">
                      <div className="size-6 border-2 border-slate-200 border-t-[#315cf0] rounded-full animate-spin"></div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Searching receptionists...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageRecPopover;
