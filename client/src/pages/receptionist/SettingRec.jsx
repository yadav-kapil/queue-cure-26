import { FiSettings, FiUser, FiBell, FiShield, FiPrinter } from 'react-icons/fi'

const SettingRec = () => {
  return (
    <section className="space-y-6">
      {/* Header section */}
      <div>
        <p className="text-sm font-bold uppercase text-[#2459ff]">Settings</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.01em] text-[#07122f] sm:text-4xl">
          Receptionist Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
          Manage your receptionist profile, notification preferences, printer connections, and account security.
        </p>
      </div>

      {/* Main settings panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <SettingCard
          icon={FiUser}
          title="Account Profile"
          desc="Update your name, profile photo, and check current doctor hiring linkage details."
        />
        <SettingCard
          icon={FiPrinter}
          title="Receipt & Printer Setup"
          desc="Configure thermal printer connections, token ticket layout styles, and print automation settings."
        />
        <SettingCard
          icon={FiBell}
          title="Notifications"
          desc="Toggle sounds for new patient self-joins, doctor call alerts, and active queue updates."
        />
        <SettingCard
          icon={FiShield}
          title="Security & Password"
          desc="Change your login credentials, configure two-factor authentication, and review login history."
        />
      </div>
    </section>
  )
}

const SettingCard = ({ icon: Icon, title, desc }) => (
  <article className="rounded-[24px] border border-[#e5eaf4] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_36px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition duration-300 flex flex-col justify-between min-h-[160px] text-left">
    <div className="flex items-start gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#2459ff] border border-[#e8efff] shadow-xs shrink-0">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <h3 className="text-base font-extrabold text-[#07122f]">{title}</h3>
        <p className="mt-2 text-sm text-slate-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
      <span className="text-xs font-black text-[#2459ff] hover:underline cursor-pointer">
        Configure Settings &rarr;
      </span>
    </div>
  </article>
)

export default SettingRec;
