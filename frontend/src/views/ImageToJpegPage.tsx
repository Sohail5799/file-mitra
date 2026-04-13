import { ImageJpegConverter } from "./tools/ImageJpegConverter";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";

export function ImageToJpegPage() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="md:col-span-3">
        <Section
          title="Image Converter"
          description="Upload an image, choose output format, and download."
        >
          <ImageJpegConverter />
        </Section>
      </div>

      <aside className="md:col-span-1 space-y-4">
        <Card title="Formats" description="Available output types.">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>JPEG</li>
            <li>PNG</li>
            <li>WEBP</li>
            <li>BMP</li>
          </ul>
        </Card>
        <Card title="Tips" description="Better output quality">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Use quality 90+ for clear text.</li>
            <li>PNG is best for graphics/screenshots.</li>
            <li>WEBP gives smaller size with good quality.</li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}

