import { useState } from "react";
import { FadeIn } from "./FadeIn";

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <p className="section-label">Get in touch</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
            Let's build something <span className="gradient-text">extraordinary.</span>
          </h2>
          <p className="text-[var(--fg-muted)] max-w-xl mx-auto mb-16 leading-relaxed">
            I'm currently open for new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="card p-8 md:p-12 max-w-2xl mx-auto text-left relative overflow-hidden">
            {/* Success state overlay */}
            {status === "success" && (
              <div className="absolute inset-0 z-10 bg-[var(--surface)]/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mb-6 text-[var(--accent)]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
                <p className="text-[var(--fg-muted)] mb-8">I'll get back to you as soon as possible.</p>
                <button onClick={reset} className="btn-ghost">
                  Send Another
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={200}
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={form.message}
                  onChange={handleChange}
                  className="input resize-none"
                  placeholder="Hello, I'd like to talk about..."
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-400" role="alert">
                  {errorMsg}
                </p>
              )}

              <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center">
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
