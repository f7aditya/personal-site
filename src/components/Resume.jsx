import { FadeIn } from "./FadeIn";

const TIMELINE = [
  {
    type: "EDUCATION",
    date: "2023 – 2027",
    title: "B.Tech in Computer Science & Engineering",
    org: "JSS Academy of Technical Education, Noida",
    desc: "Building a strong foundation in data structures, algorithms, computer science fundamentals, and modern software development.",
  },
  {
    type: "PROJECT",
    date: "2025 – Present",
    title: "HealthPulse (Full-Stack Developer)",
    org: "Full-Stack Project",
    desc: "Built a healthcare resource management platform for tracking hospital beds, blood inventory, and resource availability with secure authentication and real-time updates.",
  },
  {
    type: "PROJECT",
    date: "2025 – Present",
    title: "DevCollab (Full-Stack Developer)",
    org: "Full-Stack Project",
    desc: "Developed a collaborative developer platform for project management, team collaboration, role-based access, notifications, and real-time communication.",
  },
  {
    type: "COMPETITIVE PROGRAMMING",
    date: "2024 – Present",
    title: "Competitive Programmer",
    org: "LeetCode & Codeforces",
    desc: "Solved 700+ algorithmic problems, strengthening problem-solving skills across data structures, algorithms, dynamic programming, graphs, and optimization.",
  }
];

export default function Resume() {
  return (
    <section id="resume" className="py-16 md:py-24 lg:py-32 relative">
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-gradient-to-l from-[var(--surface-2)]/40 to-transparent -z-10" />

      <div className="max-w-6xl mx-auto px-6">
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
                <a href="/resume.pdf" download className="btn-ghost">
                  Download Full Resume
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
