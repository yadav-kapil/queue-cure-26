import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  FiPlus,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiLayers,
  FiBell,
  FiBarChart2,
  FiClock,
  FiUser,
  FiPhone,
  FiActivity,
  FiUsers,
} from "react-icons/fi";
import authBg from "../assets/auth-bg.jpeg";
import authDoctor from "../assets/auth-doctor.png";
import useSignup from "../hooks/useSignup";
import Loading from "../components/common/Loading";
import Error from "../components/common/Error";
import { useAuth } from "../context/auth/AuthContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("doctor");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signup, isLoading, error, setError } = useSignup();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === "doctor" ? "/doctor" : "/receptionist";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSignUp = (e) => {
    e.preventDefault();
    signup({
      fullName: name,
      username,
      email,
      mobileNumber: mobile,
      role,
      password,
      confirmPassword,
    });
  };

  return (
    <main
      className="min-h-screen w-full relative flex items-center justify-center bg-cover bg-center overflow-hidden py-10 px-4 select-none"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {isLoading && <Loading message="Creating account..." />}
      {error && (
        <Error 
          heading="Registration Error" 
          message={error} 
          onClose={() => setError("")} 
        />
      )}
      
      <div className="absolute inset-0 pointer-events-none hidden lg:block z-0">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[76%] rounded-full border border-dashed border-slate-300/40" />

        
        <div
          className="absolute top-[22%] right-[18%] flex flex-col items-center gap-2 animate-float pointer-events-none"
          style={{ animationDelay: "0.8s", animationDuration: "5.8s" }}
        >
          <span className="grid size-10 place-items-center rounded-full bg-white text-blue-500 shadow-md border border-slate-100">
            <FiLayers className="text-lg" />
          </span>
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-100/50 flex flex-col items-center min-w-[110px] text-center">
            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">
              Current Token
            </span>
            <span className="text-xs font-black text-blue-500 mt-0.5">24</span>
            <span className="text-[6px] text-emerald-500 font-extrabold mt-0.5">
              ● 2 ahead of you
            </span>
          </div>
        </div>

        
        <div
          className="absolute bottom-[18%] right-[18%] flex flex-col items-center gap-2 animate-float pointer-events-none"
          style={{ animationDelay: "1.6s", animationDuration: "6.2s" }}
        >
          <span className="grid size-10 place-items-center rounded-full bg-white text-blue-500 shadow-md border border-slate-100">
            <FiBell className="text-lg" />
          </span>
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-100/50 flex flex-col items-center min-w-[110px] text-center">
            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">
              Live Notifications
            </span>
            <span className="text-xs font-black text-blue-500 mt-0.5">ON</span>
            <span className="text-[6px] text-emerald-500 font-extrabold mt-0.5">
              ● Always Updated
            </span>
          </div>
        </div>

        
        <div
          className="absolute bottom-[28%] left-[18%] flex flex-col items-center gap-2 animate-float pointer-events-none"
          style={{ animationDelay: "3.2s", animationDuration: "6s" }}
        >
          <span className="grid size-10 place-items-center rounded-full bg-white text-blue-500 shadow-md border border-slate-100">
            <FiBarChart2 className="text-lg" />
          </span>
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-100/50 flex flex-col items-center min-w-[110px] text-center">
            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">
              Today's Consultations
            </span>
            <span className="text-xs font-black text-blue-500 mt-0.5">186</span>
            <span className="text-[6px] text-emerald-500 font-extrabold mt-0.5">
              ▲ 18% from yesterday
            </span>
          </div>
        </div>

        
        <div
          className="absolute top-[18%] left-[18%] flex flex-col items-center gap-2 animate-float pointer-events-none"
          style={{ animationDelay: "4s", animationDuration: "5.4s" }}
        >
          <span className="grid size-10 place-items-center rounded-full bg-white text-blue-500 shadow-md border border-slate-100">
            <FiClock className="text-lg" />
          </span>
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-100/50 flex flex-col items-center min-w-[110px] text-center">
            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">
              Avg. Wait Time
            </span>
            <span className="text-xs font-black text-[#2f75ff] mt-0.5">
              22 min
            </span>
            <span className="text-[6px] text-emerald-500 font-extrabold mt-0.5">
              ● Live Updates
            </span>
          </div>
        </div>
      </div>

      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="size-[500px] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      
      <div className="relative w-full max-w-[540px] mx-auto bg-white rounded-[32px] p-6 sm:p-8 lg:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.06)] border border-slate-100/55 z-10 select-text">
        <img
          src={authDoctor}
          alt="Auth Doctor"
          className="
                      absolute
                      top-[5px]
                      right-[-30px]
                      lg:right-[-18px]
                      w-[150px]
                      sm:w-[200px]
                      animate-float
                      pointer-events-none
                      select-none
                      z-20
                      
                    "
        />

        
        <div className="w-full max-w-[450px] text-center space-y-5 shrink-0 mx-auto">
          
          <div className="flex flex-col items-center gap-1 max-w-[400px] mx-auto">
            <NavLink to="/" className="inline-flex items-center gap-1.5">
              <span className="grid size-6 place-items-center rounded-[6px] border-2 border-[#2f75ff] text-[#2f75ff]">
                <FiPlus className="text-xs stroke-[3]" />
              </span>
              <span className="text-sm font-extrabold text-[#0d1321] tracking-normal">
                Queue <span className="text-[#2f75ff]">Cure</span>
              </span>
            </NavLink>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d1321] mt-2 pr-6 sm:pr-8">
              Create <span className="text-[#315cf0]">Account</span>
            </h2>
            <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium max-w-xs">
              Sign up to set up your clinic, organize queues, and coordinate
              care.
            </p>
          </div>

          
          <form onSubmit={handleSignUp} className="space-y-3 text-left">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser className="text-base" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser className="text-base" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>
            </div>

            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-base" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>
            </div>

            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiPhone className="text-base" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>
            </div>

            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                    role === "doctor"
                      ? "border-[#315cf0] bg-blue-50/30 text-[#315cf0] shadow-[0_4px_12px_rgba(49,92,240,0.06)]"
                      : "border-slate-200/80 bg-[#f8fafc] text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg ${
                      role === "doctor"
                        ? "bg-[#315cf0] text-white"
                        : "bg-slate-200/50 text-slate-500"
                    }`}
                  >
                    <FiActivity className="text-sm" />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold leading-tight">
                      Doctor
                    </span>
                    <span className="text-[8px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                      Care & Queues
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("receptionist")}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                    role === "receptionist"
                      ? "border-[#315cf0] bg-blue-50/30 text-[#315cf0] shadow-[0_4px_12px_rgba(49,92,240,0.06)]"
                      : "border-slate-200/80 bg-[#f8fafc] text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg ${
                      role === "receptionist"
                        ? "bg-[#315cf0] text-white"
                        : "bg-slate-200/50 text-slate-500"
                    }`}
                  >
                    <FiUsers className="text-sm" />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold leading-tight">
                      Receptionist
                    </span>
                    <span className="text-[8px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                      Check-ins & Sync
                    </span>
                  </div>
                </button>
              </div>
            </div>

            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-base" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-base" />
                  ) : (
                    <FiEye className="text-base" />
                  )}
                </button>
              </div>
            </div>

            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-base" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-base" />
                  ) : (
                    <FiEye className="text-base" />
                  )}
                </button>
              </div>
            </div>

            
            <button
              type="submit"
              className="w-full bg-[#315cf0] hover:bg-[#204ad0] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 mt-2.5 cursor-pointer"
            >
              Sign Up
              <FiArrowRight className="text-sm" />
            </button>
          </form>

          
          <div className="pt-2">
            <p className="text-[10px] text-slate-400 font-bold">
              Already have an account?{" "}
              <NavLink
                to="/auth/login"
                className="text-[#315cf0] font-black hover:underline"
              >
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
