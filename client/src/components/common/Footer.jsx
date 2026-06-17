import { FiPlus } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f7f8fb] pt-8">
      {/* Dark Footer Container - Full Width with Curved Top Corners */}
      <div className="w-full bg-[#090d16] rounded-t-[36px] md:rounded-t-[48px] text-white px-6 py-12 sm:px-10 lg:px-16 sm:py-16">
        <div className="mx-auto max-w-7xl">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start pb-12">
            
            {/* Column 1: Brand Info & Socials (6 Columns on Desktop) */}
            <div className="lg:col-span-6 space-y-6 text-left lg:pr-12 lg:border-r border-slate-800/60 h-full">
              {/* Brand Logo - Matches Navbar */}
              <a href="/" className="inline-flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-[8px] border-2 border-[#2f75ff] text-[#2f75ff]">
                  <FiPlus className="text-lg stroke-[3]" />
                </span>
                <span className="text-lg font-extrabold tracking-normal sm:text-xl">
                  Queue <span className="text-[#2f75ff]">Cure</span>
                </span>
              </a>

              {/* Description */}
              <div className="space-y-2 max-w-sm">
                <p className="text-sm font-extrabold text-slate-300">
                  Smart queue. Better care.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Real-time queue management system for modern clinics and hospitals.
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href="#linkedin" 
                  aria-label="LinkedIn"
                  className="size-9 rounded-full bg-slate-800/80 hover:bg-[#2f75ff] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a 
                  href="#instagram" 
                  aria-label="Instagram"
                  className="size-9 rounded-full bg-slate-800/80 hover:bg-[#2f75ff] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <FaInstagram className="text-sm" />
                </a>
                <a 
                  href="#twitter" 
                  aria-label="X (Twitter)"
                  className="size-9 rounded-full bg-slate-800/80 hover:bg-[#2f75ff] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <FaXTwitter className="text-sm" />
                </a>
                <a 
                  href="#facebook" 
                  aria-label="Facebook"
                  className="size-9 rounded-full bg-slate-800/80 hover:bg-[#2f75ff] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <FaFacebookF className="text-sm" />
                </a>
              </div>
            </div>

            {/* Sub-grid for Menu and Legal columns (6 Columns on Desktop, 2 Columns on Mobile/Tablet) */}
            <div className="grid grid-cols-2 lg:col-span-6 gap-8 text-left md:pl-4 lg:pl-16 w-full">
              
              {/* Column 2: Menu Links */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Menu</h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "Home", href: "#home" },
                    { label: "Features", href: "#features" },
                    { label: "How It Works", href: "#how-it-works" },
                    { label: "Contact", href: "#contact" }
                  ].map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.href} 
                        className="text-xs font-semibold text-slate-400 hover:text-white transition duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Legal Links */}
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Legal</h3>
                <ul className="space-y-2.5">
                  {[
                    "Terms & Condition",
                    "Privacy Policy",
                    "Support",
                    "FAQ"
                  ].map((item) => (
                    <li key={item}>
                      <a 
                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs font-semibold text-slate-400 hover:text-white transition duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Copyright & Legal Links Bar */}
          <div className="border-t border-slate-800/80 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-semibold text-slate-500">
              © {new Date().getFullYear()} Queue Cure. All rights reserved.
            </p>
            <p className="text-xs font-black tracking-widest text-[#2f75ff] uppercase select-none">
              SYSTUMM
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
