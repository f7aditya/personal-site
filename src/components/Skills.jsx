import { FadeIn, StaggerParent, StaggerItem } from "./FadeIn";

const CATEGORIES = [
  {
    title: "Crafting Interfaces",
    desc: "Crafting fluid, responsive, and accessible user interfaces.",
    skills: ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "Building the Backbone",
    desc: "Designing scalable APIs and robust data models.",
    skills: ["Node.js", "Express.js", "REST APIs", "PostgreSQL", "MongoDB", "Prisma", "Drizzle ORM", "Redis", "JWT", "WebSockets"],
  },
  {
    title: "Tools of the Trade",
    desc: "Streamlining workflows and ensuring code quality.",
    skills: ["C++", "Git", "GitHub", "Docker", "Postman", "OOP", "DSA", "System Design"],
  },
  {
    title: "Exploring the Future",
    desc: "Experimenting with next-generation AI and language models.",
    skills: ["AI/ML", "LLM APIs", "Embeddings", "RAG", "AI Agents", "LangChain"],
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-16 md:py-20 relative">
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-screen-xl bg-[var(--surface-2)]/30 rounded-3xl -z-10 mx-6 hidden md:block" />

      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <p className="section-label">Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              A refined <span className="gradient-text">toolset.</span>
            </h2>
          </div>
        </FadeIn>

        <StaggerParent className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat.title}>
              <div className="card h-full p-8 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-lg font-bold mb-3">{cat.title}</h3>
                <p className="text-sm text-[var(--fg-muted)] mb-8 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span key={s} className="badge">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerParent>
      </div>
    </section>
  );
}
