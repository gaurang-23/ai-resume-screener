import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import LogoMark from "../components/LogoMark";
import ScoreBadge from "../components/ScoreBadge";

const TABS = { REVIEW: "review", HISTORY: "history" };

const Home = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(TABS.REVIEW);

  // New review form state
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [result, setResult] = useState(null);

  // History state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const data = await api.get("/resumes/history");
      setHistory(data.resumes);
    } catch (err) {
      setHistoryError(err.message || "Couldn't load history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (tab === TABS.HISTORY) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    setUploadError("");
    setFile(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (!file) {
      setUploadError("Attach a resume PDF first.");
      return;
    }
    if (!jobDescription.trim()) {
      setUploadError("Paste the job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription.trim());

    setAnalyzing(true);
    setResult(null);
    try {
      // Don't set Content-Type manually - the browser needs to add the multipart boundary itself.
      const data = await api.post("/resumes/upload", formData);
      setResult(data.resume);
      setFile(null);
      setJobDescription("");
      const fileInput = document.getElementById("resume-file");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setUploadError(err.message || "Analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-lg font-semibold">Intake</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-light">{user?.name}</span>
            <button
              onClick={logout}
              className="rounded-md border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex w-fit gap-1 rounded-lg bg-paper-dim p-1">
          <TabButton
            active={tab === TABS.REVIEW}
            onClick={() => setTab(TABS.REVIEW)}
          >
            New review
          </TabButton>
          <TabButton
            active={tab === TABS.HISTORY}
            onClick={() => setTab(TABS.HISTORY)}
          >
            History
          </TabButton>
        </div>

        {tab === TABS.REVIEW && (
          <div className="grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-ink/10 bg-white p-6"
            >
              <h2 className="font-display text-xl font-semibold">
                Screen a resume
              </h2>
              <p className="mt-1 text-sm text-ink-light">
                Attach a PDF resume and the job description to score the match.
              </p>

              {uploadError && (
                <div className="mt-4 rounded-md border border-signal-weak/30 bg-signal-weak/10 px-4 py-3 text-sm text-signal-weak">
                  {uploadError}
                </div>
              )}

              <div className="mt-5">
                <label className="block text-sm font-medium">
                  Job description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  placeholder="Paste the full job description here…"
                  className="mt-1.5 w-full resize-none rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium">
                  Resume (PDF)
                </label>
                <label
                  htmlFor="resume-file"
                  className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink/25 bg-paper px-4 py-6 text-center transition hover:border-ink/40"
                >
                  <span className="text-sm font-medium text-ink">
                    {file ? file.name : "Click to choose a PDF"}
                  </span>
                  <span className="mt-1 text-xs text-ink-light">Max 5MB</span>
                  <input
                    id="resume-file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="mt-6 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {analyzing ? "Analyzing…" : "Analyze resume"}
              </button>
            </form>

            <div className="rounded-xl border border-ink/10 bg-white p-6">
              <h2 className="font-display text-xl font-semibold">Result</h2>
              {!result && !analyzing && (
                <p className="mt-4 text-sm text-ink-light">
                  Run a review to see the score, strengths, and gaps here.
                </p>
              )}
              {analyzing && (
                <div className="mt-8 flex flex-col items-center gap-3 text-sm text-ink-light">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
                  Reading the resume against the job description…
                </div>
              )}
              {result && !analyzing && (
                <div className="mt-4">
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={result.analysis.score} />
                    <div>
                      <p className="font-medium">{result.filename}</p>
                      <p className="text-xs text-ink-light">
                        Reviewed {new Date(result.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <AnalysisLists analysis={result.analysis} />
                </div>
              )}
            </div>
          </div>
        )}

        {tab === TABS.HISTORY && (
          <div>
            {historyLoading && (
              <p className="text-sm text-ink-light">Loading history…</p>
            )}
            {historyError && (
              <div className="rounded-md border border-signal-weak/30 bg-signal-weak/10 px-4 py-3 text-sm text-signal-weak">
                {historyError}
              </div>
            )}
            {!historyLoading && !historyError && history.length === 0 && (
              <div className="rounded-xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink-light">
                No reviews yet. Run your first one from the "New review" tab.
              </div>
            )}
            <div className="space-y-3">
              {history.map((item) => {
                const isOpen = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-ink/10 bg-white p-5"
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <ScoreBadge score={item.analysis.score} size="sm" />
                        <div>
                          <p className="font-medium">{item.filename}</p>
                          <p className="text-xs text-ink-light">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-ink-light">
                        {isOpen ? "Hide" : "Details"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="mt-5 border-t border-ink/10 pt-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-ink-light">
                          Job description
                        </p>
                        <p className="mt-1 whitespace-pre-line text-sm text-ink-light">
                          {item.jobDescription}
                        </p>
                        <AnalysisLists analysis={item.analysis} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
      active ? "bg-white text-ink shadow-sm" : "text-ink-light hover:text-ink"
    }`}
  >
    {children}
  </button>
);

const AnalysisLists = ({ analysis }) => (
  <div className="mt-5 grid gap-5 sm:grid-cols-2">
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-signal-strong">
        Strengths
      </p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {analysis.strengths.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-signal-strong">+</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-signal-weak">
        Gaps
      </p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {analysis.weaknesses.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-signal-weak">–</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Home;
