import RagDemo from "@/components/demo/demos/rag-demo";
import RhDemo from "@/components/demo/demos/rh-demo";
import LinkedinDemo from "@/components/demo/demos/linkedin-demo";
import CvDemo from "@/components/demo/demos/cv-demo";
import EmailDemo from "@/components/demo/demos/email-demo";
import ScraperDemo from "@/components/demo/demos/scraper-demo";
import SentimentDemo from "@/components/demo/demos/sentiment-demo";
import WorkflowDemo from "@/components/demo/demos/workflow-demo";
import RgpdDemo from "@/components/demo/demos/rgpd-demo";
import GtmDemo from "@/components/demo/demos/gtm-demo";

/** Les 10 démos live, dans l'ordre de la spec. */
export default function DemoList() {
  return (
    <div className="flex flex-col gap-6">
      <RagDemo />
      <RhDemo />
      <LinkedinDemo />
      <CvDemo />
      <EmailDemo />
      <ScraperDemo />
      <SentimentDemo />
      <WorkflowDemo />
      <RgpdDemo />
      <GtmDemo />
    </div>
  );
}
