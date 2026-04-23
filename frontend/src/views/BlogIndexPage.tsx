import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { BLOG_FAQ_ITEMS } from "../content/blogFaq";
import { getAllBlogPosts } from "../content/blogPosts";
import { Section } from "../ui/Section";
import { FaqAccordion } from "../ui/FaqAccordion";

export function BlogIndexPage() {
  const posts = useMemo(() => getAllBlogPosts(), []);
  const faqJsonLd = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: BLOG_FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }),
    []
  );

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
    []
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <div className="space-y-10">
        <Section
          title="File Mitra Blog"
          description="Practical guides on image formats, PDF workflows, OCR, compression, and how to get reliable results from online tools."
          titleLevel={1}
        >
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            These articles are written for people who use converters weekly—operations teams, freelancers, students,
            and anyone who wants fewer surprises in exported files. Share feedback from the contact page if you want a
            topic covered next.
          </p>
          <div className="mt-4 rounded-2xl border border-indigo-300/20 bg-indigo-500/10 p-4">
            <p className="text-sm text-indigo-100">
              New: Hinglish prompt se free AI image banani hai? Try our{" "}
              <Link to="/ai-image-generator" className="font-semibold text-white underline-offset-2 hover:underline">
                AI Image Generator
              </Link>
              .
            </p>
          </div>
        </Section>

        <section aria-labelledby="blog-posts-heading">
          <h2 id="blog-posts-heading" className="text-lg font-semibold text-white sm:text-xl">
            Latest articles
          </h2>
          <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="surface-muted flex h-full flex-col rounded-2xl p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {dateFmt.format(new Date(post.date))} · {post.readMin} min read
                  </div>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-white sm:text-lg">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                  <span className="mt-4 text-xs font-semibold text-indigo-200">Read article →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="blog-faq-heading" className="space-y-4">
          <h2 id="blog-faq-heading" className="text-lg font-semibold text-white sm:text-xl">
            Frequently asked questions
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
            Straight answers about how File Mitra behaves, what to expect from conversions, and how to avoid common
            mistakes—before you upload sensitive files.
          </p>
          <FaqAccordion items={BLOG_FAQ_ITEMS} />
        </section>
      </div>
    </>
  );
}
