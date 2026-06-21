import { useState, useEffect } from 'react';
import loadingScreenBg from '../../assets/loading-screen.png';
import loadingScreenMobile from '../../assets/loading-screen-mobile.png';
import loadingLens from '../../assets/loading-lens.png';

const SiteLoading = () => {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const duration = 3000;
    const start = performance.now();
    let animationFrameId;

    const updateProgress = (now) => {
      const elapsed = now - start;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);
      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const statusMessage = 'Loading...';
  const subMessage = 'Preparing a better experience for you';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#eff4fc] to-[#f2f6ff] overflow-hidden select-none z-50 p-2 sm:p-4">
      <style>{`
        @keyframes waveFront {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100px); }
        }
        @keyframes waveBack {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(0); }
        }
        .animate-wave-front {
          animation: waveFront 2.5s linear infinite;
        }
        .animate-wave-back {
          animation: waveBack 3.2s linear infinite;
        }
        @keyframes floatPlus {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-plus {
          animation: floatPlus 4s ease-in-out infinite;
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-heart-pulse {
          animation: heartPulse 3s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-float-bubble {
          animation: floatBubble 4s ease-in-out infinite;
        }
      `}</style>

      {isMobile ? (
        /* ==========================================
           MOBILE PORTRAIT LAYOUT
           ========================================== */
        <div
          className="relative @container flex-shrink-0 bg-cover bg-center overflow-hidden rounded-3xl shadow-xl border border-slate-100/30"
          style={{
            width: 'min(95vw, 43.9vh)',
            height: 'auto',
            aspectRatio: '853/1844',
            maxHeight: '95vh',
            backgroundImage: `url(${loadingScreenMobile})`,
          }}
        >
          {/* A. Mobile Logo — top center */}
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-10">
            <div className="flex items-center gap-[1.5cqw]">
              <span className="grid size-[6.5cqw] place-items-center rounded-[1.2cqw] border-[0.4cqw] border-[#2563eb] text-[#2563eb] bg-white shadow-xs font-black text-[4cqw] animate-pulse">
                +
              </span>
              <span className="text-[5.5cqw] font-black text-[#1e293b] tracking-tight">
                Queue <span className="text-[#2563eb]">Cure</span>
              </span>
            </div>
            <span className="text-[2.6cqw] text-slate-500 font-semibold mt-1 opacity-90">
              Smart Queue. Better Care.
            </span>
          </div>

          {/* B. Mobile Heart — centered, upper-mid area */}
          <div
            className="absolute animate-heart-pulse"
            style={{
              top: '22%',
              left: '29%',
              width: '42%',
              aspectRatio: '1/1',
              transformOrigin: 'center',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <clipPath id="heart-clip-mobile">
                  <path d="M50 88.5 L43.5 82.2 C20.4 61.2 5 47.3 5 30.5 C5 16.8 15.8 6 29.5 6 C37.2 6 44.6 9.6 50 15.2 C55.4 9.6 62.8 6 70.5 6 C84.2 6 95 16.8 95 30.5 C95 47.3 79.6 61.2 56.5 82.3 L50 88.5 Z" />
                </clipPath>
              </defs>
              <path d="M50 88.5 L43.5 82.2 C20.4 61.2 5 47.3 5 30.5 C5 16.8 15.8 6 29.5 6 C37.2 6 44.6 9.6 50 15.2 C55.4 9.6 62.8 6 70.5 6 C84.2 6 95 16.8 95 30.5 C95 47.3 79.6 61.2 56.5 82.3 L50 88.5 Z" fill="#ffffff" />
              <g clipPath="url(#heart-clip-mobile)">
                <g style={{ transform: `translateY(${100 - progress}%)`, transition: 'transform 0.25s ease-out' }}>
                  <path
                    className="animate-wave-back"
                    d="M -100 0 C -50 6, -50 -6, 0 0 C 50 6, 50 -6, 100 0 C 150 6, 150 -6, 200 0 L 200 100 L -100 100 Z"
                    fill="#ffc2d1"
                    opacity="0.65"
                  />
                  <path
                    className="animate-wave-front"
                    d="M -100 0 C -50 -6, -50 6, 0 0 C 50 -6, 50 6, 100 0 C 150 -6, 150 6, 200 0 L 200 100 L -100 100 Z"
                    fill="#ff4d6d"
                  />
                </g>
              </g>
              <path d="M50 88.5 L43.5 82.2 C20.4 61.2 5 47.3 5 30.5 C5 16.8 15.8 6 29.5 6 C37.2 6 44.6 9.6 50 15.2 C55.4 9.6 62.8 6 70.5 6 C84.2 6 95 16.8 95 30.5 C95 47.3 79.6 61.2 56.5 82.3 L50 88.5 Z" fill="none" stroke="#ff4d6d" strokeWidth="4" strokeLinejoin="round" />
            </svg>

            {/* Small pulsing hearts around mobile heart */}
            <div
              className="absolute animate-heart-pulse text-[#ff4d6d]"
              style={{
                top: '-9%',
                left: '46%',
                width: '14%',
                height: '14%',
                transformOrigin: 'center',
                animationDelay: '0.2s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <div
              className="absolute animate-heart-pulse text-[#ff4d6d]"
              style={{
                top: '46%',
                left: '-12%',
                width: '12%',
                height: '12%',
                transformOrigin: 'center',
                animationDelay: '0.6s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <div
              className="absolute animate-heart-pulse text-[#ff4d6d]"
              style={{
                top: '42%',
                left: '102%',
                width: '11%',
                height: '11%',
                transformOrigin: 'center',
                animationDelay: '0.4s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
          </div>

          {/* C. Mobile Status Text */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-[85%]" style={{ top: '48%' }}>
            <span className="text-[4.5cqw] font-bold text-slate-700 tracking-wide">
              {statusMessage}
            </span>
            <span className="text-[3cqw] text-slate-500 mt-1">
              {subMessage}
            </span>
          </div>

          {/* D. Mobile Progress Bar */}
          <div
            className="absolute rounded-full bg-white/70 flex items-center"
            style={{
              top: '64%',
              left: '20%',
              width: '60%',
              height: '2.8%',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%)',
              }}
            />
            <img
              src={loadingLens}
              alt="Loading Lens"
              className="absolute transition-all duration-300 ease-out pointer-events-none drop-shadow-sm"
              style={{
                left: `calc(${progress}% - 5cqw)`,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10cqw',
                height: '7.7cqw',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* E. Mobile Percentage */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: '70%' }}>
            <span className="text-[4.8cqw] font-black text-[#2563eb]">
              {Math.round(progress)}%
            </span>
          </div>

          {/* F. Mobile Tagline */}
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <span className="text-[3cqw] font-semibold text-[#2563eb] tracking-wide">
              Your health, our priority
            </span>
            <span className="text-[3.2cqw]">💙</span>
          </div>

          {/* G. Mobile Floating Plus Signs */}
          <div className="absolute top-[14%] left-[8%] w-[4cqw] h-[4cqw] text-[#2563eb]/35 animate-float-plus">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[10%] right-[10%] w-[3.5cqw] h-[3.5cqw] text-[#06b6d4]/45 animate-float-plus" style={{ animationDelay: '1.2s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" /></svg>
          </div>
        </div>
      ) : (
        /* ==========================================
           DESKTOP / TABLET LANDSCAPE LAYOUT (3:2)
           ========================================== */
        <div
          className="relative @container flex-shrink-0 bg-cover bg-center overflow-hidden rounded-2xl shadow-2xl border border-slate-100/40"
          style={{
            width: 'min(95vw, 142.5vh)',
            height: 'auto',
            aspectRatio: '3/2',
            maxHeight: '95vh',
            backgroundImage: `url(${loadingScreenBg})`,
          }}
        >
          {/* 1. Doctor Speech Bubble (heartbeat) */}
          <div
            className="absolute bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center border border-slate-100/50 animate-float-bubble"
            style={{
              top: '31%',
              left: '7%',
              width: '6.5cqw',
              height: '6.5cqw',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] text-[#ff4d6d]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <div
              className="absolute bg-white border-r border-b border-slate-100/50"
              style={{
                bottom: '-0.6cqw',
                right: '1.5cqw',
                width: '1.2cqw',
                height: '1.2cqw',
                transform: 'rotate(45deg)',
              }}
            />
          </div>

          {/* 2. Nurse Speech Bubble (people queue) */}
          <div
            className="absolute bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center border border-slate-100/50 animate-float-bubble"
            style={{
              top: '35%',
              left: '82.5%',
              width: '6.5cqw',
              height: '6.5cqw',
              animationDelay: '0.5s',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-[58%] h-[58%] text-[#2563eb]" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <div
              className="absolute bg-white border-l border-b border-slate-100/50"
              style={{
                bottom: '-0.6cqw',
                left: '1.5cqw',
                width: '1.2cqw',
                height: '1.2cqw',
                transform: 'rotate(45deg)',
              }}
            />
          </div>

          {/* 3. TV Screen Token Number overlay */}
          <div
            className="absolute flex flex-col items-center justify-center text-center select-none"
            style={{
              left: '90.2%',
              top: '47.5%',
              width: '9.2%',
              height: '11.5%',
            }}
          >
            <span className="text-[0.7cqw] font-bold text-slate-400 tracking-wider">
              TOKEN
            </span>
            <span className="text-[2.2cqw] font-black text-slate-500/80 leading-none">
              18
            </span>
          </div>

          {/* A. Desktop Logo — top center */}
          <div className="absolute top-[6%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-10">
            <div className="flex items-center gap-[0.8cqw]">
              <span className="grid size-[3.2cqw] place-items-center rounded-[0.6cqw] border-[0.22cqw] border-[#2563eb] text-[#2563eb] bg-white shadow-sm font-black text-[2cqw] animate-pulse">
                +
              </span>
              <span className="text-[2.8cqw] font-black text-[#1e293b] tracking-tight">
                Queue <span className="text-[#2563eb]">Cure</span>
              </span>
            </div>
            <span className="text-[1.05cqw] text-slate-500 font-semibold mt-[0.3cqw] opacity-90">
              Smart Queue. Better Care.
            </span>
          </div>

          {/* B. Desktop Heart — centered, sits above the two characters */}
          <div
            className="absolute animate-heart-pulse"
            style={{
              top: '19%',
              left: '37%',
              width: '26%',
              aspectRatio: '1/1',
              transformOrigin: 'center',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <clipPath id="heart-clip-desktop">
                  <path d="M50 88.5 L43.5 82.2 C20.4 61.2 5 47.3 5 30.5 C5 16.8 15.8 6 29.5 6 C37.2 6 44.6 9.6 50 15.2 C55.4 9.6 62.8 6 70.5 6 C84.2 6 95 16.8 95 30.5 C95 47.3 79.6 61.2 56.5 82.3 L50 88.5 Z" />
                </clipPath>
              </defs>
              <path d="M50 88.5 L43.5 82.2 C20.4 61.2 5 47.3 5 30.5 C5 16.8 15.8 6 29.5 6 C37.2 6 44.6 9.6 50 15.2 C55.4 9.6 62.8 6 70.5 6 C84.2 6 95 16.8 95 30.5 C95 47.3 79.6 61.2 56.5 82.3 L50 88.5 Z" fill="#ffffff" />
              <g clipPath="url(#heart-clip-desktop)">
                <g style={{ transform: `translateY(${100 - progress}%)`, transition: 'transform 0.25s ease-out' }}>
                  <path
                    className="animate-wave-back"
                    d="M -100 0 C -50 6, -50 -6, 0 0 C 50 6, 50 -6, 100 0 C 150 6, 150 -6, 200 0 L 200 100 L -100 100 Z"
                    fill="#ffc2d1"
                    opacity="0.65"
                  />
                  <path
                    className="animate-wave-front"
                    d="M -100 0 C -50 -6, -50 6, 0 0 C 50 -6, 50 6, 100 0 C 150 -6, 150 6, 200 0 L 200 100 L -100 100 Z"
                    fill="#ff4d6d"
                  />
                </g>
              </g>
              <path d="M50 88.5 L43.5 82.2 C20.4 61.2 5 47.3 5 30.5 C5 16.8 15.8 6 29.5 6 C37.2 6 44.6 9.6 50 15.2 C55.4 9.6 62.8 6 70.5 6 C84.2 6 95 16.8 95 30.5 C95 47.3 79.6 61.2 56.5 82.3 L50 88.5 Z" fill="none" stroke="#ff4d6d" strokeWidth="4" strokeLinejoin="round" />
            </svg>

            {/* Small decorative pulsing hearts around main heart */}
            <div
              className="absolute animate-heart-pulse text-[#ff4d6d]"
              style={{
                top: '-9%',
                left: '36%',
                width: '14%',
                height: '14%',
                transformOrigin: 'center',
                animationDelay: '0.2s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <div
              className="absolute animate-heart-pulse text-[#ff4d6d]"
              style={{
                top: '46%',
                left: '-12%',
                width: '12%',
                height: '12%',
                transformOrigin: 'center',
                animationDelay: '0.6s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <div
              className="absolute animate-heart-pulse text-[#ff4d6d]"
              style={{
                top: '42%',
                left: '102%',
                width: '11%',
                height: '11%',
                transformOrigin: 'center',
                animationDelay: '0.4s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
          </div>

          {/* C. Desktop Loading Status text — below heart */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-[60%]" style={{ top: '60.5%' }}>
            <span className="text-[1.8cqw] font-bold text-slate-700 tracking-wide">
              {statusMessage}
            </span>
            <span className="text-[1.2cqw] text-slate-500 mt-[0.3cqw]">
              {subMessage}
            </span>
          </div>

          {/* D. Desktop Progress Bar — centered */}
          <div
            className="absolute rounded-full bg-white/80 flex items-center"
            style={{
              top: '71%',
              left: '32%',
              width: '36%',
              height: '4.5%',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.07)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%)',
              }}
            />
            <img
              src={loadingLens}
              alt="Loading Lens"
              className="absolute transition-all duration-300 ease-out pointer-events-none drop-shadow-sm"
              style={{
                left: `calc(${progress}% - 2.75cqw)`,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '5.5cqw',
                height: '4.2cqw',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* E. Desktop percentage */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: '78.5%' }}>
            <span className="text-[2cqw] font-black text-[#2563eb]">
              {Math.round(progress)}%
            </span>
          </div>

          {/* F. Desktop footer tagline */}
          <div className="absolute bottom-[4.5%] left-1/2 -translate-x-1/2 flex items-center gap-[0.5cqw]">
            <span className="text-[1.1cqw] font-semibold text-[#2563eb] tracking-wide">
              Your health, our priority
            </span>
            <span className="text-[1.2cqw]">💙</span>
          </div>

          {/* G. Desktop Floating Medical Plus Signs */}
          <div className="absolute top-[10%] left-[14%] w-[1.8cqw] h-[1.8cqw] text-[#2563eb]/35 animate-float-plus">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[6%] left-[28%] w-[1.4cqw] h-[1.4cqw] text-[#06b6d4]/45 animate-float-plus" style={{ animationDelay: '0.8s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[8%] right-[14%] w-[1.6cqw] h-[1.6cqw] text-[#2563eb]/30 animate-float-plus" style={{ animationDelay: '1.6s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[6%] right-[27%] w-[1.2cqw] h-[1.2cqw] text-[#06b6d4]/45 animate-float-plus" style={{ animationDelay: '2.4s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" /></svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteLoading;