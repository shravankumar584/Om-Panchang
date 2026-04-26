import { useState, useEffect } from "react";

type LegalVariant = "disclaimer" | "contact" | "privacy";

const NAV_LINKS = [
  { href: "/", label: "← Back to Om Panchang" },
];

function Header({ title, sub, icon }: { title: string; sub: string; icon: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white px-6 py-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-4xl">{icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-indigo-200 text-sm">{sub}</p>
        </div>
      </div>
      <a href="/" className="inline-block mt-3 text-indigo-300 hover:text-white text-sm underline underline-offset-2 transition">
        ← Back to Om Panchang
      </a>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-indigo-700 mb-2 border-b border-indigo-100 pb-1">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function DisclaimerPage() {
  useEffect(() => {
    document.title = "Disclaimer – Om Panchang";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Om Panchang disclaimer: Hindu Panchang, Kundali, Muhurta and festival information is for general informational and educational purposes only. Read our full disclaimer.");
  }, []);
  return (
    <>
      <Header
        icon="📋"
        title="Disclaimer"
        sub="Important information about Om Panchang"
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <p className="text-xs text-slate-400 mb-6">Last updated: April 2026</p>

        <Section title="General Information Only">
          <p>
            Om Panchang (<strong>ompanchang.com</strong>) provides Hindu calendar, Panchang, Vedic
            astrology, and Jyotish information for <strong>informational and educational
            purposes only</strong>. All content, including tithi, nakshatra, planetary positions,
            kundali charts, muhurta timings, and festival dates, is generated using standard
            astronomical algorithms and classical Jyotish formulas.
          </p>
          <p>
            The information on this website does <strong>not</strong> constitute professional
            astrological, religious, medical, financial, or legal advice. Always consult a
            qualified Jyotishi (astrologer) or relevant professional for important life decisions.
          </p>
        </Section>

        <Section title="Accuracy of Calculations">
          <p>
            While we strive for accuracy, astronomical calculations involve approximations.
            Sunrise/sunset times, tithi boundaries, nakshatra transitions, and planetary positions
            may vary slightly from those published by regional Panchang authorities or local
            temples. For official religious purposes, please refer to your local Pandit or
            temple calendar.
          </p>
          <p>
            Muhurta (auspicious timing) recommendations are algorithmic suggestions based on
            classical texts. Individual circumstances, family tradition, and professional
            astrological guidance should always take precedence.
          </p>
        </Section>

        <Section title="Baby Name Suggestions">
          <p>
            Baby name suggestions provided by Om Panchang are based on traditional Nakshatra
            syllable guidelines. These are general recommendations only. Naming decisions are
            deeply personal and should involve family elders, priests, or a qualified astrologer.
          </p>
        </Section>

        <Section title="No Warranties">
          <p>
            Om Panchang is provided "as is" without any warranties, express or implied. We make
            no guarantees regarding the completeness, reliability, or accuracy of the information.
            Your use of this website is at your own risk.
          </p>
        </Section>

        <Section title="External Links">
          <p>
            This website may contain links to third-party websites (such as Google Calendar).
            We have no control over the content of those sites and accept no responsibility for
            their content or privacy practices.
          </p>
        </Section>

        <Section title="Changes to This Disclaimer">
          <p>
            We reserve the right to update this disclaimer at any time. Continued use of the
            website after changes constitutes acceptance of the revised disclaimer.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For questions about this disclaimer, please{" "}
            <a href="/contact-us" className="text-indigo-600 underline hover:text-indigo-800">
              contact us
            </a>.
          </p>
        </Section>
      </div>
    </>
  );
}

function ContactPage() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    document.title = "Contact Om Panchang – Get in Touch";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Contact the Om Panchang team. Send us questions about Hindu Panchang calculations, report a calculation error, request a feature, or suggest a city. We respond within 2–3 business days.");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // Open mail client with pre-filled data
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const mailtoLink = `mailto:ompanchang.org@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <>
      <Header
        icon="✉️"
        title="Contact Us"
        sub="We'd love to hear from you"
      />
      <div className="max-w-xl mx-auto px-6 py-8">
        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🙏</div>
            <h2 className="text-lg font-bold text-green-800 mb-2">Thank You!</h2>
            <p className="text-sm text-green-700">
              Your email client should have opened with a pre-filled message.
              If it did not open,  please email us directly at{" "}
              <a href="mailto:ompanchang.org@gmail.com" className="underline font-medium">
                ompanchang.org@gmail.com
              </a>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-indigo-600 underline hover:text-indigo-800"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">
              Have a question, found an error in our calculations, or want to suggest a feature?
              We're a small team and read every message. Use the form below or email us at{" "}
              <a href="mailto:ompanchang.org@gmail.com" className="text-indigo-600 underline">
                ompanchang.org@gmail.com
              </a>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ramesh Sharma"
                  className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1.5">
                  Subject
                </label>
                <select
                  value={subject} onChange={e => setSubject(e.target.value)}
                  className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  <option>General Inquiry</option>
                  <option>Calculation Error / Bug Report</option>
                  <option>Feature Request</option>
                  <option>Festival / Event Missing</option>
                  <option>City / Location Request</option>
                  <option>Business / Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1.5">
                  Message *
                </label>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  rows={5} placeholder="Tell us how we can help…"
                  className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition shadow-md text-sm"
              >
                ✉️ Send Message
              </button>
            </form>

            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-slate-500 space-y-1">
              <p><strong className="text-indigo-700">📍 Om Panchang</strong></p>
              <p>Email: <a href="mailto:ompanchang.org@gmail.com" className="text-indigo-600 underline">ompanchang.org@gmail.com</a></p>
              <p>We typically respond within 2–3 business days.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy – Om Panchang";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Om Panchang privacy policy: We do not collect personal data. Birth details for Kundali and Baby Names are processed locally in your browser. Learn how we handle ads, cookies and analytics.");
  }, []);
  return (
    <>
      <Header
        icon="🔒"
        title="Privacy Policy"
        sub="How we handle your information"
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <p className="text-xs text-slate-400 mb-6">Last updated: April 2026</p>

        <Section title="Information We Collect">
          <p>
            Om Panchang does <strong>not</strong> collect, store, or sell personal information.
            We do not require account registration or login to use any feature.
          </p>
          <p>
            <strong>Locally stored preferences:</strong> Your selected city, dark mode preference,
            and language choice are saved in your browser's localStorage. This data never leaves
            your device.
          </p>
        </Section>

        <Section title="Birth Data (Kundali & Baby Names)">
          <p>
            Any birth date, time, or location you enter into our Kundali or Baby Names features
            is processed <strong>entirely in your browser</strong>. This data is never transmitted
            to our servers or stored anywhere.
          </p>
        </Section>

        <Section title="Advertising & Cookies">
          <p>
            We use <strong>Google AdSense</strong> to display advertisements on this website.
            Google AdSense uses cookies to serve ads based on your prior visits to this website
            and other sites on the internet. These cookies allow Google and its partners to serve
            ads based on your visit to our site and/or other sites on the Internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              Google Ads Settings
            </a>{" "}or{" "}
            <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              aboutads.info
            </a>.
            Google's use of advertising cookies is governed by{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              Google's Privacy Policy
            </a>.
          </p>
          <p>
            We may also use privacy-respecting analytics (such as Google Analytics) to understand
            aggregate usage patterns. This data is anonymized and does not identify individual users.
            You can opt out via the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>
            <strong>Google AdSense:</strong> We partner with Google AdSense to serve ads. Google
            may use information about your visits to this and other websites to provide relevant
            advertisements. See{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              How Google uses data when you use our partners' sites or apps
            </a>.
          </p>
          <p>
            <strong>Google Calendar:</strong> If you click "+ GCal" on a festival, you are
            redirected to Google Calendar. We pass only the event name and date as URL parameters.
            Google's privacy policy governs what happens on their platform.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>
            Our website is not directed at children under 13. We do not knowingly collect
            information from children.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We encourage you to review
            this page periodically. Changes are effective immediately upon posting.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            If you have questions about this Privacy Policy, please{" "}
            <a href="/contact-us" className="text-indigo-600 underline hover:text-indigo-800">
              contact us
            </a>.
          </p>
        </Section>
      </div>
    </>
  );
}

export default function LegalPage({ page }: { page: LegalVariant }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {page === "disclaimer" && <DisclaimerPage />}
      {page === "contact"    && <ContactPage />}
      {page === "privacy"    && <PrivacyPage />}

      <footer className="text-center py-6 text-slate-400 text-xs border-t border-indigo-100 bg-white mt-8">
        <p className="font-medium text-slate-500">🕉️ Om Panchang · Hindu Calendar & Vedic Almanac 🕉️</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/" className="hover:text-indigo-600 transition">Home</a>
          <a href="/disclaimer" className="hover:text-indigo-600 transition">Disclaimer</a>
          <a href="/contact-us" className="hover:text-indigo-600 transition">Contact Us</a>
          <a href="/privacy-policy" className="hover:text-indigo-600 transition">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
