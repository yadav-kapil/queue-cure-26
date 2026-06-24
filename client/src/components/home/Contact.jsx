import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiArrowRight,
  FiUsers,
  FiMapPin,
  FiHeadphones,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "motion/react";
import doctorContactImg from "../../assets/doctor-contactpage.png";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit message.");
      }

      setIsSubmitted(true);
      setFormState({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      
      <div className="bg-[#f3f7ff] rounded-[36px] lg:rounded-[44px] p-6 sm:p-8 lg:p-10 shadow-lg shadow-blue-500/5 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 size-[250px] rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-[250px] rounded-full bg-purple-400/5 blur-3xl pointer-events-none" />

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-stretch relative z-10">
          
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            
            
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#315cf0]">
                <span className="inline-block size-1.5 rounded-full bg-[#315cf0]"></span>
                We're Here to Help
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight text-[#080b13]">
                Let's Simplify Your <br /> Clinic <span className="text-[#315cf0]">Together</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                Have questions or need a demo? Our team is ready to assist you.
              </p>
            </div>

            
            <div className="block lg:hidden relative flex items-end justify-center h-[280px] sm:h-[360px] overflow-visible select-none my-4">
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[240px] sm:size-[320px] rounded-full bg-blue-400/10 blur-[80px] pointer-events-none z-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[200px] sm:size-[260px] rounded-full border border-blue-500/5 pointer-events-none z-0" />

              
              <div className="absolute top-[15%] left-[10%] size-9 rounded-full bg-white flex items-center justify-center text-[#315cf0] shadow-[0_8px_20px_rgba(0,0,0,0.06)] z-20 animate-float pointer-events-none">
                <FiPhone className="text-xs" />
              </div>
              <div className="absolute bottom-[35%] left-[5%] size-9 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-[0_8px_20px_rgba(0,0,0,0.06)] z-20 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
                <FiCheckCircle className="text-xs" />
              </div>
              <div className="absolute top-[25%] right-[10%] size-9 rounded-full bg-white flex items-center justify-center text-blue-400 shadow-[0_8px_20px_rgba(0,0,0,0.06)] z-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
                <FiMessageSquare className="text-xs" />
              </div>

              
              <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg flex flex-col gap-1 max-w-[150px] text-left animate-float">
                <div className="flex items-center gap-1.5">
                  <span className="size-5 rounded-full bg-blue-50 text-[#315cf0] flex items-center justify-center shrink-0 border border-blue-100/50">
                    <FiUsers className="text-[10px]" />
                  </span>
                  <span className="text-[7px] text-slate-500 font-extrabold uppercase tracking-wider">Total Patients Served</span>
                </div>
                <p className="text-sm font-black text-[#315cf0] leading-none">10,280+</p>
                <span className="text-[6px] text-slate-400 font-bold leading-none mt-0.5">Helping clinics deliver experiences</span>
              </div>

              
              <img
                src={doctorContactImg}
                alt="Doctor Contact Mobile"
                className="h-full w-auto object-contain absolute bottom-0 right-4 z-10"
              />
            </div>

            
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiUser className="text-base" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>

              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-base" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>

              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiPhone className="text-base" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200"
                />
              </div>

              
              <div className="relative">
                <div className="absolute left-0 top-3 pl-4 flex items-start pointer-events-none text-slate-400">
                  <FiMessageSquare className="text-base" />
                </div>
                <textarea
                  required
                  rows="3"
                  placeholder="How can we help you?"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#315cf0] focus:ring-1 focus:ring-[#315cf0] transition duration-200 resize-none"
                ></textarea>
              </div>

              
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center relative w-full py-3.5 text-white bg-[#315cf0] hover:bg-[#204ad0] font-bold rounded-2xl text-sm transition duration-205 shadow-md shadow-blue-500/10 cursor-pointer ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Sending..." : "Send Message"}
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#315cf0] rounded-full size-8 flex items-center justify-center shadow-xs text-sm">
                  <FiArrowRight />
                </span>
              </button>

              {error && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 text-rose-800 text-xs font-bold text-center animate-scale-fade-in">
                  ⚠️ {error}
                </div>
              )}

              {isSubmitted && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-emerald-800 text-xs font-bold text-center animate-scale-fade-in">
                  Thanks for reaching out! We will contact you shortly.
                </div>
              )}

              <p className="text-center text-[10px] text-slate-400 font-semibold mt-2">
                🔒 Your information is safe with us.
              </p>
            </form>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:col-span-7 relative items-end justify-center min-h-[520px] overflow-visible select-none z-10"
          >
            
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[340px] lg:size-[480px] rounded-full bg-blue-400/10 blur-[90px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[280px] lg:size-[380px] rounded-full border border-blue-500/5 pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] lg:size-[500px] rounded-full border border-blue-500/5 pointer-events-none z-0" />

            
            <div className="absolute top-[10%] left-[18%] size-11 lg:size-14 rounded-full bg-white flex items-center justify-center text-[#315cf0] shadow-[0_10px_25px_rgba(0,0,0,0.08)] z-20 animate-float pointer-events-none">
              <FiPhone className="text-sm lg:text-lg" />
            </div>
            <div className="absolute bottom-[38%] left-[6%] size-11 lg:size-14 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-[0_10px_25px_rgba(0,0,0,0.08)] z-20 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
              <FiCheckCircle className="text-sm lg:text-lg" />
            </div>
            <div className="absolute top-[32%] right-[6%] size-11 lg:size-14 rounded-full bg-white flex items-center justify-center text-blue-400 shadow-[0_10px_25px_rgba(0,0,0,0.08)] z-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
              <FiMessageSquare className="text-sm lg:text-lg" />
            </div>

            
            <div className="absolute bottom-5 left-0 lg:left-4 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-2 max-w-[210px] text-left animate-float">
              <div className="flex items-center gap-2.5">
                <span className="size-7 rounded-full bg-blue-50 text-[#315cf0] flex items-center justify-center shrink-0 border border-blue-100/50">
                  <FiUsers className="text-xs" />
                </span>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Total Patients Served</span>
              </div>
              <p className="text-xl font-black text-[#315cf0] leading-none mt-0.5">10,280+</p>
              
              
              <div className="h-6 w-full mt-1">
                <svg className="w-full h-full stroke-[#315cf0] stroke-[1.5] fill-none" viewBox="0 0 100 20">
                  <path d="M 0 16 Q 20 6, 40 12 T 80 2 T 100 6" strokeLinecap="round" />
                  <circle cx="100" cy="6" r="2.5" className="fill-[#315cf0] stroke-none" />
                </svg>
              </div>
              <span className="text-[8px] text-slate-400 font-bold leading-normal">Helping clinics deliver better experiences</span>
            </div>

            
            <img
              src={doctorContactImg}
              alt="Doctor Contact"
              className="h-[340px] lg:h-[520px] w-auto object-contain absolute bottom-0 right-0 lg:right-[-20px] z-10 transition duration-500 hover:scale-[1.01]"
            />
          </motion.div>

        </div>
      </div>

      
      <div className="mt-8 sm:mt-10">
        
        
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-xs flex flex-col gap-4 text-left transition-shadow duration-300 hover:shadow-lg hover:border-blue-500/10 cursor-pointer min-h-[180px] justify-between"
          >
            <span className="size-11 rounded-2xl bg-blue-50 text-[#315cf0] flex items-center justify-center shrink-0 border border-blue-100/30">
              <FiPhone className="text-xl" />
            </span>
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Call Us</p>
              <p className="text-base font-extrabold text-[#315cf0] mt-1.5">+91 98765 43210</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Mon - Sat, 9:00 AM - 7:00 PM</p>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-xs flex flex-col gap-4 text-left transition-shadow duration-300 hover:shadow-lg hover:border-blue-500/10 cursor-pointer min-h-[180px] justify-between"
          >
            <span className="size-11 rounded-2xl bg-blue-50 text-[#315cf0] flex items-center justify-center shrink-0 border border-blue-100/30">
              <FiMail className="text-xl" />
            </span>
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Email Us</p>
              <p className="text-base font-extrabold text-[#315cf0] mt-1.5">hello@queuecure.com</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">We reply within 24 hours</p>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-xs flex flex-col gap-4 text-left transition-shadow duration-300 hover:shadow-lg hover:border-blue-500/10 cursor-pointer min-h-[180px] justify-between"
          >
            <span className="size-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/30">
              <FiMapPin className="text-xl" />
            </span>
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Visit Us</p>
              <p className="text-base font-extrabold text-slate-850 mt-1.5">123, Health Street, Bangalore, 560001</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Mon - Sat, 10:00 AM - 6:00 PM</p>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-xs flex flex-col gap-4 text-left transition-shadow duration-300 hover:shadow-lg hover:border-blue-500/10 cursor-pointer min-h-[180px] justify-between"
          >
            <span className="size-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100/30">
              <FiHeadphones className="text-xl" />
            </span>
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Support</p>
              <p className="text-sm font-extrabold text-slate-850 mt-1.5">help@queuecure.com</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">We're here to help</p>
            </div>
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="md:hidden bg-white rounded-2xl p-3 border border-slate-100 shadow-xs grid grid-cols-4 gap-2 text-center"
        >
          
          <a href="tel:+919876543210" className="flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-200">
            <span className="size-9 rounded-xl bg-blue-50 text-[#315cf0] flex items-center justify-center">
              <FiPhone className="text-base" />
            </span>
            <span className="text-[9px] font-bold text-slate-500">Call Us</span>
          </a>

          
          <a href="mailto:hello@queuecure.com" className="flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-200">
            <span className="size-9 rounded-xl bg-blue-50 text-[#315cf0] flex items-center justify-center">
              <FiMail className="text-base" />
            </span>
            <span className="text-[9px] font-bold text-slate-500">Email Us</span>
          </a>

          
          <a href="#visit" className="flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-200">
            <span className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiMapPin className="text-base" />
            </span>
            <span className="text-[9px] font-bold text-slate-500">Visit Us</span>
          </a>

          
          <a href="mailto:help@queuecure.com" className="flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-200">
            <span className="size-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <FiHeadphones className="text-base" />
            </span>
            <span className="text-[9px] font-bold text-slate-500">Support</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
