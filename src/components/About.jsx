import { FadeIn } from "./FadeIn";

const STATS = [
  { value: "700+", label: "DSA Problems Solved" },
  { value: "02+", label: "Projects Built" },
  { value: "01+", label: "Years Coding" },
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="section-label">About Me</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 max-w-2xl">
            Engineering with <span className="gradient-text">intent.</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="md:col-span-7 space-y-6 text-[var(--fg-muted)] leading-relaxed">
            <FadeIn delay={0.1}>
              <p>
                As a dedicated B.Tech Computer Science engineering student, I engineer robust, highly scalable software designed to tackle complex real-world challenges. My technical foundation is anchored in advanced data structures and algorithms, which seamlessly powers my expertise in modern full-stack development.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p>
                I specialize in architecting resilient backend systems, optimizing API performance, and integrating high-throughput databases with real-time technologies like Redis. I thrive on deconstructing intricate systems and translating demanding requirements into elegant, high-performance solutions.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p>
                Beyond building software, I am an avid competitive programmer on platforms like LeetCode and Codeforces, relentlessly refining my analytical problem-solving capabilities to consistently deliver exceptionally precise, efficient, and creative code.
              </p>
            </FadeIn>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-6">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={0.2 + i * 0.1}>
                <div className="card p-6 text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-bold text-[var(--fg)] mb-2">{stat.value}</p>
                  <p className="text-sm font-mono text-[var(--fg-muted)]">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
