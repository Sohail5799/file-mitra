import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { FormEvent, useMemo, useState } from "react";
import { showError, showSuccess } from "../lib/alerts";
import contactImage from "../../image.png";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(
    () => name.trim().length > 1 && email.trim().length > 4 && message.trim().length > 5,
    [name, email, message]
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) {
      void showError("Please fill all required fields.");
      return;
    }

    const to = "sohail@yopmail.com";
    const finalSubject = encodeURIComponent(subject.trim() || "New message from File Mitra");
    const finalBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${to}?subject=${finalSubject}&body=${finalBody}`;
    void showSuccess("Opening your mail app.");
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

            <button type="submit" disabled={!canSubmit} className="btn-primary w-full disabled:opacity-60">
              Send Message
            </button>
          </form>
        </Card>

        <Card title="Contact details">
          <img
            src={contactImage}
            alt="Contact us"
            className="mb-4 h-52 w-full rounded-2xl border border-white/10 object-cover"
          />
          <div className="space-y-2 text-sm text-slate-300">
            <div>
              Email: <span className="font-medium text-white">sohail@yopmail.com</span>
            </div>
            <div>Response window: usually within 24 hours.</div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

