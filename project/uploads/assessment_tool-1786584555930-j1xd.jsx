import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ClipboardList,
  Activity,
  Sliders,
  MessageSquare,
  PieChart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  Users,
  Trash2,
  Plus,
  Loader2,
  Calendar,
  Printer,
  X
} from 'lucide-react';

// --- Assessment Configuration ---
const SPS_CATEGORIES = [
  "Income Stability & Predictability",
  "Healthcare Exposure & Costs",
  "Housing Costs & Security",
  "Debt Burden & Servicing",
  "Dependent Care Obligations",
  "Emergency Liquidity",
  "Inflation & Cost of Living Impact",
  "Employment Security",
  "Legal or Tax Pressures",
  "Transportation Costs & Reliability"
];

const FFI_CATEGORIES = [
  "Manual Bill Payments",
  "Fragmented Accounts",
  "Complex Budgeting Systems",
  "Unclear Investment Fees",
  "Difficulty Accessing Financial Data",
  "Time Spent Reconciling Transactions",
  "Friction in Moving Money (Transfers)",
  "Lack of Automated Savings"
];

const QUALITATIVE_PROMPTS = [
  { id: 'overwhelming', label: "What aspects of your financial life feel most overwhelming?" },
  { id: 'confident', label: "What financial decisions do you feel confident about?" },
  { id: 'change', label: "If you could change one thing about your finances right now, what would it be?" }
];

// FCI weighting: structural pressure carries the most weight since it's the least
// "fixable" of the three inputs; friction carries the least since it's the most
// directly actionable. Adjust these to retune the composite without touching the
// calculation logic below.
const FCI_WEIGHTS = { sps: 0.4, cas: 0.35, ffi: 0.25 };

const STORAGE_PREFIX = 'assessment_';

// --- Pure scoring function (shared by live wizard and saved-report views) ---
function computeResults(sps, ffi, cas) {
  const spsTotal = sps.reduce((a, b) => a + b, 0);
  const spsNorm = ((spsTotal - 10) / 40) * 100;

  const ffiTotal = ffi.reduce((a, b) => a + b, 0);
  const ffiNorm = ((ffiTotal - 8) / 32) * 100;

  const totalStressors = cas.direct + cas.indirect + cas.outOfControl;
  // If no stressors were logged, there's no basis to call agency low — treat it
  // as neutral (50) rather than letting it drag the composite down to 0.
  const casScore = totalStressors > 0
    ? ((cas.direct + cas.indirect) / totalStressors) * 100
    : 50;

  // Weighted composite: structural pressure counts most (least within a person's
  // control), friction counts least (most directly fixable). See FCI_WEIGHTS above.
  const fci =
    (100 - spsNorm) * FCI_WEIGHTS.sps +
    casScore * FCI_WEIGHTS.cas +
    (100 - ffiNorm) * FCI_WEIGHTS.ffi;

  const topSps = sps.map((val, idx) => ({ name: SPS_CATEGORIES[idx], val }))
    .sort((a, b) => b.val - a.val).slice(0, 2);

  const topFfi = ffi.map((val, idx) => ({ name: FFI_CATEGORIES[idx], val }))
    .sort((a, b) => b.val - a.val).slice(0, 2);

  return { spsTotal, spsNorm, ffiTotal, ffiNorm, casScore, fci, topSps, topFfi, totalStressors };
}

function defaultState() {
  return {
    clientName: '',
    sps: Array(10).fill(3),
    ffi: Array(8).fill(3),
    cas: { direct: 0, indirect: 0, outOfControl: 0 },
    qualitative: { overwhelming: '', confident: '', change: '' }
  };
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

// --- Brand Logo Component ---
const BrandLogo = () => (
  <svg viewBox="0 0 500 150" className="h-24 mx-auto mb-6 print:h-20" preserveAspectRatio="xMidYMid meet">
    <text x="20" y="75" fontFamily="Georgia, serif" fontSize="64" fill="#004b73">nBalance</text>
    <text x="80" y="130" fontFamily="Georgia, serif" fontSize="54" fill="#d56a2a">Financial</text>
    <g transform="translate(320, 15) scale(1.1)">
      <path d="M 60,60 C 90,30 130,30 130,70 C 130,110 90,110 60,80" fill="none" stroke="#d56a2a" strokeWidth="24" strokeLinecap="round" />
      <circle cx="106" cy="70" r="18" fill="#9ca3af" />
      <path d="M 60,60 C 30,90 -10,90 -10,50 C -10,10 30,10 60,40" fill="none" stroke="#004b73" strokeWidth="24" strokeLinecap="round" />
      <circle cx="14" cy="50" r="18" fill="#004b73" />
    </g>
  </svg>
);

const ProgressBar = ({ value, label, colorClass }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value.toFixed(1)} / 100</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      ></div>
    </div>
  </div>
);

const RangeInput = ({ label, value, onChange }) => (
  <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
    <div className="flex justify-between mb-2">
      <label className="font-medium text-slate-800">{label}</label>
      <span className="text-[#004b73] font-bold bg-[#f2f7fa] px-2 py-1 rounded text-sm">{value}</span>
    </div>
    <input
      type="range"
      min="1"
      max="5"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#004b73]"
    />
    <div className="flex justify-between text-xs text-slate-400 mt-2">
      <span>1 (Low/None)</span>
      <span>5 (Severe/High)</span>
    </div>
  </div>
);

// --- Results / Report block, shared between the live wizard and saved reports ---
function ResultsView({ results, cas, qualitative, clientName, date, footer }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
          {clientName ? `${clientName}'s Capacity Report` : 'Your Capacity Report'}
        </h2>
        {date && <p className="text-slate-400 text-sm mb-2">{formatDate(date)}</p>}
        <p className="text-slate-500">Synthesizing structural realities, systemic friction, and personal agency.</p>
      </div>

      <div className="bg-gradient-to-br from-[#004b73] to-[#002f4a] rounded-3xl p-8 text-white mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-[#e6f0f5] text-lg font-semibold uppercase tracking-wider mb-2">Financial Capacity Index (FCI)</h3>
          <p className="text-[#f2f7fa] leading-relaxed mb-4">
            This composite score reflects overall functional capacity. A higher score means higher resilience and leverage against stress.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <CheckCircle size={16} />
            {results.fci >= 70 ? 'High Capacity' : results.fci >= 40 ? 'Moderate Capacity' : 'Overload Alert'}
          </div>
        </div>
        <div className="w-48 h-48 rounded-full border-8 border-white/20 flex items-center justify-center shrink-0 relative bg-white/10 backdrop-blur-md">
          <div className="text-center">
            <span className="text-5xl font-black">{Math.round(results.fci)}</span>
            <span className="block text-[#e6f0f5] text-sm mt-1">/ 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm print-break-inside-avoid">
          <h4 className="font-bold text-slate-800 mb-1 flex justify-between">
            Structural Pressure
            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-sm">{results.spsTotal}/50</span>
          </h4>
          <p className="text-xs text-slate-500 mb-4">Normalized: {results.spsNorm.toFixed(1)}/100</p>
          <ProgressBar value={results.spsNorm} label="Pressure Level" colorClass="bg-rose-500" />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Top Drivers:</p>
            {results.topSps.map(item => (
              <div key={item.name} className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 truncate mr-2" title={item.name}>{item.name}</span>
                <span className="font-bold text-slate-800">{item.val}/5</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm print-break-inside-avoid">
          <h4 className="font-bold text-slate-800 mb-1 flex justify-between">
            Financial Friction
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-sm">{results.ffiTotal}/40</span>
          </h4>
          <p className="text-xs text-slate-500 mb-4">Normalized: {results.ffiNorm.toFixed(1)}/100</p>
          <ProgressBar value={results.ffiNorm} label="Friction Level" colorClass="bg-amber-500" />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Top Drivers:</p>
            {results.topFfi.map(item => (
              <div key={item.name} className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 truncate mr-2" title={item.name}>{item.name}</span>
                <span className="font-bold text-slate-800">{item.val}/5</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm print-break-inside-avoid">
          <h4 className="font-bold text-slate-800 mb-1 flex justify-between">
            Control Alignment
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm">{Math.round(results.casScore)}%</span>
          </h4>
          <p className="text-xs text-slate-500 mb-4">Stressors in direct/indirect control</p>
          <ProgressBar value={results.casScore} label="Agency Level" colorClass="bg-emerald-500" />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Distribution:</p>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Actionable</span>
              <span className="font-bold text-slate-800">{cas.direct + cas.indirect}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Systemic/External</span>
              <span className="font-bold text-slate-800">{cas.outOfControl}</span>
            </div>
          </div>
        </div>
      </div>

      {(qualitative.overwhelming || qualitative.confident || qualitative.change) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 print-break-inside-avoid">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="text-[#004b73]" /> In Their Own Words
          </h3>
          <div className="space-y-5">
            {QUALITATIVE_PROMPTS.map((prompt) => (
              qualitative[prompt.id] && (
                <div key={prompt.id}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{prompt.label}</p>
                  <p className="text-slate-700 italic border-l-2 border-slate-200 pl-4">{qualitative[prompt.id]}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-8 print-break-inside-avoid">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="text-[#d56a2a]" /> Narrative & Action Plan
        </h3>
        <div className="space-y-4 text-slate-700">
          <p>
            {clientName ? `${clientName}'s` : 'The'} overall financial capacity score is <strong>{Math.round(results.fci)}/100</strong>.
            {results.casScore < 50
              ? " A significant portion of the financial stress is stemming from factors currently outside direct control, which can lead to feelings of overwhelm."
              : " There is a strong sense of agency here, recognizing that many stressors can be managed or influenced over time."}
          </p>
          <p>
            The primary structural pressures are <strong>{results.topSps[0].name.toLowerCase()}</strong> and <strong>{results.topSps[1].name.toLowerCase()}</strong>.
            Compounding this, cognitive friction is highest in <strong>{results.topFfi[0].name.toLowerCase()}</strong>.
          </p>
          <div className="bg-white p-5 rounded-xl border border-slate-200 mt-6">
            <h4 className="font-bold text-slate-800 mb-3 uppercase text-sm tracking-wide">Recommended Interventions</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-semibold block text-slate-800">System Redesign (Reduce Friction):</span>
                  <span className="text-sm">Target "{results.topFfi[0].name}". Automate this process, consolidate accounts, or delegate this task this week to free up cognitive bandwidth.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-semibold block text-slate-800">Macro Strategy (Address Pressure):</span>
                  <span className="text-sm">For "{results.topSps[0].name}", identify one <em>indirect control</em> action (e.g., scheduling a meeting, reviewing a policy, or starting a 3-month research plan).</span>
                </div>
              </li>
              {results.casScore < 50 && (
                <li className="flex gap-3">
                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="font-semibold block text-slate-800">Reclaim Agency:</span>
                    <span className="text-sm">Focus strictly on the {cas.direct} item(s) in direct control. Park the {cas.outOfControl} systemic stressors temporarily to avoid decision fatigue.</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {footer}
    </div>
  );
}

export default function App() {
  // view: 'dashboard' | 'wizard' | 'report'
  const [view, setView] = useState('dashboard');
  const [step, setStep] = useState(0); // 0: Intro, 1: SPS, 2: CAS, 3: FFI, 4: Qual, 5: Results

  const [wizardState, setWizardState] = useState(defaultState());
  const { clientName, sps, ffi, cas, qualitative } = wizardState;

  const [assessments, setAssessments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [selectedRecord, setSelectedRecord] = useState(null); // full saved record being viewed
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [deletingId, setDeletingId] = useState(null);

  const results = useMemo(() => computeResults(sps, ffi, cas), [sps, ffi, cas]);

  // --- Load saved assessments for the dashboard ---
  const refreshList = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const listResult = await window.storage.list(STORAGE_PREFIX, false);
      const keys = listResult?.keys || [];
      const records = await Promise.all(keys.map(async (key) => {
        try {
          const entry = await window.storage.get(key, false);
          if (!entry) return null;
          const parsed = JSON.parse(entry.value);
          return { key, ...parsed };
        } catch {
          return null;
        }
      }));
      const valid = records.filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
      setAssessments(valid);
    } catch (err) {
      setListError('Could not load saved assessments.');
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  // --- Wizard helpers ---
  const startNewAssessment = () => {
    setWizardState(defaultState());
    setSaveStatus('idle');
    setStep(0);
    setView('wizard');
  };

  const backToDashboard = () => {
    setView('dashboard');
    setSelectedRecord(null);
    refreshList();
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const updateSps = (idx, val) => {
    const next = [...sps];
    next[idx] = val;
    setWizardState({ ...wizardState, sps: next });
  };
  const updateFfi = (idx, val) => {
    const next = [...ffi];
    next[idx] = val;
    setWizardState({ ...wizardState, ffi: next });
  };
  const updateCas = (field, val) => {
    setWizardState({ ...wizardState, cas: { ...cas, [field]: val } });
  };
  const updateQual = (id, val) => {
    setWizardState({ ...wizardState, qualitative: { ...qualitative, [id]: val } });
  };

  // --- Persistence ---
  const handleSave = async () => {
    setSaveStatus('saving');
    const id = `${STORAGE_PREFIX}${Date.now()}`;
    const record = {
      id,
      clientName: clientName?.trim() || 'Unnamed Client',
      date: new Date().toISOString(),
      sps,
      ffi,
      cas,
      qualitative,
      results
    };
    try {
      const result = await window.storage.set(id, JSON.stringify(record), false);
      if (!result) throw new Error('Storage write returned no result');
      setSaveStatus('saved');
      refreshList();
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleView = async (key) => {
    try {
      const entry = await window.storage.get(key, false);
      if (!entry) throw new Error('Not found');
      const parsed = JSON.parse(entry.value);
      setSelectedRecord(parsed);
      setView('report');
    } catch (err) {
      setListError('Could not open that assessment.');
    }
  };

  const handleDelete = async (key) => {
    setDeletingId(key);
    try {
      await window.storage.delete(key, false);
      setAssessments(prev => prev.filter(a => a.key !== key));
    } catch (err) {
      setListError('Could not delete that assessment.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          @page { size: portrait; margin: 0.5in; }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 print:bg-white text-slate-800 font-sans p-4 md:p-8 print:p-0">
        <div className="max-w-4xl mx-auto print:max-w-none">

          <header className="mb-8 text-center print:mb-6">
            <BrandLogo />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3 print:text-2xl">
              Financial Capacity Assessment
            </h1>
            <p className="text-slate-500 mt-2 print:text-sm">Integrating structural forces, friction, and personal agency.</p>
          </header>

          {/* ===================== DASHBOARD ===================== */}
          {view === 'dashboard' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 md:p-10 print:hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#f2f7fa] rounded-xl text-[#004b73]">
                    <Users size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Saved Assessments</h2>
                    <p className="text-slate-500 text-sm">Pick up a past assessment or start a new one.</p>
                  </div>
                </div>
                <button
                  onClick={startNewAssessment}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-white bg-[#d56a2a] hover:bg-[#bd5d23] transition-colors shadow-sm shrink-0"
                >
                  <Plus size={18} /> New Assessment
                </button>
              </div>

              {listError && (
                <div className="mb-4 flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle size={16} /> {listError}
                </div>
              )}

              {listLoading ? (
                <div className="flex items-center justify-center gap-2 text-slate-400 py-16">
                  <Loader2 size={20} className="animate-spin" /> Loading saved assessments...
                </div>
              ) : assessments.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <ClipboardList size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No assessments saved yet.</p>
                  <p className="text-sm">Start a new assessment and save it when you reach the report.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assessments.map((a) => (
                    <div
                      key={a.key}
                      className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl p-4 hover:border-[#004b73]/40 hover:bg-slate-50 transition-colors"
                    >
                      <button onClick={() => handleView(a.key)} className="flex-1 flex items-center gap-4 text-left min-w-0">
                        <div className="w-12 h-12 rounded-full bg-[#004b73] text-white flex items-center justify-center font-bold shrink-0">
                          {Math.round(a.results?.fci ?? 0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{a.clientName || 'Unnamed Client'}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(a.date)}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDelete(a.key)}
                        disabled={deletingId === a.key}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                        title="Delete assessment"
                      >
                        {deletingId === a.key ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================== SAVED REPORT VIEW ===================== */}
          {view === 'report' && selectedRecord && (
            <div className="bg-white rounded-2xl shadow-xl print:shadow-none overflow-hidden print:overflow-visible border border-slate-100 print:border-none p-6 md:p-10">
              <ResultsView
                results={selectedRecord.results}
                cas={selectedRecord.cas}
                qualitative={selectedRecord.qualitative}
                clientName={selectedRecord.clientName}
                date={selectedRecord.date}
              />
              <div className="flex flex-wrap gap-3 justify-center print:hidden mt-4">
                <button
                  onClick={backToDashboard}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <ArrowLeft size={18} /> Back to Saved Assessments
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors"
                >
                  <Printer size={18} /> Print / Save PDF
                </button>
              </div>
            </div>
          )}

          {/* ===================== WIZARD ===================== */}
          {view === 'wizard' && (
            <>
              <div className="bg-white rounded-2xl shadow-xl print:shadow-none overflow-hidden print:overflow-visible border border-slate-100 print:border-none">

                {step === 0 && (
                  <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-[#fdf0e9] rounded-2xl text-[#d56a2a]">
                        <ClipboardList size={32} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Welcome to the Assessment</h2>
                        <p className="text-slate-500">Mapping your financial ecosystem.</p>
                      </div>
                    </div>
                    <div className="prose text-slate-600 mb-6">
                      <p>This assessment is designed to look beyond just numbers. We measure four key metrics to understand true functional capacity under financial stress:</p>
                      <ul className="space-y-2 mt-4">
                        <li><strong>SPS (Structural Pressure):</strong> The external economic realities faced.</li>
                        <li><strong>FFI (Financial Friction):</strong> The cognitive load and system inefficiencies in managing money.</li>
                        <li><strong>CAS (Control Alignment):</strong> How much agency is felt over financial stressors.</li>
                        <li><strong>FCI (Financial Capacity):</strong> Overall resilience and leverage.</li>
                      </ul>
                      <p className="mt-4 text-sm bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100">
                        <strong>Privacy Note:</strong> This is a secure, client-side tool. Saved assessments are stored only for your account and are not shared with anyone else.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Client Name (optional)</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setWizardState({ ...wizardState, clientName: e.target.value })}
                        placeholder="e.g. Jordan Ellis"
                        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#004b73] outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-2">Used to label this assessment when you save it — never required.</p>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sliders className="text-[#004b73]" /> Structural Pressure Score (SPS)
                      </h2>
                      <p className="text-slate-500">Rate the external pressure felt in the following categories (1 = No pressure, 5 = Severe pressure).</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      {SPS_CATEGORIES.map((cat, idx) => (
                        <RangeInput key={idx} label={cat} value={sps[idx]} onChange={(val) => updateSps(idx, val)} />
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PieChart className="text-[#004b73]" /> Sphere of Control Grid (SCG)
                      </h2>
                      <p className="text-slate-500">Think about the top financial stressors right now. Tally how many fall into each control category.</p>
                    </div>
                    <div className="space-y-6 max-w-xl mx-auto">
                      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                        <label className="block font-bold text-emerald-900 mb-2">1. Direct Control</label>
                        <p className="text-sm text-emerald-700 mb-3">Stressors actionable immediately (e.g., canceling a subscription).</p>
                        <input
                          type="number" min="0"
                          className="w-full p-3 rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                          value={cas.direct}
                          onChange={(e) => updateCas('direct', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
                        <label className="block font-bold text-amber-900 mb-2">2. Indirect Control</label>
                        <p className="text-sm text-amber-700 mb-3">Stressors influenceable over time (e.g., career trajectory, credit score).</p>
                        <input
                          type="number" min="0"
                          className="w-full p-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none"
                          value={cas.indirect}
                          onChange={(e) => updateCas('indirect', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl">
                        <label className="block font-bold text-rose-900 mb-2">3. Out of Control</label>
                        <p className="text-sm text-rose-700 mb-3">Systemic or external forces (e.g., interest rates, inflation).</p>
                        <input
                          type="number" min="0"
                          className="w-full p-3 rounded-lg border border-rose-300 focus:ring-2 focus:ring-rose-500 outline-none"
                          value={cas.outOfControl}
                          onChange={(e) => updateCas('outOfControl', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="text-[#004b73]" /> Financial Friction Index (FFI)
                      </h2>
                      <p className="text-slate-500">Rate the logistical difficulty and cognitive load of managing these areas (1 = Fully automated/Easy, 5 = Highly manual/Difficult).</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      {FFI_CATEGORIES.map((cat, idx) => (
                        <RangeInput key={idx} label={cat} value={ffi[idx]} onChange={(val) => updateFfi(idx, val)} />
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="text-[#004b73]" /> Qualitative Narratives
                      </h2>
                      <p className="text-slate-500">Numbers alone cannot capture the depth of the financial experience. Please share your thoughts.</p>
                    </div>
                    <div className="space-y-6">
                      {QUALITATIVE_PROMPTS.map((prompt) => (
                        <div key={prompt.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                          <label className="block font-semibold text-slate-800 mb-3">{prompt.label}</label>
                          <textarea
                            className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#004b73] outline-none resize-none h-32"
                            placeholder="Type your response here..."
                            value={qualitative[prompt.id]}
                            onChange={(e) => updateQual(prompt.id, e.target.value)}
                          ></textarea>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="p-6 md:p-10">
                    <ResultsView
                      results={results}
                      cas={cas}
                      qualitative={qualitative}
                      clientName={clientName}
                      date={null}
                      footer={
                        <div className="flex flex-wrap gap-3 justify-center print:hidden">
                          <button
                            onClick={handleSave}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-[#004b73] hover:bg-[#003a5a] transition-colors shadow-sm disabled:opacity-60"
                          >
                            {saveStatus === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save Assessment'}
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                          >
                            <Printer size={18} /> Print / Save PDF
                          </button>
                          {saveStatus === 'error' && (
                            <p className="w-full text-center text-sm text-rose-600 flex items-center justify-center gap-1">
                              <AlertCircle size={14} /> Couldn't save — check your connection and try again.
                            </p>
                          )}
                        </div>
                      }
                    />
                  </div>
                )}

              </div>

              {/* Footer Navigation */}
              <div className="bg-slate-50 border border-t-0 border-slate-100 rounded-b-2xl p-4 md:px-10 flex justify-between items-center print:hidden">
                {step > 0 ? (
                  <button onClick={prevStep} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={18} /> Back
                  </button>
                ) : (
                  <button onClick={backToDashboard} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                    <X size={18} /> Cancel
                  </button>
                )}

                {step < 5 ? (
                  <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-[#d56a2a] hover:bg-[#bd5d23] transition-colors shadow-sm">
                    {step === 0 ? 'Start Assessment' : 'Continue'} <ArrowRight size={18} />
                  </button>
                ) : (
                  <button onClick={startNewAssessment} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm">
                    Start New Assessment
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
