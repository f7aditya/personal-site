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
    <section id="skills" className="min-h-[calc(100vh-68px)] flex flex-col py-8 relative">
      <div className="max-w-screen-xl mx-auto relative px-4 sm:px-6 w-full my-auto">
        
        {/* Background blob bound to the inner container */}
        <div className="absolute inset-0 bg-[var(--surface-2)]/30 rounded-3xl -z-10 hidden md:block" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <FadeIn>
            <div className="text-center mb-8 md:mb-10">
              <p className="section-label mb-2">Capabilities</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                A refined <span className="gradient-text">toolset.</span>
              </h2>
            </div>
          </FadeIn>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat.title}>
              <div className="card h-full p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-lg font-bold mb-2">{cat.title}</h3>
                <p className="text-sm text-[var(--fg-muted)] mb-5 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {cat.skills.map((s) => (
                    <span key={s} className="badge px-3 py-1 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerParent>
        </div>
      </div>
    </section>
  );
}
