import { useState } from 'react';
import { seedHistory } from '../data/seedHistory';
import {
  SPS_CATEGORIES,
  FFI_CATEGORIES,
  QUAL_PROMPTS,
  defaultDraft,
  flattenReport,
  planItemsFor,
  buildRatingList,
  formatDate,
} from '../lib/scoring';

const STEP_TOTAL = 4;
const CHART_COLORS = ['#c9c2b4', '#8a95a0', '#004b73'];

export function useAppState() {
  const [tab, setTab] = useState('home');
  const [screen, setScreen] = useState(null); // null | 'wizard' | 'results' | 'plan'
  const [wizardStep, setWizardStep] = useState(0);
  const [reportIndex, setReportIndex] = useState(0);
  const [checkedActions, setCheckedActions] = useState({});
  const [draft, setDraft] = useState(defaultDraft());
  const [history, setHistory] = useState(seedHistory);

  const showingOverlay = screen !== null;

  const setDraftValue = (group, idx, val) => {
    setDraft((d) => ({ ...d, [group]: d[group].map((x, i) => (i === idx ? val : x)) }));
  };
  const bumpCas = (field, delta) => {
    setDraft((d) => ({ ...d, cas: { ...d.cas, [field]: Math.max(0, d.cas[field] + delta) } }));
  };
  const updateQual = (id, val) => {
    setDraft((d) => ({ ...d, qualitative: { ...d.qualitative, [id]: val } }));
  };

  const latestReport = flattenReport(history[0]);
  const report = flattenReport(history[reportIndex] || history[0]);

  const planItems = planItemsFor(report).map((it) => {
    const checked = !!checkedActions[it.id];
    return {
      ...it,
      checked,
      onToggle: () => setCheckedActions((c) => ({ ...c, [it.id]: !c[it.id] })),
    };
  });
  const checkedCount = planItems.filter((i) => i.checked).length;

  const chartList = [...history]
    .slice()
    .reverse()
    .map((h, i) => {
      const r = flattenReport(h);
      return {
        fci: r.fciRounded,
        barHeightPx: (Math.max(6, r.fciRounded) / 100) * 92,
        barColor: CHART_COLORS[i] || '#004b73',
        shortDate: formatDate(h.date).replace(',', ''),
      };
    });

  const historyList = history.map((h, i) => {
    const r = flattenReport(h);
    return {
      fci: r.fciRounded,
      label: r.label,
      dateStr: r.dateStr,
      onTap: () => {
        setReportIndex(i);
        setScreen('results');
      },
    };
  });

  const resources = [
    { initial: 'A', bg: '#eef3f6', fg: '#004b73', title: 'Automate your bills', meta: 'Guide · 4 min' },
    { initial: 'C', bg: '#fdf0e9', fg: '#d56a2a', title: 'Consolidate old retirement accounts', meta: 'Guide · 6 min' },
    { initial: 'E', bg: '#e8f7f0', fg: '#047857', title: 'Build your emergency cushion', meta: 'Guide · 5 min' },
    { initial: 'T', bg: '#fef3e2', fg: '#b45309', title: 'Talk to a coach', meta: 'Coaching · Book a session' },
  ];

  const spsList = buildRatingList(SPS_CATEGORIES, draft.sps);
  const ffiList = buildRatingList(FFI_CATEGORIES, draft.ffi);
  const qualList = QUAL_PROMPTS.map((p) => ({ id: p.id, label: p.label, value: draft.qualitative[p.id] }));

  const goHome = () => {
    setTab('home');
    setScreen(null);
  };
  const goProgress = () => {
    setTab('progress');
    setScreen(null);
  };
  const goLearn = () => {
    setTab('learn');
    setScreen(null);
  };
  const goProfile = () => {
    setTab('profile');
    setScreen(null);
  };
  const viewLatestReport = () => {
    setReportIndex(0);
    setScreen('results');
  };
  const goPlan = () => setScreen('plan');
  const backFromResults = () => setScreen(null);
  const backFromPlan = () => setScreen('results');
  const startAssessment = () => {
    setScreen('wizard');
    setWizardStep(0);
    setDraft(defaultDraft());
  };
  const wizardClose = () => setScreen(null);
  const signOut = () => {
    setHistory(seedHistory);
    setCheckedActions({});
    setDraft(defaultDraft());
    setReportIndex(0);
    setWizardStep(0);
    setScreen(null);
    setTab('home');
  };
  const wizardBack = () => setWizardStep((s) => Math.max(0, s - 1));
  const wizardNext = () => {
    if (wizardStep < STEP_TOTAL) {
      setWizardStep((s) => s + 1);
      return;
    }
    const record = {
      id: Date.now(),
      date: new Date().toISOString(),
      sps: [...draft.sps],
      ffi: [...draft.ffi],
      cas: { ...draft.cas },
      qualitative: { ...draft.qualitative },
    };
    setHistory((h) => [record, ...h]);
    setReportIndex(0);
    setScreen('results');
    setTab('home');
  };

  return {
    tab,
    screen,
    showingOverlay,
    isHome: !showingOverlay && tab === 'home',
    isProgress: !showingOverlay && tab === 'progress',
    isLearn: !showingOverlay && tab === 'learn',
    isProfile: !showingOverlay && tab === 'profile',
    isWizard: screen === 'wizard',
    isResults: screen === 'results',
    isPlan: screen === 'plan',
    showTabBar: !showingOverlay,

    latestReport,
    report,
    planItems,
    checkedCount,
    chartList,
    historyList,
    resources,
    progressCopy:
      history.length > 1
        ? 'Your capacity has been trending up over the last few months.'
        : 'Complete another assessment to see your trend.',

    goHome,
    goProgress,
    goLearn,
    goProfile,
    viewLatestReport,
    goPlan,
    backFromResults,
    backFromPlan,
    startAssessment,
    wizardClose,
    signOut,

    wizardStep,
    wizardProgressPct: (wizardStep / STEP_TOTAL) * 100,
    isStep0: wizardStep === 0,
    isStep1: wizardStep === 1,
    isStep2: wizardStep === 2,
    isStep3: wizardStep === 3,
    isStep4: wizardStep === 4,
    showWizardBack: wizardStep > 0,
    wizardNextLabel: wizardStep === 0 ? 'Start assessment' : wizardStep === 4 ? 'See my results' : 'Continue',
    wizardBack,
    wizardNext,

    draft,
    spsList,
    ffiList,
    qualList,
    setDraftValue,
    bumpCas,
    updateQual,
  };
}
