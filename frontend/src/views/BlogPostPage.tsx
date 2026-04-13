import { useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { getBlogPostBySlug } from "../content/blogPosts";
import { SITE_NAME, SITE_ORIGIN } from "../lib/site";
import { Section } from "../ui/Section";
import { BlogBody } from "../ui/BlogBody";

function slugFromPath(pathname: string): string {
  const m = pathname.match(/^\/blog\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export function BlogPostPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const slug = slugFromPath(pathname);
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  const articleLd = useMemo(() => {
    if (!post) return "";
    const url = `${SITE_ORIGIN}/blog/${post.slug}`;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": "Organization",
        name: SITE_NAME
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_ORIGIN
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url
      },
      url,
      keywords: post.keywords
    });
  }, [post]);

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
    []
  );

  if (!post) {
    return (
      <Section title="Article not found" description="That blog URL does not match a published post." titleLevel={1}>
        <p className="text-sm text-slate-400">
          The link may be outdated or mistyped. Browse all posts from the blog home.
        </p>
        <Link to="/blog" className="btn-primary mt-4 inline-flex">
          Back to blog
        </Link>
      </Section>
    );
  }

  return (
    <>
      {articleLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleLd }} />
      ) : null}

      <article className="space-y-6">
        <nav className="text-xs text-slate-500">
          <Link to="/blog" className="hover:text-white">
            Blog
          </Link>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-slate-400">{post.title}</span>
        </nav>

        <header className="surface rounded-2xl p-5 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {dateFmt.format(new Date(post.date))} · {post.readMin} min read
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">{post.excerpt}</p>
        </header>

        <div className="surface-muted rounded-2xl p-5 sm:p-8">
          <BlogBody sections={post.sections} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <Link to="/blog" className="text-sm font-medium text-indigo-200 hover:text-white">
            ← All articles
          </Link>
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-300">
            Home
          </Link>
        </div>
      </article>
    </>
  );
}
