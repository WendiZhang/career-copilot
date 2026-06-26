import type { ReactNode } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:min-h-[calc(100dvh-3rem)] lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-400/10" />

          <Link to="/" className="relative flex items-center gap-3 text-lg font-bold">
            <span className="rounded-md bg-white/15 p-2 backdrop-blur-sm">
              <Sparkles size={20} />
            </span>
            Career Copilot
          </Link>

          <div className="relative max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
              Your next move, made clearer
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">
              Build stronger applications with an AI career workspace.
            </h1>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Move from resume feedback to tailored cover letters and practical
              career coaching—all in one focused place.
            </p>

            <div className="mt-8 space-y-4">
              <Benefit text="ATS-focused resume feedback" />
              <Benefit text="Personalized cover letter drafts" />
              <Benefit text="On-demand interview and career coaching" />
            </div>
          </div>

          <p className="relative text-sm text-blue-200">
            Practical guidance for every stage of your job search.
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 flex items-center gap-2 text-lg font-bold text-slate-950 lg:hidden"
            >
              <span className="rounded-md bg-blue-600 p-2 text-white">
                <Sparkles size={18} />
              </span>
              Career Copilot
            </Link>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-white">
      <span className="rounded-full bg-white/15 p-1">
        <CheckCircle2 size={17} />
      </span>
      {text}
    </div>
  );
}
