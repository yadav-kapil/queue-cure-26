import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiArrowRight, FiLock } from "react-icons/fi";
import authBg from "../../../assets/auth-bg.jpeg";
import authDoctor from "../../../assets/auth-doctor.png";

const TrackPatientPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 4) {
      setError("Please enter a valid 4-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/patient/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid OTP. Please try again.");
      } else {
        navigate(`/patient/track/${data.trackingId}`);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Left Section - Graphic/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <img src={authBg} alt="Background" className="w-full h-full object-cover" />
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-12">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
            <img
              src={authDoctor}
              alt="Track Patient"
              className="relative w-80 h-auto mx-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h2 className="text-4xl font-bold mb-4 font-outfit">
            Track Your Status
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Enter your 4-digit security code to check your real-time queue
            position and estimated wait time.
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-outfit">
              Track Status
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your code to view queue details
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-outfit hidden lg:block">
                Enter Tracking Code
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  4-Digit Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    maxLength="4"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 focus:bg-white text-lg tracking-widest text-center"
                    placeholder="1234"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 animate-fade-in">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 4}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300 ${
                  loading || code.length !== 4
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Track Queue Status
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPatientPage;
