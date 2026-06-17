import {
  FiArrowRight,
  FiHeart,
  FiMic,
  FiPlay,
  FiPlus,
  FiVideo,
  FiPhone,
} from "react-icons/fi";
import doctorHero from "../../assets/doctor-hero.png";
import doctorConsultation from "../../assets/doctor-consultation.png";

const Hero = () => {
  return (
    <main id="home" className="px-4 pb-2 pt-20 sm:px-6 lg:px-8 ">
      <section className="relative mx-auto mt-5 max-w-7xl overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_76%_22%,#46b7ff_0%,#356df4_38%,#3541c9_100%)] px-6 pt-10 pb-4 text-white shadow-[0_30px_90px_rgba(21,42,133,0.24)] sm:rounded-[42px] sm:px-10 lg:min-h-[640px] lg:px-14 lg:pt-12 lg:pb-2">
        <div className="relative grid gap-10 lg:grid-cols-[1.36fr_0.64fr] lg:items-end">
          {/* Left Column (Content & Cards) */}
          <div className="relative z-20 max-w-[760px] pt-2 lg:pb-0">
            <div className="mb-5 inline-flex items-center gap-3 text-xs font-medium">
              <span className="grid size-9 place-items-center rounded-full bg-white text-[#315cf0] shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                <FiHeart className="fill-[#315cf0]" />
              </span>
              Smart Queue. Better Care.
            </div>

            <h1 className="max-w-[760px] text-4xl font-extrabold leading-[1.15] tracking-normal sm:text-5xl lg:text-[56px]">
              Real-Time Queue Management for{" "}
              <span className="block text-[#80f5ff]">Modern Clinics</span>
            </h1>

            <p className="mt-4 max-w-2xl text-xs font-normal leading-7 text-white/90 sm:text-base">
              Reduce patient waiting confusion with live token tracking,
              accurate wait-time predictions, and instant queue updates for
              doctors, receptionists, and patients.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#080c14] py-2 pl-5 pr-2 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:bg-white hover:text-[#080c14]"
              >
                Start Free Session
                <span className="grid size-8 place-items-center rounded-full bg-white text-[#080c14] group-hover:bg-[#080c14] group-hover:text-white">
                  <FiArrowRight className="text-base" />
                </span>
              </a>

              <a
                href="#demo"
                className="inline-flex w-fit items-center gap-2 text-xs font-bold transition hover:text-[#80f5ff]"
              >
                <span className="grid size-8 place-items-center rounded-full border border-white/90 bg-white/5 transition hover:bg-white/10">
                  <FiPlay className="ml-0.5 fill-white text-[10px]" />
                </span>
                Watch Demo
              </a>
            </div>

            {/* 100K+ badge for Mobile (below buttons) */}
            <div className="relative mt-7 mb-4 ml-4 lg:hidden w-fit">
              {/* Concentric rings */}
              <div className="absolute inset-[-14px] rounded-full border border-white/10" />
              <div className="absolute inset-[-7px] rounded-full border border-white/20" />

              <div className="relative grid size-28 place-items-center rounded-full border-2 border-white/25 bg-white/10 backdrop-blur-md text-center text-white shadow-md">
                <div>
                  <p className="text-xl font-black">100K+</p>
                  <p className="text-[10px] leading-3 font-semibold text-white/80">
                    Satisfied
                    <br />
                    Patients
                  </p>
                </div>
                <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-white/20 text-white text-[10px]">
                  <FiPlus />
                </span>
              </div>
            </div>

            {/* Unified Cards Grid - 3 columns on mobile and desktop, scaling down on mobile */}
            <div className="mt-7 grid max-w-[720px] grid-cols-3 gap-2 sm:gap-4">
              <div className="flex h-36 flex-col justify-between rounded-2xl bg-white p-2.5 text-[#0d1321] shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:h-44 sm:p-4 lg:h-52">
                <div>
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[7px] font-semibold text-slate-600 sm:text-[10px]">
                    Doctors
                  </span>

                  <h3 className="mt-2 text-[10px] font-bold leading-tight sm:text-sm">
                    Latest Visited Doctors
                  </h3>

                  <p className="mt-1 hidden text-[10px] text-slate-500 sm:block">
                    Trusted healthcare specialists
                  </p>
                </div>

                <div>
                  <div className="flex items-center -space-x-2">
                    {[doctorConsultation, doctorHero, doctorConsultation].map(
                      (src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt=""
                          className="size-6 rounded-full border-2 border-white object-cover sm:size-8"
                        />
                      ),
                    )}

                    <div className="grid size-6 place-items-center rounded-full border-2 border-white bg-[#315cf0] text-[7px] font-bold text-white sm:size-8 sm:text-[9px]">
                      +5K
                    </div>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-base font-extrabold leading-none sm:text-2xl">
                        5K+
                      </p>
                      <p className="text-[7px] text-slate-500 sm:text-[10px]">
                        Doctors
                      </p>
                    </div>

                    <div className="hidden rounded-xl bg-emerald-50 px-2 py-1 sm:block">
                      <span className="text-[10px] font-semibold text-emerald-600">
                        ★ 4.9
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Online Consultation (waving doctor) */}
              <div className="relative h-36 overflow-hidden rounded-2xl bg-[#a2ebf2] shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:h-44 lg:h-52">
                <img
                  src={doctorConsultation}
                  alt="Doctor greeting patient in an online consultation"
                  className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
                />
                <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 sm:gap-2 rounded-full bg-white/20 px-1.5 py-1 sm:px-3 sm:py-1.5 backdrop-blur-md">
                  <span className="grid size-6 sm:size-8 place-items-center rounded-full bg-white text-slate-700 shadow-md">
                    <FiVideo className="text-[10px] sm:text-xs text-slate-600" />
                  </span>
                  <span className="grid size-6 sm:size-8 place-items-center rounded-full bg-[#ef4444] text-white shadow-md">
                    <FiPhone className="text-[10px] sm:text-xs rotate-[135deg]" />
                  </span>
                  <span className="grid size-6 sm:size-8 place-items-center rounded-full bg-white text-slate-700 shadow-md">
                    <FiMic className="text-[10px] sm:text-xs text-slate-600" />
                  </span>
                </div>
              </div>

              {/* Card 3: Diagnosis Success */}
              <div className="flex h-36 flex-col justify-between rounded-2xl bg-white p-2.5 text-[#0d1321] shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:h-44 sm:p-4 lg:h-52">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[7px] font-semibold text-slate-600 sm:text-[10px]">
                    Analytics
                  </span>

                  <span className="hidden rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600 sm:inline-flex">
                    +12%
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <div className="grid size-12 place-items-center rounded-full bg-[conic-gradient(#315cf0_0_96%,#dbe4ff_96%_100%)] sm:size-16">
                    <div className="grid size-8 place-items-center rounded-full bg-white text-[10px] font-extrabold sm:size-11 sm:text-sm">
                      96%
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] font-bold sm:text-xs">
                    Successful Diagnosis
                  </p>

                  <p className="mt-0.5 hidden text-[9px] text-slate-500 sm:block">
                    Accuracy across consultations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Placeholder for desktop spacing & 100K+ badge) */}
          <div className="relative h-full w-full hidden lg:block">
            {/* 100K+ badge for Desktop */}
            <div className="absolute right-[1%] top-[10%] z-20">
              <div className="relative w-fit">
                {/* Concentric rings */}
                <div className="absolute inset-[-16px] rounded-full border border-white/10" />
                <div className="absolute inset-[-8px] rounded-full border border-white/20" />

                <div className="relative grid size-32 place-items-center rounded-full border-2 border-white/25 bg-white/10 backdrop-blur-md text-center text-white shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
                  <div>
                    <p className="text-2xl font-black">100K+</p>
                    <p className="text-[11px] leading-3 font-semibold text-white/80">
                      Satisfied
                      <br />
                      Patients
                    </p>
                  </div>
                  <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-white/20 text-white text-xs">
                    <FiPlus />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Image - Absolute positioned, shared between Mobile and Desktop */}
        <img
          src={doctorHero}
          alt="Smiling doctor for Queue Cure clinic queue management"
          className="absolute bottom-[-48px] right-[-20px] z-10 h-[500px] object-contain drop-shadow-[0_28px_45px_rgba(15,23,42,0.16)] sm:h-[560px] lg:bottom-[-48px] lg:left-[78%] lg:right-auto lg:h-auto lg:w-[400px] xl:w-[480px] lg:-translate-x-1/2"
        />
      </section>
    </main>
  );
};

export default Hero;
