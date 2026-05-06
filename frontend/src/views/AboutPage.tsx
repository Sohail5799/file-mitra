import { Link } from "@tanstack/react-router";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";

export function AboutPage() {
  return (
    <Section
      title="About File Mitra"
      description="File Mitra is a free, browser-based utility hub for common image and PDF tasks. We focus on clear controls, honest limitations, and editorial context so you know what to expect before you upload. New here? Start with the step-by-step usage guide."
      titleLevel={1}
    >
      <div className="space-y-4">
        <Card title="What you can do here">
          <p className="text-sm leading-relaxed text-slate-300">
            Convert raster images between JPEG, PNG, WebP, and BMP; compress photos for smaller attachments; build
            multi-page PDFs from images; merge or shrink PDFs; extract tables or narrative text into Word or Excel
            where the source PDF allows it; run OCR on scans; generate branded QR codes; and draft a structured
            resume with a live preview. Each flow is intentionally narrow so the UI stays predictable. For the full
            walkthrough, see{" "}
            <Link to="/how-it-works" className="text-indigo-200 hover:text-white">
              How it works
            </Link>
            .
          </p>
        </Card>

        <Card title="How we think about quality">
          <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-slate-300">
            <li>
              <strong className="font-medium text-slate-200">Formats have trade-offs.</strong> JPEG is efficient
              for photos but not transparency; PNG preserves edges and alpha at the cost of size; WebP often
              balances both when ecosystems support it. The{" "}
              <Link to="/blog/$slug" params={{ slug: "jpeg-vs-png-vs-webp-choosing-image-format" }} className="text-indigo-200 hover:text-white">
                format guide
              </Link>{" "}
              explains when to pick which.
            </li>
            <li>
              <strong className="font-medium text-slate-200">PDFs are not magic.</strong> A file that looks like a
              spreadsheet on screen may still be a flat scan. Extraction quality depends on how the PDF was
              authored; we document typical pitfalls in the blog so you can choose the right mode.
            </li>
            <li>
              <strong className="font-medium text-slate-200">OCR rewards good inputs.</strong> Straight pages,
              adequate contrast, and the correct language setting usually beat cranking resolution far beyond what
              the text needs.
            </li>
          </ul>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Who it is for">
            <p className="text-sm leading-relaxed text-slate-300">
              Students cleaning up assignment exports, freelancers sending lighter portfolios, operations teams
              normalizing invoices, and anyone who needs a one-off conversion without a software install. If your
              organization has strict data rules, use your own judgment on what may be uploaded to any third-party
              site.
            </p>
          </Card>

          <Card title="Technology">
            <p className="text-sm leading-relaxed text-slate-300">
              The interface is a React (Vite) single-page app with client-side routing. Heavy lifting for
              conversions, PDF work, and OCR runs on a Python (FastAPI) backend designed around ephemeral
              processing—see the{" "}
              <Link to="/privacy-policy" className="text-indigo-200 hover:text-white">
                privacy policy
              </Link>{" "}
              for how that fits together from a data perspective.
            </p>
          </Card>
        </div>

        <Card title="Editorial content">
          <p className="text-sm leading-relaxed text-slate-300">
            The{" "}
            <Link to="/blog" className="text-indigo-200 hover:text-white">
              blog
            </Link>{" "}
            is part of the product: step-by-step reasoning about compression, resume length, merge order, QR
            contrast, and more. If you want a topic covered, say so via the{" "}
            <Link to="/contact" className="text-indigo-200 hover:text-white">
              contact
            </Link>{" "}
            page.
          </p>
        </Card>

        <Card title="Support">
          <p className="text-sm text-slate-300">
            Sharing the site, citing it in guides you write, and sending concrete bug reports all help. We read
            feedback even when we cannot reply instantly.
          </p>
        </Card>
      </div>
    </Section>
  );
}
