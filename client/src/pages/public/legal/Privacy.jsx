import React from "react";
import { FiShield } from "react-icons/fi";

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <FiShield className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold tracking-wider uppercase text-blue-600">Data Protection</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-xs text-slate-500 font-semibold mb-10">
        Last updated: June 24, 2026
      </p>

      <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-8 font-medium">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">1. Information We Collect</h2>
          <p>
            We collect information that clinics provide during registration (such as name, email, and contact details). We also temporarily process basic patient identifiers (like name or initial) to manage live clinic queues.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">2. How We Use Your Information</h2>
          <p>
            We use the collected information to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Facilitate real-time patient queue tracking and estimation.</li>
            <li>Maintain clinic receptionist and doctor sessions securely.</li>
            <li>Send SMS or web-based status updates to patients waiting in queue.</li>
            <li>Provide support and troubleshoot platform issues.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">3. Information Sharing & Disclosure</h2>
          <p>
            We do not sell, rent, or trade your personal data to third parties. We may share data only with trusted infrastructure providers (like SMS APIs and hosting partners) to deliver our service, or if required by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">4. Security Measures</h2>
          <p>
            We employ industry-standard encryption protocols (SSL/TLS) for data transfer and hashing for stored user passwords. While we take strong steps to secure your information, no transmission method over the internet is completely risk-free.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">5. Cookies and Local Storage</h2>
          <p>
            We use secure cookies and browser local storage to maintain session states for logged-in doctors and receptionists, and tracking states for patients who are viewing their queue progress.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">6. Your Rights</h2>
          <p>
            You can request access, update, or deletion of your account and related information at any time. Clinic administrators can manage patient records and clear live queues directly from their control dashboard.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
