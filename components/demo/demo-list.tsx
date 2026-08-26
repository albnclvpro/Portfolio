import RagShowcase from "@/components/demo/rag-showcase";
import RhDemo from "@/components/demo/demos/rh-demo";
import LinkedinDemo from "@/components/demo/demos/linkedin-demo";
import CvDemo from "@/components/demo/demos/cv-demo";
import EmailDemo from "@/components/demo/demos/email-demo";
import ScraperDemo from "@/components/demo/demos/scraper-demo";
import SentimentDemo from "@/components/demo/demos/sentiment-demo";
import RgpdDemo from "@/components/demo/demos/rgpd-demo";
import GtmDemo from "@/components/demo/demos/gtm-demo";

/** Étude de cas RAG en ouverture, puis les 8 démos live. */
export default function DemoList() {
  return (
    <div className="flex flex-col gap-6">
      <RagShowcase />
      <RhDemo />
      <LinkedinDemo />
      <CvDemo />
      <EmailDemo />
      <ScraperDemo />
      <SentimentDemo />
      <RgpdDemo />
      <GtmDemo />
    </div>
  );
}
