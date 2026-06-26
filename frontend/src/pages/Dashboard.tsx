import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileSearch,
  FileStack,
  KeyRound,
  Lightbulb,
  Loader2,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

type DashboardData = {
  resumeScore: number | null;
  reportsGenerated: number;
  keywordsFound: number;
  careerMatches: number;
  latestStrengths: string[];
  latestImprovements: string[];
  latestCareers: string[];
};

const EMPTY_DASHBOARD: DashboardData = {
  resumeScore: null,
  reportsGenerated: 0,
  keywordsFound: 0,
  careerMatches: 0,
  latestStrengths: [],
  latestImprovements: [],
  latestCareers: [],
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username") || "there";

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.msg ||
            "We could not load your latest career insights."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const hasAnalysis = data.resumeScore !== null;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  <Sparkles size={16} />
                  Your Career Workspace
                </div>

                <h1 className="max-w-3xl text-3xl font-bold text-slate-950 md:text-4xl">
                  Welcome back, {username}.
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Strengthen your applications, uncover role opportunities, and
                  keep your career progress moving from one focused workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/resume-analysis"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <FileSearch size={18} />
                  Analyze Resume
                </Link>
                <Link
                  to="/cover-letter"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  Create Cover Letter
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Career readiness
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {hasAnalysis ? "Profile in progress" : "Start your profile"}
                  </p>
                </div>
                <div className="rounded-md bg-white/15 p-2">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="mt-10 flex items-end gap-3">
                <span className="text-6xl font-bold tracking-tight">
                  {loading ? "--" : data.resumeScore ?? "--"}
                </span>
                <span className="mb-2 text-sm font-medium text-blue-100">
                  {hasAnalysis ? "/ 100 resume score" : "awaiting analysis"}
                </span>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${data.resumeScore ?? 0}%` }}
                />
              </div>

              <p className="mt-5 text-sm leading-6 text-blue-100">
                {hasAnalysis
                  ? "Use your recommendations to improve the score, then run a fresh analysis."
                  : "Analyze a resume to unlock personalized insights and recommendations."}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<BarChart3 size={20} />}
            label="Resume Score"
            value={data.resumeScore === null ? "--" : `${data.resumeScore}%`}
            detail="ATS readiness"
            loading={loading}
            tone="blue"
          />
          <MetricCard
            icon={<KeyRound size={20} />}
            label="Keywords Found"
            value={data.keywordsFound}
            detail="Relevant signals"
            loading={loading}
            tone="emerald"
          />
          <MetricCard
            icon={<Compass size={20} />}
            label="Career Matches"
            value={data.careerMatches}
            detail="Suggested paths"
            loading={loading}
            tone="violet"
          />
          <MetricCard
            icon={<FileStack size={20} />}
            label="Reports Generated"
            value={data.reportsGenerated}
            detail="Completed analyses"
            loading={loading}
            tone="amber"
          />
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700">Career toolkit</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Keep your momentum going
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ToolCard
              to="/resume-analysis"
              icon={<FileSearch size={22} />}
              title="Resume Analysis"
              description="Get ATS scoring, priority improvements, and role recommendations."
              tone="blue"
            />
            <ToolCard
              to="/cover-letter"
              icon={<FileStack size={22} />}
              title="Cover Letter Studio"
              description="Create a tailored letter from your resume and a job description."
              tone="violet"
            />
            <ToolCard
              to="/chat"
              icon={<MessageSquare size={22} />}
              title="AI Career Coach"
              description="Ask questions about interviews, applications, and career decisions."
              tone="emerald"
            />
            <ComingSoonCard />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-700">Latest analysis</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Personalized insights
                </h2>
              </div>
              <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                <Lightbulb size={20} />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <InsightList
                title="What stands out"
                icon={<CheckCircle2 size={18} />}
                items={data.latestStrengths}
                emptyText="Your strongest resume signals will appear here."
                tone="emerald"
              />
              <InsightList
                title="What to improve"
                icon={<TrendingUp size={18} />}
                items={data.latestImprovements}
                emptyText="Priority improvements will appear here."
                tone="amber"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-violet-700">Next move</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Suggested career paths
                </h2>
              </div>
              <div className="rounded-md bg-violet-50 p-2 text-violet-700">
                <Target size={20} />
              </div>
            </div>

            {data.latestCareers.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {data.latestCareers.map((career) => (
                  <span
                    key={career}
                    className="rounded-md border border-violet-100 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700"
                  >
                    {career}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                Complete a resume analysis to reveal career paths aligned with
                your experience.
              </div>
            )}

            <Link
              to="/resume-analysis"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {hasAnalysis ? "Refresh Analysis" : "Analyze Your Resume"}
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

type Tone = "blue" | "emerald" | "violet" | "amber";

const toneStyles: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
};

function MetricCard({
  icon,
  label,
  value,
  detail,
  loading,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail: string;
  loading: boolean;
  tone: Tone;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`rounded-md border p-2 ${toneStyles[tone]}`}>{icon}</div>
        {loading && <Loader2 className="animate-spin text-slate-300" size={18} />}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
        {loading ? "--" : value}
      </p>
      <p className="mt-2 text-xs font-medium text-slate-400">{detail}</p>
    </div>
  );
}

function ToolCard({
  to,
  icon,
  title,
  description,
  tone,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: Tone;
}) {
  return (
    <Link
      to={to}
      className="group flex min-h-56 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
    >
      <div className={`w-fit rounded-md border p-2.5 ${toneStyles[tone]}`}>{icon}</div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-blue-700">
        Open tool <ArrowRight size={16} />
      </span>
    </Link>
  );
}

function ComingSoonCard() {
  return (
    <div className="flex min-h-56 flex-col rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
      <div className="w-fit rounded-md border border-slate-200 bg-white p-2.5 text-slate-500">
        <BriefcaseBusiness size={22} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-800">Job Matching</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        Discover opportunities aligned with your skills and experience.
      </p>
      <span className="mt-5 w-fit rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
        Coming soon
      </span>
    </div>
  );
}

function InsightList({
  title,
  icon,
  items,
  emptyText,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  emptyText: string;
  tone: "emerald" | "amber";
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className={`flex items-center gap-2 text-sm font-bold ${tone === "emerald" ? "text-emerald-700" : "text-amber-700"}`}>
        {icon}
        {title}
      </div>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}
