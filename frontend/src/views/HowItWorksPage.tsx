import { Link } from "@tanstack/react-router";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";

export function HowItWorksPage() {
  return (
    <div className="space-y-6">
      <Section
        title="How File Mitra works"
        description="A practical usage guide: what happens when you use our tools, what to expect from downloads, and where to read deeper explanations."
        titleLevel={1}
      >
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
          <p>
            File Mitra is a browser-based utility hub. You pick a tool, upload files (or work locally in the resume
            builder), adjust settings such as format or quality, then download the result. No account is required for
            the flows shown in the navigation.
          </p>
          <p>
            This page is the high-level manual. For format trade-offs (JPEG vs PNG vs WebP), PDF compression behavior,
            and OCR tips, use the{" "}
            <Link to="/blog" className="font-medium text-indigo-200 underline-offset-2 hover:text-white">
              blog
            </Link>
            —those articles are written as standalone references.
          </p>
        </div>
      </Section>

      <Section title="Typical workflow" description="Most tools follow the same pattern." titleLevel={2}>
        <ol className="max-w-3xl list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-300 sm:text-base">
          <li>
            <strong className="font-medium text-slate-200">Choose the right page.</strong> Use{" "}
            <Link to="/image-tools" className="text-indigo-200 hover:text-white">
              Image Tools
            </Link>{" "}
            or{" "}
            <Link to="/pdf-tools" className="text-indigo-200 hover:text-white">
              PDF Tools
            </Link>{" "}
            for grouped tasks, or open a dedicated route (for example{" "}
            <Link to="/pdf-merge" className="text-indigo-200 hover:text-white">
              Merge PDF
            </Link>
            ) when you already know what you need.
          </li>
          <li>
            <strong className="font-medium text-slate-200">Upload your files.</strong> Keep the tab open until the
            download starts. Large scans or long PDFs may take longer—especially for OCR.
          </li>
          <li>
            <strong className="font-medium text-slate-200">Tune settings.</strong> Quality sliders and output modes
            exist so you can balance size versus clarity. When unsure, prefer a higher quality first, then compress
            again if the file is still too large.
          </li>
          <li>
            <strong className="font-medium text-slate-200">Download and verify.</strong> Open the output locally
            before you delete originals. PDF-to-Office extraction, in particular, depends on how the PDF was authored.
          </li>
        </ol>
      </Section>

      <Section title="Tool directory" description="Direct links to each major workflow." titleLevel={2}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Images" description="Convert or compress raster images.">
            <ul className="list-none space-y-2 p-0 text-sm text-slate-300">
              <li>
                <Link to="/image-tools" className="text-indigo-200 hover:text-white">
                  Image Tools hub
                </Link>
              </li>
              <li>
                <Link to="/image-to-jpeg" className="text-indigo-200 hover:text-white">
                  Image converter
                </Link>
              </li>
              <li>
                <Link to="/image-compressor" className="text-indigo-200 hover:text-white">
                  Image compressor
                </Link>
              </li>
            </ul>
          </Card>
          <Card title="PDFs" description="Create, merge, compress, convert.">
            <ul className="list-none space-y-2 p-0 text-sm text-slate-300">
              <li>
                <Link to="/pdf-tools" className="text-indigo-200 hover:text-white">
                  PDF Tools hub
                </Link>
              </li>
              <li>
                <Link to="/pdf-maker" className="text-indigo-200 hover:text-white">
                  Images to PDF
                </Link>
              </li>
              <li>
                <Link to="/pdf-merge" className="text-indigo-200 hover:text-white">
                  Merge PDFs
                </Link>
              </li>
              <li>
                <Link to="/pdf-compressor" className="text-indigo-200 hover:text-white">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/pdf-convert" className="text-indigo-200 hover:text-white">
                  PDF to Word/Excel
                </Link>
              </li>
            </ul>
          </Card>
          <Card title="Other utilities" description="Text extraction, QR, resume.">
            <ul className="list-none space-y-2 p-0 text-sm text-slate-300">
              <li>
                <Link to="/ocr" className="text-indigo-200 hover:text-white">
                  OCR
                </Link>
              </li>
              <li>
                <Link to="/qr-code" className="text-indigo-200 hover:text-white">
                  QR code generator
                </Link>
              </li>
              <li>
                <Link to="/resume" className="text-indigo-200 hover:text-white">
                  Resume Studio
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section title="Privacy and sensitive files" description="Read this before uploading confidential material." titleLevel={2}>
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          <p>
            Online tools send files to a server for processing unless the feature is explicitly browser-only (for
            example, much of the resume builder and QR preview). If your employer, school, or client forbids
            third-party uploads, do not use web converters for that content.
          </p>
          <p>
            Our high-level data practices are described in the{" "}
            <Link to="/privacy-policy" className="font-medium text-indigo-200 hover:text-white">
              privacy policy
            </Link>
            . When in doubt, use offline software you control.
          </p>
        </div>
      </Section>

      <Section title="If something goes wrong" description="Quick checks before contacting support." titleLevel={2}>
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300 sm:text-base">
          <li>Try a smaller file or fewer pages (especially for OCR).</li>
          <li>Confirm the input format is supported on the tool page.</li>
          <li>Use a current version of Chrome, Firefox, Safari, or Edge.</li>
          <li>
            Still stuck? Use the{" "}
            <Link to="/contact" className="font-medium text-indigo-200 hover:text-white">
              contact form
            </Link>{" "}
            with what you attempted and what you saw (no need to attach sensitive files).
          </li>
        </ul>
      </Section>
    </div>
  );
}
