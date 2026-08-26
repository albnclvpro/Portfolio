import SiteHeader from "@/components/site-header";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import CvOrbital from "@/components/sections/cv-orbital";
import Stack from "@/components/sections/stack";
import Contact from "@/components/sections/contact";
import SectionHeading from "@/components/sections/section-heading";
import DemoList from "@/components/demo/demo-list";

export default function Home() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Aller au contenu
      </a>
      <SiteHeader />

      <main id="contenu" className="flex-1">
        <Hero />

        <section id="a-propos" className="scroll-mt-16 border-t border-border">
          <About />
        </section>

        <section id="cv" className="scroll-mt-16 border-t border-border bg-surface">
          <CvOrbital />
        </section>

        <section id="demos" className="scroll-mt-16 border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
            <SectionHeading
              index="03"
              kicker="demos_live"
              title="Des automatisations que vous pouvez tester, là, maintenant."
              description="Chaque carte est branchée sur un vrai workflow n8n : votre input part en webhook, le schéma s'anime pendant l'exécution, le résultat revient en JSON. Ouvrez une carte et testez."
            />
            <DemoList />
          </div>
        </section>

        <section id="stack" className="scroll-mt-16 border-t border-border bg-surface">
          <Stack />
        </section>

        <section id="contact" className="scroll-mt-16 border-t border-border">
          <Contact />
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Alban Calvo</p>
          <p>
            Construit avec Next.js, Tailwind et n8n —{" "}
            <span className="text-primary-ink">vibe coded</span>, vérifié à la main.
          </p>
        </div>
      </footer>
    </>
  );
}
