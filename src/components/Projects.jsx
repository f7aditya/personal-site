import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";

const PROJECTS = [
  {
    title: "HealthPulse — Real-Time Healthcare Coordination",
    description: "A full-stack healthcare platform for managing hospital resources, including bed availability and blood inventory. Built with secure hospital authentication, resource management APIs, and real-time updates to help coordinate critical healthcare information efficiently.",
    tech: ["Node.js", "React", "MongoDB", "Redis", "REST APIs"],
    link: "https://github.com/f7aditya",
  },
  {
    title: "DevCollab — Collaborative Code Workspace",
    description: "A collaborative developer platform that enables teams to work together in shared coding environments. Features real-time code synchronization, room-based collaboration, role-based access control, and seamless communication between team members.",
    tech: ["WebSockets", "React", "Express.js", "MongoDB", "Node.js"],
    link: "https://github.com/f7aditya",
  },
  {
    title: "Developer Portfolio",
    description: "A highly interactive, minimalist portfolio featuring seamless dark/light mode toggles, custom design tokens, scroll-driven animations, and responsive layout.",
    tech: ["React.js", "Tailwind CSS", "Framer Motion", "Vite"],
    link: "https://github.com/f7aditya",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-16">
          <p className="section-label">Selected Work</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
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
