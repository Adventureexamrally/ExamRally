import React, { useState, useEffect, useContext, useCallback, memo } from "react";
import Api from "../service/Api";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaCloudDownloadAlt, FaCalendarAlt, FaLock } from "react-icons/fa";
import { UserContext } from "../context/UserProvider";
import { CircularProgress } from "@mui/material";
import { generateImageEnabledPDF } from "../utils/pdfGenerator";

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  completed: { bar: "bg-emerald-400", btn: "bg-emerald-500 hover:bg-emerald-600 text-white", label: "Result" },
  paused: { bar: "bg-amber-400", btn: "bg-amber-500 hover:bg-amber-600 text-white", label: "Resume" },
  default: { bar: "bg-green-400", btn: "bg-green-600 hover:bg-green-700 text-white", label: "Take Test" },
};

const langPillCls = (active) =>
  `text-[9px] px-2 py-0.5 rounded-full font-bold transition-all ${active ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
  }`;

// ─── LangPill ─────────────────────────────────────────────────────────────────

const LangPill = memo(({ code, label, current, onSelect }) => (
  <button onClick={() => onSelect(code)} className={langPillCls(current === code)}>
    {label}
  </button>
));

// ─── ExamCard ─────────────────────────────────────────────────────────────────

const ExamCard = memo(({
  model, examObj, examId, testStatus, isSignedIn, isEnrolled,
  generatingPdf, loadingTests, selectedLanguage,
  onSetLang, onViewPdf, onTestClick,
}) => {
  const statusStyle = STATUS_MAP[testStatus] ?? STATUS_MAP.default;
  const examMeta = typeof examObj === "object" ? examObj : null;

  const showLangSelector =
    !model.pdfLink && examMeta && isSignedIn && isEnrolled &&
    [examMeta.english_status, examMeta.tamil_status, examMeta.hindi_status].filter(Boolean).length > 1;

  const currentLang = selectedLanguage[examId] || "english";
  const pdfDisabled = generatingPdf[examId] || (!isEnrolled && isSignedIn);
  const testDisabled = loadingTests[examId] || (!isEnrolled && isSignedIn);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Status bar */}
      <div className={`h-1 w-full ${statusStyle.bar}`} />

      <div className="p-3 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xs font-bold text-slate-800 text-center mb-3 leading-tight min-h-[2.5rem] flex items-center justify-center">
          {model.show_name}
        </h3>

        {/* Language pills */}
        {showLangSelector && (
          <div className="mb-2.5">
            <p className="text-[9px] text-slate-400 text-center uppercase tracking-wide mb-1 font-semibold">
              PDF Lang
            </p>
            <div className="flex gap-1 justify-center">
              {examMeta.english_status && <LangPill code="english" label="EN" current={currentLang} onSelect={(c) => onSetLang(examId, c)} />}
              {examMeta.tamil_status && <LangPill code="tamil" label="TA" current={currentLang} onSelect={(c) => onSetLang(examId, c)} />}
              {examMeta.hindi_status && <LangPill code="hindi" label="HI" current={currentLang} onSelect={(c) => onSetLang(examId, c)} />}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-1.5 mt-auto">
          {/* PDF button */}
          {model.pdfLink ? (
            <a
              href={model.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-[11px] font-bold transition-colors"
            >
              <FaCloudDownloadAlt className="text-xs" /> PDF
            </a>
          ) : (
            <button
              onClick={() => onViewPdf(model)}
              disabled={pdfDisabled}
              className={`flex flex-1 items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold transition-colors ${pdfDisabled
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-green-50 text-green-700 border border-green-300 hover:bg-green-100"
                }`}
            >
              {generatingPdf[examId]
                ? <CircularProgress size={10} thickness={5} color="inherit" />
                : <FaCloudDownloadAlt className="text-xs" />}
              {generatingPdf[examId] ? "..." : "PDF"}
            </button>
          )}

          {/* Test button */}
          <button
            onClick={() => onTestClick(examId, testStatus)}
            disabled={testDisabled}
            className={`flex flex-1 items-center justify-center gap-0.5 py-2 px-1 rounded-lg text-[11px] font-bold transition-colors ${!isSignedIn
                ? "bg-green-600 hover:bg-green-700 text-white"
                : !isEnrolled
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : statusStyle.btn
              }`}
          >
            {loadingTests[examId] ? (
              <CircularProgress size={12} thickness={5} color="inherit" />
            ) : !isSignedIn ? (
              "Start"
            ) : !isEnrolled ? (
              <><FaLock className="text-[9px]" /> Lock</>
            ) : (
              statusStyle.label
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

// ─── CAmonth (main) ───────────────────────────────────────────────────────────

const CAmonth = () => {
  const navigate = useNavigate();
  const { user, utcNow } = useContext(UserContext);

  const [CA, setCA] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [resultData, setResultData] = useState({});
  const [loadingTests, setLoadingTests] = useState({});
  const [generatingPdf, setGeneratingPdf] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState({});

  const isSignedIn = !!user?._id;

  // ── fetch CA data ────────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    Api.get("topic-test/getAffairs/all").then((res) => {
      if (!alive) return;
      const data = res.data
        .filter((item) => {
          const y = parseInt(item.currentAffair.month?.split(" ")[1]);
          return y === 2025 || y === 2026;
        })
        .sort((a, b) => new Date(b.currentAffair.month) - new Date(a.currentAffair.month));

      setCA(data);

      // Auto-open first week per month (namespaced key to avoid collisions)
      const init = {};
      data.forEach((ca) => {
        const first = ca.currentAffair?.week?.[0];
        if (ca.currentAffair?.month && first?.title)
          init[`${ca.currentAffair.month}::${first.title}`] = true;
      });
      setExpandedWeeks(init);
    }).catch((e) => console.error("CA fetch error:", e));

    return () => { alive = false; };
  }, []);

  // ── enrollment + results ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id || !CA.length || !utcNow) return;
    let alive = true;

    // Enrollment check
    const isActive = (expiryDate) => new Date(expiryDate) > utcNow;
    const enrolled =
      user.enrolledCourses?.some((c) => c?.expiryDate && isActive(c.expiryDate)) ||
      user.subscriptions?.some((s) => s?.expiryDate && isActive(s.expiryDate)) ||
      false;
    setIsEnrolled(enrolled);

    // Collect unique exam IDs using a Set (O(1) lookups)
    const examIdSet = new Set();
    CA.forEach((ca) =>
      ca.currentAffair?.week?.forEach((week) =>
        week?.model?.forEach((m) =>
          m?.exams?.forEach((ex) => {
            const id = ex?._id || ex;
            if (id) examIdSet.add(id);
          })
        )
      )
    );

    // Parallel fetch all results
    Promise.allSettled(
      [...examIdSet].map((id) =>
        Api.get(`/results/${user._id}/${id}`).then((res) => ({ id, data: res.data }))
      )
    ).then((settled) => {
      if (!alive) return;
      const results = {};
      settled.forEach((r) => {
        if (r.status === "fulfilled") {
          const { id, data } = r.value;
          if (data?.status === "completed" || data?.status === "paused") {
            results[id] = {
              ...data,
              lastQuestionIndex: data.lastVisitedQuestionIndex,
              selectedOptions: data.selectedOptions,
            };
          }
        }
      });
      setResultData(results);
    });

    return () => { alive = false; };
  }, [user, CA, utcNow]);

  // ── postMessage listener (window-to-window test updates) ─────────────────────
  const refreshResult = useCallback(
    async (examId) => {
      if (!user?._id) return;
      try {
        const res = await Api.get(`/results/${user._id}/${examId}`);
        if (res.data?.status === "completed" || res.data?.status === "paused") {
          setResultData((prev) => ({
            ...prev,
            [examId]: {
              ...res.data,
              lastQuestionIndex: res.data.lastVisitedQuestionIndex,
              selectedOptions: res.data.selectedOptions,
            },
          }));
        }
      } catch (e) {
        console.error("refreshResult error:", e);
      }
    },
    [user]
  );

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "test-status-updated" && e.data.testId) {
        const id = e.data.testId;
        setLoadingTests((p) => ({ ...p, [id]: true }));
        refreshResult(id).finally(() =>
          setLoadingTests((p) => ({ ...p, [id]: false }))
        );
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [refreshResult]);

  // ── actions ──────────────────────────────────────────────────────────────────
  const openNewWindow = useCallback((url) => {
    window.open(url, "_blank", `width=${window.screen.width},height=${window.screen.height}`);
  }, []);

  const toggleWeek = useCallback((key) => {
    setExpandedWeeks((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const handleSetLang = useCallback((examId, lang) => {
    setSelectedLanguage((p) => ({ ...p, [examId]: lang }));
  }, []);

  const handleViewPdf = useCallback(async (model) => {
    const examObj = model.exams?.[0];
    const examId = examObj?._id || examObj;
    if (!examId) return;

    const language = selectedLanguage[examId] || "english";
    setGeneratingPdf((p) => ({ ...p, [examId]: true }));
    try {
      const { data: exam } = await Api.get(`exams/getExam/${examId}`);
      if (!exam?.section) throw new Error("Incomplete exam data");

      const questions = exam.section.flatMap((sec) =>
        (sec.questions?.[language] || sec.questions?.english || []).map((q) => ({
          ...q, sectionName: sec.name,
        }))
      );
      if (!questions.length) { alert(`No questions in ${language}.`); return; }

      await generateImageEnabledPDF(questions, {
        title: exam.show_name || exam.exam_name || model.show_name || "Exam PDF",
        watermarkText: user?.email || "ExamRally",
        sectionTitle: "Full Exam Questions",
        explanationTitle: "Answer & Explanations",
        language,
      });
    } catch (e) {
      console.error("PDF gen error:", e);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPdf((p) => ({ ...p, [examId]: false }));
    }
  }, [selectedLanguage, user]);

  const handleTestClick = useCallback((examId, testStatus) => {
    if (!isSignedIn) { navigate("/sign-in"); return; }
    if (!isEnrolled) return;
    if (testStatus === "completed") openNewWindow(`/liveresult/${examId}/${user._id}`);
    else if (testStatus === "paused") openNewWindow(`/mocklivetest/${examId}/${user._id}`);
    else openNewWindow(`/instruct/${examId}/${user._id}`);
  }, [isSignedIn, isEnrolled, user, navigate, openNewWindow]);

  // ── render ───────────────────────────────────────────────────────────────────
  if (!CA.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <CircularProgress size={40} style={{ color: "#16a34a" }} />
          <p className="mt-4 text-slate-500 font-medium">Loading current affairs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {CA.map((ca) => (
        <div
          key={ca.currentAffair.month}
          className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white"
        >
          {/* Month header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-green-600 to-emerald-500">
            <FaCalendarAlt className="text-white/80 text-lg" />
            <h2 className="text-lg font-bold text-white tracking-wide">{ca.currentAffair.month}</h2>
          </div>

          {/* Week list */}
          <div className="divide-y divide-slate-100">
            {ca.currentAffair.week.map((week, wi) => {
              const weekKey = `${ca.currentAffair.month}::${week.title}`;
              const isOpen = !!expandedWeeks[weekKey];

              return (
                <div key={weekKey}>
                  <button
                    className={`w-full px-5 py-3.5 flex justify-between items-center transition-colors ${isOpen ? "bg-green-50 text-green-800" : "bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    onClick={() => toggleWeek(weekKey)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${isOpen ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                        {wi + 1}
                      </span>
                      <span className="font-semibold text-sm">{week.title}</span>
                    </div>
                    <FaChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-green-600" : "text-slate-400"}`} />
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-green-50/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {week.model.map((model) => {
                          const examObj = model.exams?.[0];
                          const examId = examObj?._id || examObj;
                          const testStatus = resultData[examId]?.status;

                          return (
                            <ExamCard
                              key={model.show_name}
                              model={model}
                              examObj={examObj}
                              examId={examId}
                              testStatus={testStatus}
                              isSignedIn={isSignedIn}
                              isEnrolled={isEnrolled}
                              generatingPdf={generatingPdf}
                              loadingTests={loadingTests}
                              selectedLanguage={selectedLanguage}
                              onSetLang={handleSetLang}
                              onViewPdf={handleViewPdf}
                              onTestClick={handleTestClick}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CAmonth;
