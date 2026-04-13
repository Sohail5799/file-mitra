import { Section } from "../ui/Section";
import { Card } from "../ui/Card";

export function PrivacyPolicyPage() {
  return (
    <Section
      title="Privacy Policy"
      description="Your files stay private and are processed only for conversion tasks."
      titleLevel={1}
    >
      <div className="space-y-4">
        <Card title="Data retention" description="Uploaded files are auto-cleaned after processing window." />
        <Card title="Usage analytics" description="Only minimal aggregate usage stats are stored." />
        <Card title="Security" description="All transfers should run on HTTPS in production deployment." />
      </div>
    </Section>
  );
}

