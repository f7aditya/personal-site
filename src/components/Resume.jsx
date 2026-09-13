import { FadeIn } from "./FadeIn";

const TIMELINE = [
  {
    type: "PROJECT",
    date: "Jul 2026 – Present",
    title: "ApplySync (Full-Stack Developer)",
    org: "AI-Powered Job Search Platform",
    desc: "Designed a multi-tenant platform with PostgreSQL Row-Level Security, streaming real-time AI gap analysis via SSE, BullMQ, and Redis workers.",
  },
  {
    type: "PROJECT",
    date: "May 2026 – Present",
    title: "DevCollab (Full-Stack Developer)",
    org: "Collaborative Engineering Workspace",
    desc: "Built a collaborative workspace unifying task management and secure file sharing with a RESTful Node.js API and real-time Socket.io synchronization.",
  },
  {
    type: "PROJECT",
    date: "Apr 2026 – Present",
    title: "HealthPulse (Full-Stack Developer)",
    org: "Real-Time Healthcare Coordination",
    desc: "Engineered a centralized platform for tracking hospital resources and patient dispatching, utilizing Redis caching and Socket.io for low-latency live updates.",
  },
  {
    type: "EDUCATION",
    date: "2023 – 2027",
    title: "B.Tech in Computer Science & Engineering",
    org: "JSS Academy of Technical Education, Noida",
    desc: "Building a strong foundation in data structures, algorithms, computer science fundamentals, and modern software development.",
  },
  {
    type: "COMPETITIVE PROGRAMMING",
    date: "2024 – Present",
    title: "Competitive Programmer",
    org: "LeetCode & Codeforces",
    desc: "Solved 600+ algorithmic problems. Codeforces Expert (1660 peak) and LeetCode rating 1684. Ranked 149th out of 15,000+ in CF Round 1105 (Div. 2).",
  }
];

export default function Resume() {
  return (
    <section id="resume" className="min-h-[calc(100vh-68px)] flex flex-col py-8 relative">
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-gradient-to-l from-[var(--surface-2)]/40 to-transparent -z-10" />

      <div className="max-w-6xl mx-auto px-6 w-full my-auto">
        <div className="grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <div className="sticky top-32">
              <FadeIn>
                <p className="section-label">Journey</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Experience &amp; <span className="gradient-text">education.</span>
                </h2>
                <p className="text-[var(--fg-muted)] leading-relaxed mb-10">
                  A timeline of my academic background and professional experience building software.
                </p>
                <a 
                  href="/resume.pdf?v=2" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-ghost"
                >
                  View Full Resume
                </a>
              </FadeIn>
            </div>
          </div>

          <div className="md:col-span-7 space-y-12">
            {TIMELINE.map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="group relative pl-8 md:pl-10">
                  {/* Timeline line & dot */}
                  <div className="absolute left-[3px] top-2 bottom-[-3rem] w-[2px] bg-[var(--border)] group-last:bottom-0" />
                  <div className="absolute left-0 top-2.5 w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />

                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="badge">{item.type}</span>
                    <span className="text-sm font-mono text-[var(--fg-dim)]">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-[var(--accent-2)] text-sm font-medium mb-4">{item.org}</p>
                  <p className="text-[var(--fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
