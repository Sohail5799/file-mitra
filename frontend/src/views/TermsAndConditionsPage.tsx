import { Link } from "@tanstack/react-router";
import { Section } from "../ui/Section";

export function TermsAndConditionsPage() {
  return (
    <Section
      title="Terms and conditions"
      description="Straightforward rules for using File Mitra. If anything sounds off for your situation, ask before you rely on it for something critical."
      titleLevel={1}
    >
      <article className="max-w-3xl space-y-8 text-sm leading-relaxed text-slate-300">
        <p className="text-xs text-slate-500">Last updated: 18 April 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Using the site</h2>
          <p>
            By using File Mitra you accept these terms. If you do not agree, please stop using the service — we would
            rather you walk away than stay and argue later. The tools are offered as-is for legitimate personal and work
            tasks: convert a scan, shrink a PDF for email, build a CV, that sort of thing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">What you must not do</h2>
          <p>
            Do not use the site to break the law, harass anyone, distribute malware, or process material you have no
            right to use. Do not try to overload our systems on purpose, scrape the backend in bad faith, or bypass
            limits we put in place to keep things stable for everyone else. Common sense applies: if it would get you
            fired or sued offline, do not do it here either.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Your content stays your problem (in a good way)</h2>
          <p>
            You keep ownership of whatever you upload. We only need it to run the conversion or tool you asked for. We
            do not claim rights over your documents, images, or resume text. You are responsible for making sure you
            are allowed to process that material — copyright, workplace policy, NDAs, all of that is on you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Quality and “good enough” engineering</h2>
          <p>
            We try hard to give correct output, but file formats are messy and edge cases exist. A merged PDF might look
            different from what you expected; OCR might misread a smudged line; a compressed image might be softer than
            you wanted. Always keep backups of originals when the stakes are high (legal filings, archival photos, final
            client deliverables).
          </p>
          <p>
            The service is provided without warranties of any kind, whether express or implied, to the fullest extent
            allowed by law. That sounds formal, but it really means: we are a small utility, not a guaranteed enterprise
            SLA.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, File Mitra and its operators are not liable for indirect
            or consequential damages — lost profits, lost data because you deleted the only copy, missed deadlines, and
            so on — arising from use or inability to use the site. If a court ever caps damages, that cap should be
            modest and tied to what is reasonable for a free tool.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Availability</h2>
          <p>
            We may change features, take the site down briefly for maintenance, or retire a tool if it causes more pain
            than value. We will try not to disappear overnight, but we do not promise 24/7 uptime.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Third-party bits</h2>
          <p>
            The site may rely on libraries, fonts, or infrastructure from other providers. Their terms can apply where
            relevant. If something outside our control breaks, we fix what we can on our side.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Governing law</h2>
          <p>
            These terms are written with Indian users in mind. Where the law requires a specific jurisdiction, the
            courts of India shall have exclusive jurisdiction, subject to what mandatory consumer protections say in
            your country — those still apply if they cannot be waived.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Contact</h2>
          <p>
            Questions about these terms or a dispute? Reach out via the{" "}
            <Link to="/contact" className="text-cyan-200 underline decoration-white/20 underline-offset-2 hover:text-white">
              contact page
            </Link>
            . We prefer a calm email thread to drama.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Privacy</h2>
          <p>
            How we handle data and files is described separately in the{" "}
            <Link
              to="/privacy-policy"
              className="text-cyan-200 underline decoration-white/20 underline-offset-2 hover:text-white"
            >
              privacy policy
            </Link>
            .
          </p>
        </section>
      </article>
    </Section>
  );
}
