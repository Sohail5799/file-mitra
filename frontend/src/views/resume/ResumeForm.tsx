import { useState, type ReactNode } from "react";
import type { Dispatch } from "react";
import type { Action } from "./useResumeEditor";
import type { ResumeModel } from "./resumeTypes";

function CollapsibleSection(props: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  return (
    <div className="surface-muted overflow-hidden rounded-2xl border border-white/10">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition hover:bg-white/5"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-white">{props.title}</span>
        <span className="shrink-0 text-slate-400 tabular-nums" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="border-t border-white/10 p-4">{props.children}</div> : null}
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls =
    "input mt-1 border-white/15 bg-white/[0.07] placeholder:text-slate-500 focus:border-indigo-400/50";
  return (
    <label className="block text-xs font-medium text-slate-400">
      {props.label}
      {props.multiline ? (
        <textarea
          className={`${cls} min-h-[88px] resize-y`}
          rows={4}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={cls}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function ResumeForm(props: { model: ResumeModel; dispatch: Dispatch<Action> }) {
  const { model, dispatch } = props;

  return (
    <div className="space-y-3">
      <CollapsibleSection title="Profile & contact" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Full name"
            value={model.profile.fullName}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "fullName", value: v })}
            placeholder="Priya Nair"
          />
          <Field
            label="Headline"
            value={model.profile.headline}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "headline", value: v })}
            placeholder="Software Engineer · Cloud & APIs"
          />
          <Field
            label="Email"
            value={model.profile.email}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "email", value: v })}
          />
          <Field
            label="Phone"
            value={model.profile.phone}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "phone", value: v })}
          />
          <Field
            label="Location"
            value={model.profile.location}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "location", value: v })}
          />
          <Field
            label="Website"
            value={model.profile.website}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "website", value: v })}
            placeholder="you.com"
          />
          <Field
            label="LinkedIn"
            value={model.profile.linkedin}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "linkedin", value: v })}
          />
          <Field
            label="GitHub"
            value={model.profile.github}
            onChange={(v) => dispatch({ type: "SET_PROFILE", field: "github", value: v })}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Professional summary" defaultOpen>
        <Field
          label="Summary"
          value={model.summary}
          onChange={(v) => dispatch({ type: "SET_SUMMARY", value: v })}
          placeholder="3–5 lines: impact, scope, tools, and what you want next."
          multiline
        />
      </CollapsibleSection>

      <CollapsibleSection title="Experience">
        <div className="space-y-4">
          {model.experience.map((job) => (
            <div key={job.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</span>
                <button
                  type="button"
                  className="text-xs text-rose-300 hover:text-rose-200"
                  onClick={() => dispatch({ type: "REMOVE_EXPERIENCE", id: job.id })}
                >
                  Remove
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Field
                  label="Job title"
                  value={job.title}
                  onChange={(v) => dispatch({ type: "SET_EXPERIENCE", id: job.id, field: "title", value: v })}
                />
                <Field
                  label="Company"
                  value={job.company}
                  onChange={(v) => dispatch({ type: "SET_EXPERIENCE", id: job.id, field: "company", value: v })}
                />
                <Field
                  label="Location"
                  value={job.location}
                  onChange={(v) => dispatch({ type: "SET_EXPERIENCE", id: job.id, field: "location", value: v })}
                />
                <Field
                  label="Start"
                  value={job.start}
                  onChange={(v) => dispatch({ type: "SET_EXPERIENCE", id: job.id, field: "start", value: v })}
                  placeholder="2022"
                />
                <Field
                  label="End"
                  value={job.end}
                  onChange={(v) => dispatch({ type: "SET_EXPERIENCE", id: job.id, field: "end", value: v })}
                  placeholder="2024"
                />
              </div>
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10"
                  checked={job.current}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_EXPERIENCE",
                      id: job.id,
                      field: "current",
                      value: e.target.checked
                    })
                  }
                />
                I currently work here
              </label>
              <div className="mt-3 space-y-2">
                <div className="text-xs font-medium text-slate-400">Impact bullets</div>
                {job.bullets.map((b, idx) => (
                  <div key={`${job.id}-b-${idx}`} className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1 border-white/15 bg-white/[0.07] text-sm"
                      value={b}
                      placeholder="Measurable outcome + how you did it"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_BULLET",
                          expId: job.id,
                          index: idx,
                          value: e.target.value
                        })
                      }
                    />
                    <button
                      type="button"
                      className="btn-secondary shrink-0 px-2 py-1 text-xs"
                      onClick={() => dispatch({ type: "REMOVE_BULLET", expId: job.id, index: idx })}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-secondary w-full py-2 text-xs"
                  onClick={() => dispatch({ type: "ADD_BULLET", expId: job.id })}
                >
                  + Add bullet
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn-primary w-full py-2 text-sm" onClick={() => dispatch({ type: "ADD_EXPERIENCE" })}>
            + Add experience
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Education">
        <div className="space-y-4">
          {model.education.map((ed) => (
            <div key={ed.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-rose-300 hover:text-rose-200"
                  onClick={() => dispatch({ type: "REMOVE_EDUCATION", id: ed.id })}
                >
                  Remove
                </button>
              </div>
              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                <Field
                  label="School"
                  value={ed.school}
                  onChange={(v) => dispatch({ type: "SET_EDUCATION", id: ed.id, field: "school", value: v })}
                />
                <Field
                  label="Degree"
                  value={ed.degree}
                  onChange={(v) => dispatch({ type: "SET_EDUCATION", id: ed.id, field: "degree", value: v })}
                />
                <Field
                  label="Field"
                  value={ed.field}
                  onChange={(v) => dispatch({ type: "SET_EDUCATION", id: ed.id, field: "field", value: v })}
                />
                <Field
                  label="Start"
                  value={ed.start}
                  onChange={(v) => dispatch({ type: "SET_EDUCATION", id: ed.id, field: "start", value: v })}
                />
                <Field
                  label="End"
                  value={ed.end}
                  onChange={(v) => dispatch({ type: "SET_EDUCATION", id: ed.id, field: "end", value: v })}
                />
              </div>
              <Field
                label="Details (honours, focus, GPA if strong)"
                value={ed.details}
                onChange={(v) => dispatch({ type: "SET_EDUCATION", id: ed.id, field: "details", value: v })}
                multiline
              />
            </div>
          ))}
          <button type="button" className="btn-primary w-full py-2 text-sm" onClick={() => dispatch({ type: "ADD_EDUCATION" })}>
            + Add education
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Skills">
        <div className="space-y-3">
          {model.skillGroups.map((g) => (
            <div key={g.id} className="rounded-xl border border-white/10 bg-black/15 p-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-rose-300 hover:text-rose-200"
                  onClick={() => dispatch({ type: "REMOVE_SKILL_GROUP", id: g.id })}
                >
                  Remove group
                </button>
              </div>
              <Field
                label="Group label"
                value={g.label}
                onChange={(v) => dispatch({ type: "SET_SKILL_GROUP", id: g.id, field: "label", value: v })}
                placeholder="Engineering"
              />
              <Field
                label="Skills (comma-separated)"
                value={g.skills}
                onChange={(v) => dispatch({ type: "SET_SKILL_GROUP", id: g.id, field: "skills", value: v })}
                placeholder="TypeScript, React, Node.js"
              />
            </div>
          ))}
          <button type="button" className="btn-secondary w-full py-2 text-sm" onClick={() => dispatch({ type: "ADD_SKILL_GROUP" })}>
            + Add skill group
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Projects">
        <div className="space-y-4">
          {model.projects.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-rose-300 hover:text-rose-200"
                  onClick={() => dispatch({ type: "REMOVE_PROJECT", id: p.id })}
                >
                  Remove
                </button>
              </div>
              <div className="mt-1 grid gap-2">
                <Field
                  label="Project name"
                  value={p.name}
                  onChange={(v) => dispatch({ type: "SET_PROJECT", id: p.id, field: "name", value: v })}
                />
                <Field label="Link" value={p.url} onChange={(v) => dispatch({ type: "SET_PROJECT", id: p.id, field: "url", value: v })} />
                <Field
                  label="Description"
                  value={p.description}
                  onChange={(v) => dispatch({ type: "SET_PROJECT", id: p.id, field: "description", value: v })}
                  multiline
                />
                <Field
                  label="Tech stack"
                  value={p.tech}
                  onChange={(v) => dispatch({ type: "SET_PROJECT", id: p.id, field: "tech", value: v })}
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn-primary w-full py-2 text-sm" onClick={() => dispatch({ type: "ADD_PROJECT" })}>
            + Add project
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Languages & certifications">
        <Field
          label="Languages"
          value={model.languages}
          onChange={(v) => dispatch({ type: "SET_LANGUAGES", value: v })}
          placeholder="English (C1), Hindi (native)"
        />
        <Field
          label="Certifications (one per line)"
          value={model.certifications}
          onChange={(v) => dispatch({ type: "SET_CERTIFICATIONS", value: v })}
          multiline
        />
      </CollapsibleSection>
    </div>
  );
}
