import axios from "axios";
import jsPDF from "jspdf";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileUp,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";

export default function ResumeAnalysis() {
  const [score, setScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [careers, setCareers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const hasResults = score !== null;
  const selectedFileMeta = file
    ? `${(file.size / 1024 / 1024).toFixed(2)} MB selected`
    : "PDF or DOCX up to your backend limit";
  const scoreLabel =
    score === null
      ? "Awaiting Analysis"
      : score >= 85
      ? "Excellent"
      : score >= 70
      ? "Strong"
      : "Needs Work";

  const analyzeResume = async () => {
    if (!file) {
      setError("Please select a resume before running the analysis.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in before analyzing your resume.");
        setLoading(false);
        return;
      }

      const uploadRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem(
        "resumeFilename",
        uploadRes.data.filename
      );

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyze-resume`,
        {
          filename: uploadRes.data.filename,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScore(res.data.score);
      setStrengths(res.data.strengths || []);
      setImprovements(res.data.improvements || []);
      setKeywords(res.data.keywords || []);
      setCareers(res.data.careers || []);
      setMessage(uploadRes.data.message || "Resume uploaded and analyzed.");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.msg ||
          "We could not upload and analyze your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!hasResults) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Resume Analysis Report", 20, 22);

    doc.setFontSize(12);
    doc.text(`Resume Score: ${score}% (${scoreLabel})`, 20, 36);

    let y = 52;

    const addSection = (title: string, items: string[]) => {
      doc.setFontSize(14);
      doc.text(title, 20, y);
      y += 10;

      doc.setFontSize(11);
      items.forEach((item) => {
        doc.text(`- ${item}`, 24, y);
        y += 8;
      });

      y += 6;
    };

    addSection("Strengths", strengths);
    addSection("Recommended Improvements", improvements);
    addSection("Keywords Found", keywords);
    addSection("Suggested Career Paths", careers);

    doc.save("resume-analysis.pdf");
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:p-8">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  <Sparkles size={16} />
                  AI Resume Analysis
                </div>

                <h1 className="max-w-3xl text-3xl font-bold tracking-normal text-slate-950 md:text-4xl">
                  Upload, score, and improve your resume in one workflow.
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Get an ATS-focused review with strengths, priority fixes,
                  keyword coverage, and career path recommendations from a
                  single resume upload.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <WorkflowStep
                    icon={<UploadCloud size={18} />}
                    label="Upload"
                    text="PDF or DOCX"
                  />
                  <WorkflowStep
                    icon={<ShieldCheck size={18} />}
                    label="Evaluate"
                    text="ATS readiness"
                  />
                  <WorkflowStep
                    icon={<ClipboardCheck size={18} />}
                    label="Export"
                    text="PDF report"
                  />
                </div>
              </div>

              <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <label
                  htmlFor="resume-analysis-upload"
                  className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-slate-300 bg-white p-4 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <span className="rounded-md bg-blue-50 p-3 text-blue-700">
                    <FileUp size={22} />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {file ? file.name : "Choose a resume file"}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {selectedFileMeta}
                    </span>
                  </span>

                  <input
                    id="resume-analysis-upload"
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(event) => {
                      setFile(event.target.files?.[0] || null);
                      setError("");
                      setMessage("");
                    }}
                  />
                </label>

                <button
                  onClick={analyzeResume}
                  disabled={loading || !file}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Search size={18} />
                  )}
                  {loading ? "Analyzing Resume" : "Upload & Analyze"}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-6 text-slate-900 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Resume Score
                  </p>
                  <p className="mt-1 text-2xl font-bold leading-tight">
                    {scoreLabel}
                  </p>
                </div>

                <div className="rounded-md bg-blue-600 p-2 text-white shadow-sm">
                  <BarChart3 size={22} />
                </div>
              </div>

              <div className="mx-auto my-8 h-44 w-44">
                <CircularProgressbar
                  value={score || 0}
                  text={score === null ? "--" : `${score}%`}
                  styles={buildStyles({
                    pathColor: "#2563eb",
                    textColor: "#0f172a",
                    trailColor: "#dbeafe",
                  })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <Metric label="Signals" value={strengths.length} />
                <Metric label="Fixes" value={improvements.length} />
                <Metric label="Keywords" value={keywords.length} />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="grid gap-6 md:grid-cols-2">
            <InsightCard
              icon={<CheckCircle2 size={20} />}
              title="Strengths"
              emptyText="Upload a resume to surface strong signals in experience, impact, and role alignment."
              items={strengths}
              tone="green"
            />

            <InsightCard
              icon={<TrendingUp size={20} />}
              title="Recommended Improvements"
              emptyText="Priority fixes will appear here after the resume review is complete."
              items={improvements}
              tone="amber"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Analysis Report
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Export a polished PDF summary after reviewing the analysis.
                </p>
              </div>

              <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                <Download size={20} />
              </div>
            </div>

            <button
              onClick={downloadPDF}
              disabled={!hasResults}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Download size={18} />
              Download PDF Report
            </button>

            <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Next best action
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {hasResults
                  ? "Apply the top improvements first, then re-run the analysis to track your score."
                  : "Choose a resume at the top of this page, then upload and analyze it here."}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <TagPanel
            icon={<Target size={20} />}
            title="Keywords Found"
            emptyText="Keywords will appear after analysis."
            items={keywords}
            colorClasses="bg-blue-50 text-blue-700 border-blue-100"
          />

          <TagPanel
            icon={<BriefcaseBusiness size={20} />}
            title="Suggested Career Paths"
            emptyText="Career path suggestions will appear after analysis."
            items={careers}
            colorClasses="bg-violet-50 text-violet-700 border-violet-100"
          />
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-blue-100 bg-white px-3 py-3 shadow-sm">
      <p className="text-xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function WorkflowStep({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="rounded-md bg-white p-2 text-blue-700 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs font-medium text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  emptyText,
  items,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  emptyText: string;
  items: string[];
  tone: "green" | "amber";
}) {
  const toneClasses =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className={`rounded-md p-2 ${toneClasses}`}>{icon}</div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700"
            >
              <ArrowRight
                className="mt-1 shrink-0 text-slate-400"
                size={16}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          {emptyText}
        </p>
      )}
    </div>
  );
}

function TagPanel({
  icon,
  title,
  emptyText,
  items,
  colorClasses,
}: {
  icon: React.ReactNode;
  title: string;
  emptyText: string;
  items: string[];
  colorClasses: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-md bg-slate-100 p-2 text-slate-700">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${colorClasses}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          {emptyText}
        </p>
      )}
    </div>
  );
}
