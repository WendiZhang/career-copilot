import { useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  Check,
  Clipboard,
  FileCheck2,
  FileText,
  Loader2,
  PenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const MIN_JOB_DESCRIPTION_LENGTH = 50;

export default function CoverLetter() {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const resumeFilename = localStorage.getItem("resumeFilename");
  const canGenerate =
    jobDescription.trim().length >= MIN_JOB_DESCRIPTION_LENGTH && !loading;

  const generateCoverLetter = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before generating a cover letter.");
      return;
    }

    if (!resumeFilename) {
      setError("Please upload and analyze a resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/generate-cover-letter`,
        {
          job_description: jobDescription,
          filename: resumeFilename,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCoverLetter(response.data.cover_letter);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "We could not generate your cover letter. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                <Sparkles size={16} />
                AI Cover Letter Studio
              </div>

              <h1 className="max-w-3xl text-3xl font-bold text-slate-950 md:text-4xl">
                Turn a job description into a tailored application.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                We combine the role requirements with your latest resume to
                create a concise, relevant, and ATS-friendly cover letter.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Feature icon={<FileCheck2 size={18} />} text="Resume-aware" />
                <Feature icon={<BriefcaseBusiness size={18} />} text="Role-specific" />
                <Feature icon={<ShieldCheck size={18} />} text="ATS-friendly" />
              </div>
            </div>

            <div className="rounded-lg border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Resume connection
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-950">
                    {resumeFilename ? "Ready to personalize" : "Resume needed"}
                  </p>
                </div>
                <div className="rounded-md bg-violet-600 p-2 text-white shadow-sm">
                  <FileText size={22} />
                </div>
              </div>

              <div className="mt-6 rounded-md border border-violet-100 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Active resume
                </p>
                <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                  {resumeFilename || "No analyzed resume found"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-violet-700">Step 1</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Add the job description
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Include responsibilities, qualifications, and company context
                  for stronger personalization.
                </p>
              </div>
              <div className="rounded-md bg-violet-50 p-2 text-violet-700">
                <PenLine size={20} />
              </div>
            </div>

            <textarea
              rows={14}
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setError("");
              }}
              className="mt-6 w-full resize-none rounded-md border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                Minimum {MIN_JOB_DESCRIPTION_LENGTH} characters
              </span>
              <span className="font-medium">
                {jobDescription.length.toLocaleString()} characters
              </span>
            </div>

            <button
              onClick={generateCoverLetter}
              disabled={!canGenerate}
              className="mt-6 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} />
              )}
              {loading ? "Writing your cover letter" : "Generate Cover Letter"}
            </button>
          </div>

          <div className="flex min-h-[520px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-sm font-semibold text-violet-700">Step 2</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Review your draft
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Fine-tune the generated letter before adding it to your application.
                </p>
              </div>

              <button
                onClick={copyToClipboard}
                disabled={!coverLetter}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                {copied ? <Check size={17} /> : <Clipboard size={17} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {coverLetter ? (
              <textarea
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                className="mt-5 min-h-[390px] flex-1 resize-none rounded-md border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                <div className="rounded-full bg-violet-50 p-4 text-violet-600">
                  <FileText size={30} />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-800">
                  Your draft will appear here
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Paste a detailed job description, then generate a personalized
                  letter grounded in your resume experience.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
      <span className="text-violet-600">{icon}</span>
      {text}
    </div>
  );
}
