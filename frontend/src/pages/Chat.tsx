import { useEffect, useRef, useState } from "react";
import {
  Bot,
  BriefcaseBusiness,
  FileSearch,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { sendChatMessage } from "../services/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestedPrompts = [
  {
    icon: <FileSearch size={18} />,
    label: "Improve my resume",
    prompt: "What are the highest-impact ways to improve my resume?",
  },
  {
    icon: <BriefcaseBusiness size={18} />,
    label: "Prepare for an interview",
    prompt: "Help me prepare for an upcoming job interview.",
  },
  {
    icon: <MessageSquareText size={18} />,
    label: "Plan my career move",
    prompt: "Help me think through my next career move.",
  },
];

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
    };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(newMessages);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply },
      ]);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Career Copilot could not respond. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex h-[calc(100dvh-3rem)] max-w-7xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 text-white shadow-sm">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-950">
                AI Career Coach
              </h1>
              <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Ready to help
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
            <Sparkles size={15} />
            Practical career guidance
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 md:px-8">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full border border-emerald-100 bg-emerald-50 p-4 text-emerald-600">
                <Sparkles size={30} />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-950 md:text-3xl">
                What would you like to work on?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
                Ask about resumes, interviews, cover letters, career changes, or
                the next decision in your job search.
              </p>

              <div className="mt-8 grid w-full gap-3 md:grid-cols-3">
                {suggestedPrompts.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => setInput(suggestion.prompt)}
                    className="group rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    <span className="inline-flex rounded-md bg-emerald-50 p-2 text-emerald-700">
                      {suggestion.icon}
                    </span>
                    <span className="mt-3 block text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                      {suggestion.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Add this prompt to the composer
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((message, index) => (
                <MessageBubble
                  key={`${message.role}-${index}`}
                  message={message}
                />
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-emerald-600 p-2 text-white">
                    <Bot size={18} />
                  </div>
                  <div className="rounded-lg rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Loader2 className="animate-spin" size={16} />
                      Thinking through your question...
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="border-t border-slate-200 bg-white p-4 md:px-6 md:py-5">
          {error && (
            <div className="mx-auto mb-3 max-w-3xl rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-lg border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask your career question..."
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">
              Press Enter to send · Shift + Enter for a new line
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`rounded-md p-2 ${
          isUser
            ? "bg-slate-800 text-white"
            : "bg-emerald-600 text-white"
        }`}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-7 shadow-sm md:max-w-[75%] ${
          isUser
            ? "rounded-tr-sm bg-slate-800 text-white"
            : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
