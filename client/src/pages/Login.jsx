import { useState } from "react";
import { NavLink } from "react-router";
import {
  FiPlus,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiUsers,
  FiLayers,
  FiBell,
  FiShield,
  FiBarChart2,
  FiClock,
} from "react-icons/fi";
import authBg from "../assets/auth-bg.jpeg";
import authDoctor from "../assets/auth-doctor.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log("Signing in with:", { email, password, rememberMe });
  };

  return (
    <main
      className="min-h-screen w-full relative flex items-center justify-center bg-cover bg-center overflow-hidden py-10 px-4 select-none"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Background circular path wrapping the login box (Desktop only) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block z-0">
        {/* Large centered circular dashed outline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[76%] rounded-full border border-dashed border-slate-300/40" />

        {/* Orbiting Stats Node 2: Current Token (Top Right) */}
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

        {/* Orbiting Stats Node 3: Live Notifications (Bottom Right) */}
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

        {/* Orbiting Stats Node 5: Today's Consultations (Bottom Left) */}
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

        {/* Orbiting Stats Node 6: Avg. Wait Time (Top Left) */}
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
            <span className="text-xs font-black text-blue-500 mt-0.5">
              22 min
            </span>
            <span className="text-[6px] text-emerald-500 font-extrabold mt-0.5">
              ● Live Updates
            </span>
          </div>
        </div>
      </div>

      {/* Center Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="size-[500px] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      {/* Main Login Box Form - Set width to fit content and remove excess white space */}
      <div className="relative w-full max-w-[540px] mx-auto bg-white rounded-[32px] p-8 sm:p-10 lg:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.06)] border border-slate-100/55 z-10 select-text">
        {/* Doctor Image absolute inside login form box - interacts with "Welcome Back 👋" */}
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

        {/* Form Content Wrapper */}
        <div className="w-full max-w-[450px] text-center space-y-8 shrink-0 mx-auto">
          {/* Header Block */}
          <div className="flex flex-col items-center gap-2 max-w-[400px] mx-auto">
            <NavLink to="/" className="inline-flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-[7px] border-2 border-[#2f75ff] text-[#2f75ff]">
                <FiPlus className="text-base stroke-[3]" />
              </span>
              <span className="text-base font-extrabold text-[#0d1321] tracking-normal">
                Queue <span className="text-[#2f75ff]">Cure</span>
              </span>
            </NavLink>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d1321] mt-3 pr-6 sm:pr-8">
              Welcome <span className="text-[#315cf0]">Back!</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium max-w-sm">
              Sign in to access your clinic dashboard and manage queues
              seamlessly.
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            {/* Email Address */}
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
                  className="block w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>
            </div>

            {/* Password */}
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
                  className="block w-full pl-10 pr-10 py-3 bg-[#f8fafc] border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
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

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#315cf0] focus:ring-[#315cf0] size-3.5 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-slate-500">
                  Remember me
                </span>
              </label>
              <a
                href="#forgot"
                className="text-[10px] font-bold text-[#315cf0] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#315cf0] hover:bg-[#204ad0] text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              Sign In
              <FiArrowRight className="text-sm" />
            </button>
          </form>

          {/* Bottom link */}
          <div className="pt-2">
            <p className="text-[10px] text-slate-400 font-bold">
              Don't have an account?{" "}
              <a
                href="#signup"
                className="text-[#315cf0] font-black hover:underline"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
