import { Link } from "@tanstack/react-router";
import { Section } from "../ui/Section";

export function PrivacyPolicyPage() {
  return (
    <Section
      title="Privacy policy"
      description="Plain-language notes on how File Mitra treats your files and any data that touches the service."
      titleLevel={1}
    >
      <article className="max-w-3xl space-y-8 text-sm leading-relaxed text-slate-300">
        <p className="text-xs text-slate-500">Last updated: 18 April 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">The short version</h2>
          <p>
            File Mitra is built around getting a job done in the browser: convert something, compress it, merge a few
            PDFs, maybe pull text with OCR. We are not in the business of hoarding your uploads. In normal use, files
            are handled for processing and cleaned up afterwards — they are not meant to sit on our servers as a
            personal archive.
          </p>
          <p>
            If something here does not match how you use the site, or you need clarity for work or school, use the{" "}
            <Link to="/contact" className="text-cyan-200 underline decoration-white/20 underline-offset-2 hover:text-white">
              contact form
            </Link>
            . We read messages even when we are slow to reply.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">What this site actually does with files</h2>
          <p>
            When you run a converter, compressor, merger, or OCR job, the file travels to our backend so the work can
            finish. That is the whole point of an online tool. The file exists on disk only long enough to complete the
            task and send the result back to you. We do not use your documents to train public models, sell them, or
            build a profile of what you upload.
          </p>
          <p>
            The resume builder is a bit different by design: most of that runs in your browser, and exporting to PDF is
            typically done through your own print dialog. That means a lot of your CV never has to leave your machine.
            If you use import/export features that hit the server, treat those like any other upload — same retention
            idea applies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Logs and technical data</h2>
          <p>
            Like almost every site, we see routine technical data: rough timestamps, errors that help debugging, maybe
            an IP address in server logs when something breaks. That is normal housekeeping, not a dossier. We do not
            run aggressive cross-site tracking or sell log data to brokers.
          </p>
          <p>
            If we ever add optional analytics to understand which tools help people most, we will keep it aggregate and
            boring — counts and flows, not “this exact person clicked here.” This policy will be updated if that changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">When you email us</h2>
          <p>
            The contact form collects what you type: name, email, subject, message. We use that only to reply and to
            fix issues you report. We do not add you to marketing lists unless you explicitly ask to hear about updates,
            and we do not share your message with random third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Cookies and local storage</h2>
          <p>
            The app may store small bits of data in your browser so pages load faster or remember harmless preferences.
            There is no creepy ad network hidden behind that — it is mostly “make the UI work.” You can clear site data
            in your browser any time; some features might just forget what you had open.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Security</h2>
          <p>
            In production, traffic should go over HTTPS. If you ever notice mixed content or a certificate warning, do
            not ignore it — stop and tell us. No online service can promise perfect security, but we try to keep the
            basics sane: limited retention, access only what is needed for the job, fix leaks when we find them.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Kids</h2>
          <p>
            File Mitra is a general-purpose utility. It is not aimed at children under 13, and we do not knowingly
            collect data from them. If you are a parent and something slipped through, write us and we will delete what
            we can.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Changes to this page</h2>
          <p>
            When we change how things work, we update this text and bump the date at the top. Big shifts (new data
            uses, new partners) will be spelled out here instead of hiding behind a single line in version history.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Related</h2>
          <p>
            For rules of use, limits of liability, and what you agree to by using the tools, see the{" "}
            <Link to="/terms" className="text-cyan-200 underline decoration-white/20 underline-offset-2 hover:text-white">
              terms and conditions
            </Link>
            .
          </p>
        </section>
      </article>
    </Section>
  );
}
