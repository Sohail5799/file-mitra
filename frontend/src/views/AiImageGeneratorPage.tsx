import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { generateImageFromPrompt } from "../lib/api";
import { showError, showSuccess } from "../lib/alerts";

export function AiImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const generator = useMutation({
    mutationFn: async () => {
      const text = prompt.trim();
      if (text.length < 3) {
        throw new Error("Please enter a more detailed prompt (minimum 3 characters).");
      }
      return generateImageFromPrompt({ prompt: text });
    },
    onSuccess: (data) => {
      setGeneratedImageUrl(data.imageUrl);
      void showSuccess(data.message);
    },
    onError: (error) => {
      void showError((error as Error).message);
    }
  });

  useEffect(() => {
    if (!generator.isPending) return;
    setProgress(6);
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        if (prev < 35) return prev + 6;
        if (prev < 70) return prev + 4;
        return prev + 2;
      });
    }, 700);
    return () => window.clearInterval(timer);
  }, [generator.isPending]);

  useEffect(() => {
    if (generator.isSuccess) {
      setProgress(100);
      const reset = window.setTimeout(() => setProgress(0), 1200);
      return () => window.clearTimeout(reset);
    }
    if (generator.isError) {
      setProgress(0);
    }
    return undefined;
  }, [generator.isSuccess, generator.isError]);

  const progressLabel = useMemo(() => {
    if (!generator.isPending) return "";
    if (progress < 35) return "Processing your prompt...";
    if (progress < 70) return "Rendering your image...";
    return "Applying final touches...";
  }, [generator.isPending, progress]);

  return (
    <Section
      title="AI Image Generator"
      description="Write a prompt, generate an image with Cloudflare Workers AI, and preview or download it instantly."
      titleLevel={1}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card
          title="Generate Image from Text"
          description="Example: a futuristic city with neon lights, rainy night, ultra-detailed."
        >
          <label className="text-xs text-slate-400">Prompt</label>
          <textarea
            className="input mt-2 min-h-[130px] resize-y"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
          />

          <button
            type="button"
            onClick={() => generator.mutate()}
            disabled={generator.isPending}
            className="btn-primary mt-4 w-full disabled:opacity-60"
          >
            {generator.isPending ? "Generating image..." : "Generate Image"}
          </button>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            If generation is slow, please wait a bit. If it times out, retry with the same prompt.
          </p>
        </Card>

        <Card title="Preview">
          {generator.isPending ? (
            <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                <span>{progressLabel}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                This is an estimated progress value. The model API does not provide exact generation percentages.
              </p>
            </div>
          ) : null}

          {generatedImageUrl ? (
            <div className="space-y-3">
              <img
                src={generatedImageUrl}
                alt="Generated artwork"
                className="w-full rounded-xl border border-white/10 bg-black/20 object-cover"
                loading="lazy"
              />
              <a href={generatedImageUrl} download className="btn-secondary w-full text-center">
                Download Image
              </a>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-sm text-slate-400">
              Your generated image will appear here.
            </div>
          )}
        </Card>
      </div>

      <Card title="More tools" className="mt-4">
        <div className="flex flex-wrap gap-2">
          <Link to="/image-tools" className="btn-secondary">
            Image Tools
          </Link>
          <Link to="/pdf-tools" className="btn-secondary">
            PDF Tools
          </Link>
          <Link to="/blog" className="btn-secondary">
            Read Blog
          </Link>
        </div>
      </Card>
    </Section>
  );
}
