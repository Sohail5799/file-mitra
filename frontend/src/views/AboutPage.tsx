import { Section } from "../ui/Section";
import { Card } from "../ui/Card";

export function AboutPage() {
  return (
    <Section
      title="About Us"
      description="Welcome to File Mitra - your all-in-one free file toolkit designed to make everyday file tasks simple, fast, and hassle-free."
      titleLevel={1}
    >
      <div className="space-y-4">
        <Card title="Our Mission">
          <p className="text-sm text-slate-300">
            Our mission is simple - to make file handling effortless for everyone.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-slate-300">
            <li>Fast</li>
            <li>Free</li>
            <li>Easy to use</li>
          </ul>
        </Card>

        <Card title="What We Offer">
          <ul className="list-disc space-y-1 pl-4 text-sm text-slate-300">
            <li>Image to PDF and PDF to Image conversion</li>
            <li>File format conversion (PDF, DOC, Excel, JPG, PNG)</li>
            <li>Image and PDF compression</li>
            <li>OCR (Image to Text extraction)</li>
            <li>PDF merge and split tools</li>
            <li>Instant downloads with clean output</li>
          </ul>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Technology We Use">
            <ul className="list-disc space-y-1 pl-4 text-sm text-slate-300">
              <li>Frontend: React (Vite) with TanStack Query</li>
              <li>Backend: Python-based processing services</li>
              <li>Architecture: Fast and scalable for real-time file handling</li>
            </ul>
          </Card>

          <Card title="Privacy and Security">
            <p className="text-sm text-slate-300">
              Your files are never stored permanently. Files are processed securely and automatically deleted
              after processing. We do not collect unnecessary data.
            </p>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Our Focus">
            <ul className="list-disc space-y-1 pl-4 text-sm text-slate-300">
              <li>Speed - fast processing with minimal wait time</li>
              <li>Clean Output - no watermarks, no clutter</li>
              <li>Simplicity - easy interface for everyone</li>
            </ul>
          </Card>

          <Card title="Why We Built This">
            <p className="text-sm text-slate-300">
              Most online tools are slow, full of ads, require login, or add watermarks. We wanted a clean,
              fast, and free tool that just works.
            </p>
          </Card>
        </div>

        <Card title="Support Us">
          <p className="text-sm text-slate-300">
            If you find this tool helpful, support us by sharing it with others, using it regularly, and
            sending feedback.
          </p>
        </Card>

        {/* <Card title="Contact">
          <p className="text-sm text-slate-300">Have suggestions or feedback? We would love to hear from you.</p>
          <p className="mt-2 text-sm font-medium text-white">Email: support@[yourdomain].com</p>
          <p className="mt-2 text-xs text-slate-400">File Mitra - Fast, private, and simple.</p>
        </Card> */}
      </div>
    </Section>
  );
}

