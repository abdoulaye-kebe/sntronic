import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext.tsx";
import { catalogForChat, replyParts } from "../lib/chatCatalog.ts";

type Turn = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = ["Un capteur de CO₂ pour un bureau", "Passerelle extérieure LoRaWAN", "Prix du Vivid en francs CFA"];

export function ChatWidget() {
  const { pathname } = useLocation();
  const { products } = useCatalog();
  const titleId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns, pending, open]);

  if (pathname.startsWith("/admin")) return null;

  async function ask(text: string) {
    const question = text.trim();
    if (!question || pending) return;
    const history = [...turns, { role: "user" as const, text: question }];
    setTurns(history);
    setDraft("");
    setPending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((turn) => ({ role: turn.role, text: turn.text })),
          catalog: catalogForChat(products),
        }),
      });
      const payload = (await response.json()) as { reply?: string; error?: string };
      const reply = payload.reply?.trim() || payload.error || "Le conseiller n’a pas répondu.";
      setTurns([...history, { role: "assistant", text: reply }]);
    } catch {
      setTurns([...history, { role: "assistant", text: "Le conseiller ne répond pas pour le moment." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={`advisor ${open ? "open" : ""}`}>
      {open && (
        <section className="advisor-panel" role="dialog" aria-labelledby={titleId}>
          <header className="advisor-head">
            <div>
              <p className="advisor-kicker">Gemini</p>
              <h2 id={titleId}>Conseiller</h2>
            </div>
            <button type="button" className="advisor-close" onClick={() => setOpen(false)} aria-label="Fermer le conseiller">
              ×
            </button>
          </header>
          <div className="advisor-log" ref={scrollRef}>
            {turns.length === 0 && (
              <div className="advisor-hello">
                <p>Je cherche dans le catalogue avant de donner un prix ou une référence.</p>
                <div className="advisor-suggestions">
                  {SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => ask(suggestion)}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((turn, index) => (
              <p key={`${turn.role}-${index}`} className={turn.role === "user" ? "advisor-user" : "advisor-bot"}>
                {turn.role === "assistant"
                  ? replyParts(turn.text).map((part, partIndex) =>
                      part.kind === "link" ? (
                        <Link key={partIndex} to={part.to} onClick={() => setOpen(false)}>
                          {part.label}
                        </Link>
                      ) : (
                        <span key={partIndex}>{part.value}</span>
                      ),
                    )
                  : turn.text}
              </p>
            ))}
            {pending && <p className="advisor-bot">Je consulte le catalogue…</p>}
          </div>
          <form
            className="advisor-form"
            onSubmit={(event) => {
              event.preventDefault();
              void ask(draft);
            }}
          >
            <label className="sr-only" htmlFor="advisor-question">
              Question
            </label>
            <textarea
              id="advisor-question"
              ref={inputRef}
              rows={2}
              value={draft}
              placeholder="Un capteur, une passerelle, un prix…"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void ask(draft);
                }
              }}
            />
            <button type="submit" disabled={pending || !draft.trim()}>
              Envoyer
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        className="advisor-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Fermer" : "Conseiller"}
      </button>
    </div>
  );
}
