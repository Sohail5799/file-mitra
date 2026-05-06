import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { FormEvent, useMemo, useState } from "react";
import { showError, showSuccess } from "../lib/alerts";
import { submitContact } from "../lib/api";
import contactImage from "../../image.png";

const CONTACT_DISPLAY_EMAIL = "ansari02176@gmail.com";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && email.trim().length > 4 && message.trim().length > 5,
    [name, email, message]
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) {
      void showError("Please fill all required fields.");
      return;
    }

    setSending(true);
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      void showSuccess("Message sent. Check your inbox for a confirmation email.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not send message.";
      void showError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <Section
      title="Contact Us"
      description="Send your feedback or issue and we will respond quickly."
      titleLevel={1}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Get in touch">
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              className="input"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              type="email"
              placeholder="Your email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="input min-h-36 resize-y"
              placeholder="Write your message *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="submit"
              disabled={!canSubmit || sending}
              className="btn-primary w-full disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </Card>

        <Card title="Contact details">
          <div className="mb-4 flex max-h-64 min-h-0 justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 sm:max-h-none sm:h-52">
            <img
              src={contactImage}
              alt=""
              className="h-auto w-full max-h-64 object-contain object-center sm:h-full sm:max-h-none sm:object-cover"
              role="presentation"
            />
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <div>
              Email:{" "}
              <a className="font-medium text-white underline-offset-2 hover:underline" href={`mailto:${CONTACT_DISPLAY_EMAIL}`}>
                {CONTACT_DISPLAY_EMAIL}
              </a>
            </div>
            <div>Response window: usually within 24 hours.</div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

