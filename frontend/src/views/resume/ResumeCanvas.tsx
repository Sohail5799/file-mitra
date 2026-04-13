import type { ResumeModel } from "./resumeTypes";

function joinParts(parts: (string | undefined)[], sep = " · ") {
  return parts.filter(Boolean).join(sep);
}

export function ResumeCanvas({ model }: { model: ResumeModel }) {
  const { profile, summary, experience, education, skillGroups, projects, languages, certifications } = model;

  return (
    <div
      className="resume-print-root box-border min-h-0 min-w-0 break-words bg-white p-[10mm] text-[11pt] leading-relaxed text-slate-900 shadow-2xl [overflow-wrap:anywhere] print:shadow-none"
      style={{
        width: "210mm",
        maxWidth: "100%",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <header className="border-b border-slate-200 pb-3">
        <h1 className="text-[22pt] font-bold tracking-tight text-slate-950">{profile.fullName || "Your name"}</h1>
        {profile.headline ? (
          <p className="mt-1 text-[11pt] font-medium text-slate-600">{profile.headline}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9.5pt] text-slate-600">
          {[
            profile.email,
            profile.phone,
            profile.location,
            profile.website,
            profile.linkedin,
            profile.github
          ]
            .filter(Boolean)
            .map((line, i) => (
              <span key={`${i}-${line}`}>{line}</span>
            ))}
        </div>
      </header>

      {summary.trim() ? (
        <section className="mt-4">
          <h2 className="border-b border-slate-200 pb-1 text-[10pt] font-bold uppercase tracking-[0.12em] text-slate-800">
            Summary
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-[10.5pt] leading-relaxed text-slate-800">{summary.trim()}</p>
        </section>
      ) : null}

      {experience.length ? (
        <section className="mt-4">
          <h2 className="border-b border-slate-200 pb-1 text-[10pt] font-bold uppercase tracking-[0.12em] text-slate-800">
            Experience
          </h2>
          <div className="mt-3 space-y-4">
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-[11pt] font-semibold text-slate-950">{job.title || "Role"}</div>
                    <div className="text-[10.5pt] font-medium text-slate-700">{job.company || "Company"}</div>
                  </div>
                  <div className="text-[9.5pt] text-slate-600">
                    {joinParts([job.start, job.current ? "Present" : job.end], " – ")}
                    {job.location ? ` · ${job.location}` : ""}
                  </div>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[10.5pt] text-slate-800">
                  {job.bullets
                    .map((b) => b.trim())
                    .filter(Boolean)
                    .map((b, i) => (
                      <li key={`${job.id}-l-${i}`}>{b}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {education.length ? (
        <section className="mt-4">
          <h2 className="border-b border-slate-200 pb-1 text-[10pt] font-bold uppercase tracking-[0.12em] text-slate-800">
            Education
          </h2>
          <div className="mt-3 space-y-3">
            {education.map((ed) => (
              <div key={ed.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-[11pt] font-semibold text-slate-950">
                      {joinParts([ed.degree, ed.field], ", ") || "Programme"}
                    </div>
                    <div className="text-[10.5pt] text-slate-700">{ed.school || "School"}</div>
                  </div>
                  <div className="text-[9.5pt] text-slate-600">{joinParts([ed.start, ed.end], " – ")}</div>
                </div>
                {ed.details.trim() ? (
                  <p className="mt-1 text-[10pt] leading-relaxed text-slate-700">{ed.details.trim()}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {skillGroups.some((g) => g.label.trim() || g.skills.trim()) ? (
        <section className="mt-4">
          <h2 className="border-b border-slate-200 pb-1 text-[10pt] font-bold uppercase tracking-[0.12em] text-slate-800">
            Skills
          </h2>
          <div className="mt-3 space-y-2">
            {skillGroups.map((g) =>
              g.skills.trim() || g.label.trim() ? (
                <div key={g.id}>
                  <span className="font-semibold text-slate-900">{g.label || "Skills"}: </span>
                  <span className="text-slate-800">{g.skills.trim()}</span>
                </div>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      {projects.length ? (
        <section className="mt-4">
          <h2 className="border-b border-slate-200 pb-1 text-[10pt] font-bold uppercase tracking-[0.12em] text-slate-800">
            Projects
          </h2>
          <div className="mt-3 space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[11pt] font-semibold text-slate-950">{p.name || "Project"}</span>
                  {p.url.trim() ? (
                    <span className="text-[9.5pt] text-slate-600">{p.url.trim()}</span>
                  ) : null}
                </div>
                {p.description.trim() ? (
                  <p className="mt-1 text-[10pt] leading-relaxed text-slate-800">{p.description.trim()}</p>
                ) : null}
                {p.tech.trim() ? <p className="mt-0.5 text-[9.5pt] text-slate-600">{p.tech.trim()}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {certifications.trim() ? (
        <section className="mt-4">
          <h2 className="border-b border-slate-200 pb-1 text-[10pt] font-bold uppercase tracking-[0.12em] text-slate-800">
            Certifications
          </h2>
          <p className="mt-2 whitespace-pre-line text-[10.5pt] text-slate-800">{certifications.trim()}</p>
        </section>
      ) : null}

      {languages.trim() ? (
        <section className="mt-4">
          <h2 className="border-b border-slate-200 pb-1 text-[10pt] font-bold uppercase tracking-[0.12em] text-slate-800">
            Languages
          </h2>
          <p className="mt-2 text-[10.5pt] text-slate-800">{languages.trim()}</p>
        </section>
      ) : null}
    </div>
  );
}
