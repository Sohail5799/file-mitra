import type { BlogBlock } from "../content/blogPosts";

export function BlogBody(props: { sections: BlogBlock[] }) {
  return (
    <div className="space-y-4">
      {props.sections.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-sm leading-relaxed text-slate-300 sm:text-base">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="border-b border-white/10 pb-2 pt-4 text-lg font-semibold tracking-tight text-white first:pt-0 sm:text-xl"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="pt-3 text-base font-semibold text-white sm:text-lg">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul
                key={i}
                className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300 sm:text-base"
              >
                {block.items.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm leading-relaxed text-emerald-50/95"
              >
                {block.text}
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
