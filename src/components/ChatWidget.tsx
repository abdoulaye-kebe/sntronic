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
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [ideas, setIdeas] = useState(false);
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

  function dictate() {
    const host = window as Window & {
      SpeechRecognition?: Dictation;
      webkitSpeechRecognition?: Dictation;
    };
    const Ctor = host.SpeechRecognition ?? host.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "fr-FR";
    recognition.onresult = (event) => {
      const heard = event.results[0]?.[0]?.transcript?.trim();
      if (heard) setDraft(heard);
    };
    recognition.start();
  }

  async function ask(text: string) {
    const question = text.trim();
    if (!question || pending) return;
    const history = [...turns, { role: "user" as const, text: question }];
    setTurns(history);
    setDraft("");
    setIdeas(false);
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
        <section className={`advisor-panel${turns.length ? "" : " is-empty"}`} role="dialog" aria-labelledby={titleId}>
          <header className="advisor-head">
            <h2 id={titleId}>SNTRONIC AI</h2>
            <button type="button" className="advisor-close" onClick={() => setOpen(false)} aria-label="Fermer le conseiller">
              ×
            </button>
          </header>
          <div className={`advisor-log${turns.length ? " has-turns" : ""}`} ref={scrollRef}>
            {turns.length === 0 && (
              <div className="advisor-hello">
                <p>Qu’avez-vous en tête aujourd’hui ?</p>
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
            {ideas && (
              <div className="advisor-suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => ask(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div className="advisor-composer">
              <button
                type="button"
                className="advisor-plus"
                aria-expanded={ideas}
                aria-label="Idées de questions"
                onClick={() => setIdeas((value) => !value)}
              >
                +
              </button>
              <label className="sr-only" htmlFor="advisor-question">
                Question
              </label>
              <input
                id="advisor-question"
                ref={inputRef}
                value={draft}
                placeholder="Un capteur, une passerelle, un prix…"
                onChange={(event) => setDraft(event.target.value)}
              />
              <button type="submit" className="advisor-analyse" disabled={pending || !draft.trim()}>
                <ChainIcon />
                <span>Analyser</span>
              </button>
              <button type="button" className="advisor-mic" aria-label="Dicter la question" onClick={dictate}>
                <MicIcon />
              </button>
              <button type="submit" className="advisor-send" disabled={pending || !draft.trim()} aria-label="Envoyer">
                <ArrowIcon />
              </button>
            </div>
          </form>
        </section>
      )}
      <button
        type="button"
        className="advisor-toggle"
        aria-expanded={open}
        aria-label={open ? "Fermer le conseiller" : "Ouvrir le conseiller"}
        onClick={() => setOpen((value) => !value)}
      >
        <AdvisorIcon />
        <span>{open ? "Fermer" : "Conseiller"}</span>
      </button>
    </div>
  );
}

type Dictation = new () => {
  lang: string;
  start: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
};

function AdvisorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 16.5V8.8A3.8 3.8 0 0 1 8.8 5h6.4A3.8 3.8 0 0 1 19 8.8v4.2a3.8 3.8 0 0 1-3.8 3.8H9.2L5 20.2z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4" />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M9 12a4 4 0 0 1 0-6l1.5-1.5a4 4 0 0 1 5.7 5.6L15 11" />
      <path d="M15 12a4 4 0 0 1 0 6l-1.5 1.5a4 4 0 0 1-5.7-5.6L9 13" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 19V6" />
      <path d="m6.5 11.5 5.5-5.5 5.5 5.5" />
    </svg>
  );
}
