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
        <p className="text-xs text-slate-500">Last updated: 6 May 2026</p>

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
            The app may store small amounts of data in your browser (including local storage) so pages load correctly
            or remember harmless UI preferences. You can clear site data in your browser settings at any time; some
            features may reset until you use them again.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-white">Advertising and Google AdSense</h2>
          <p>
            File Mitra may display advertisements served by Google AdSense and other Google advertising partners.
            Third-party vendors, including Google, use cookies or similar technologies to serve ads based on your visits
            to this site and/or other sites on the Internet. These technologies help measure ad performance, cap how
            often you see an ad, and (where allowed) personalize content and ads.
          </p>
          <p>
            You can learn how Google uses data when you use our site or partners’ sites in Google’s policy at{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="text-cyan-200 underline decoration-white/20 underline-offset-2 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              policies.google.com/technologies/ads
            </a>
            . For more about cookies, see{" "}
            <a
              href="https://policies.google.com/technologies/cookies"
              className="text-cyan-200 underline decoration-white/20 underline-offset-2 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google’s Cookies Policy
            </a>
            . You can manage or opt out of personalized advertising from Google where available via{" "}
            <a
              href="https://adssettings.google.com"
              className="text-cyan-200 underline decoration-white/20 underline-offset-2 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              adssettings.google.com
            </a>
            .
          </p>
          <p>
            Depending on your region, advertising partners may rely on a lawful basis (such as consent) to use
            non-essential cookies or to show personalized ads. Where required, we or our partners present choices
            (for example through a consent mechanism). If you decline optional cookies or personalization, you may
            still see non-personalized or contextual ads.
          </p>
          <p>
            Advertisements are provided by third parties. File Mitra does not control which specific ads appear and is
            not responsible for the content of third-party ads; if an ad looks misleading or inappropriate, you can
            use your platform’s ad feedback options and let us know via the contact page.
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
