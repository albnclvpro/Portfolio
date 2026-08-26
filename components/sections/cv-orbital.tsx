"use client";

import Reveal from "@/components/reveal";
import SectionHeading from "@/components/sections/section-heading";
import RadialOrbitalCv from "@/components/ui/radial-orbital-cv";
import { cvNodes } from "@/lib/cv-data";

export default function CvOrbital() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        index="02"
        kicker="cv_interactif"
        title="Le parcours, en orbite."
        description="Huit nœuds gravitent autour du profil : compétences, expériences et formations extraites du CV. Cliquez sur un nœud — le détail se déploie et les compétences liées s'illuminent."
      />
      <Reveal>
        <RadialOrbitalCv nodes={cvNodes} />
      </Reveal>
    </div>
  );
}
