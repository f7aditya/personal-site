import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";

const PROJECTS = [
  {
    title: "ApplySync — AI-Powered Job Search Platform",
    description: "A multi-tenant job-search platform featuring semantic gap analysis between resumes and job descriptions. Leverages PostgreSQL with pgvector for nearest-neighbor search, and streams real-time AI insights via Server-Sent Events (SSE) backed by BullMQ and Redis workers.",
    tech: ["React", "Node.js", "PostgreSQL", "pgvector", "Redis"],
    link: "https://github.com/f7aditya",
  },
  {
    title: "DevCollab — Collaborative Code Workspace",
    description: "A full-stack engineering workspace unifying task management and secure file sharing. Features a RESTful Node.js API with optimized database indexing and real-time synchronization via Socket.io for low-latency collaboration across multiple user roles.",
    tech: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Socket.io"],
    link: "https://github.com/f7aditya",
  },
  {
    title: "HealthPulse — Real-Time Healthcare Coordination",
    description: "A centralized healthcare coordination platform enabling low-latency updates for hospital telemetry and patient dispatching. Features a live synchronization network using Socket.io and Redis caching to cut API response latency by 75% for concurrent clients.",
    tech: ["Next.js", "Express", "MongoDB", "Redis", "Socket.io"],
    link: "https://github.com/f7aditya",
  },
  {
    title: "Developer Portfolio",
    description: "A highly interactive, minimalist portfolio featuring seamless dark/light mode toggles, custom design tokens, scroll-driven animations, and responsive layout.",
    tech: ["React.js", "Tailwind CSS", "Framer Motion", "Vite"],
    link: "https://github.com/f7aditya",
  }
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-[calc(100vh-68px)] flex flex-col py-8 relative">
      <div className="max-w-6xl mx-auto px-6 w-full my-auto">
        <FadeIn className="mb-10 md:mb-16">
          <p className="section-label">Selected Work</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
            Focus on <span className="gradient-text">impact.</span>
          </h2>
        </FadeIn>

        <div className="space-y-6">
          {PROJECTS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <motion.a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block card p-8 md:p-10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="md:flex justify-between items-start gap-12">
                  <div className="flex-1 mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-[var(--accent)] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[var(--fg-muted)] leading-relaxed max-w-2xl">
                      {p.description}
                    </p>
                  </div>

                  <div className="shrink-0 md:w-64">
                    <p className="text-xs font-mono text-[var(--fg-dim)] uppercase tracking-widest mb-3">
                      Technologies
                    </p>
                    <ul className="space-y-2">
                      {p.tech.map((t) => (
                        <li key={t} className="text-sm font-medium flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-50" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
