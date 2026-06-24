import React from "react";
import { FiBookOpen } from "react-icons/fi";

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <FiBookOpen className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold tracking-wider uppercase text-blue-600">Legal Agreement</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
        Terms of Service
      </h1>
      <p className="text-xs text-slate-500 font-semibold mb-10">
        Last updated: June 24, 2026
      </p>

      <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-8 font-medium">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Queue Cure services, platforms, or applications, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">2. Description of Service</h2>
          <p>
            Queue Cure provides cloud-based real-time queue management solutions for medical clinics and patients. We offer scheduling, digital check-ins, status notifications, and receptionist dashboards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">3. Account Registration & Security</h2>
          <p>
            Clinic administrators and doctors are required to register for an account to use the management features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">4. Patient Data & Privacy</h2>
          <p>
            We take privacy seriously. Clinic staff must only enter information necessary for queue management. Patient tracking is temporary, and session records are updated dynamically. Please refer to our Privacy Policy for details on how we store and handle data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">5. Acceptable Use Policy</h2>
          <p>
            You agree not to use the platform for any illegal activities, to disrupt server integrity, or to input fraudulent patient information. We reserve the right to suspend accounts that violate this policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">6. Limitation of Liability</h2>
          <p>
            Queue Cure is provided "as is" without warranties of any kind. We are not liable for any service interruptions, queue delays, or any direct or indirect damages resulting from the use or inability to use our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify clinics of any material changes by updating the date on this page. Continuing to use Queue Cure after updates constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
