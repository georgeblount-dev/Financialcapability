export const SPS_CATEGORIES = [
  'Income Stability & Predictability',
  'Healthcare Exposure & Costs',
  'Housing Costs & Security',
  'Debt Burden & Servicing',
  'Dependent Care Obligations',
  'Emergency Liquidity',
  'Inflation & Cost of Living Impact',
  'Employment Security',
  'Legal or Tax Pressures',
  'Transportation Costs & Reliability',
];

export const FFI_CATEGORIES = [
  'Manual Bill Payments',
  'Fragmented Accounts',
  'Complex Budgeting Systems',
  'Unclear Investment Fees',
  'Difficulty Accessing Financial Data',
  'Time Spent Reconciling Transactions',
  'Friction in Moving Money (Transfers)',
  'Lack of Automated Savings',
];

export const QUAL_PROMPTS = [
  { id: 'overwhelming', label: "What feels most overwhelming?" },
  { id: 'confident', label: "What do you feel confident about?" },
  { id: 'change', label: "What's one thing you'd change?" },
];

const QUAL_LABELS = {
  overwhelming: 'Feels most overwhelming',
  confident: 'Feels confident about',
  change: 'Would change',
};

const WEIGHTS = { sps: 0.4, cas: 0.35, ffi: 0.25 };

export function defaultDraft() {
  return {
    sps: Array(10).fill(3),
    ffi: Array(8).fill(3),
    cas: { direct: 0, indirect: 0, outOfControl: 0 },
    qualitative: { overwhelming: '', confident: '', change: '' },
  };
}

const clamp = (v) => Math.max(0, Math.min(100, v));

export function computeResults(entry) {
  const { sps, ffi, cas } = entry;
  const spsTotal = sps.reduce((a, b) => a + b, 0);
  const spsNorm = ((spsTotal - 10) / 40) * 100;
  const ffiTotal = ffi.reduce((a, b) => a + b, 0);
  const ffiNorm = ((ffiTotal - 8) / 32) * 100;
  const totalStressors = cas.direct + cas.indirect + cas.outOfControl;
  const casScore = totalStressors > 0 ? ((cas.direct + cas.indirect) / totalStressors) * 100 : 50;
  const fci = (100 - spsNorm) * WEIGHTS.sps + casScore * WEIGHTS.cas + (100 - ffiNorm) * WEIGHTS.ffi;
  const topSps = sps
    .map((val, idx) => ({ name: SPS_CATEGORIES[idx], val }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 2);
  const topFfi = ffi
    .map((val, idx) => ({ name: FFI_CATEGORIES[idx], val }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 2);
  return { spsTotal, spsNorm, ffiTotal, ffiNorm, casScore, fci, topSps, topFfi };
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export function fciLabel(fci) {
  return fci >= 70 ? 'Strong capacity' : fci >= 40 ? 'Steady capacity' : 'Building capacity';
}

export function flattenReport(entry) {
  const r = computeResults(entry);
  const q = entry.qualitative || {};
  const narrativeIntro =
    r.casScore < 50
      ? "A good portion of the pressure right now is coming from things outside direct control — that's exactly what makes finances feel heavier than the numbers alone suggest."
      : 'There\'s real agency here — many of the stressors on this list can be influenced or managed over time.';
  const narrativeDrivers = `The biggest structural pressures right now are ${r.topSps[0].name.toLowerCase()} and ${r.topSps[1].name.toLowerCase()}. The most friction shows up in ${r.topFfi[0].name.toLowerCase()}.`;

  return {
    fci: r.fci,
    fciRounded: Math.round(r.fci),
    fciBarPct: clamp(r.fci),
    label: fciLabel(r.fci),
    dateStr: formatDate(entry.date),
    spsTotal: r.spsTotal,
    spsNormFixed: r.spsNorm.toFixed(1),
    spsBarPct: clamp(r.spsNorm),
    ffiTotal: r.ffiTotal,
    ffiNormFixed: r.ffiNorm.toFixed(1),
    ffiBarPct: clamp(r.ffiNorm),
    casScoreRounded: Math.round(r.casScore),
    casBarPct: clamp(r.casScore),
    actionable: entry.cas.direct + entry.cas.indirect,
    systemic: entry.cas.outOfControl,
    topSps0Name: r.topSps[0].name,
    topSps0Val: r.topSps[0].val,
    topSps1Name: r.topSps[1].name,
    topSps1Val: r.topSps[1].val,
    topFfi0Name: r.topFfi[0].name,
    topFfi0Val: r.topFfi[0].val,
    topFfi1Name: r.topFfi[1].name,
    topFfi1Val: r.topFfi[1].val,
    narrativeIntro,
    narrativeDrivers,
    hasQual: !!(q.overwhelming || q.confident || q.change),
    hasQual0: !!q.overwhelming,
    qual0Label: QUAL_LABELS.overwhelming,
    qual0Value: q.overwhelming,
    hasQual1: !!q.confident,
    qual1Label: QUAL_LABELS.confident,
    qual1Value: q.confident,
    hasQual2: !!q.change,
    qual2Label: QUAL_LABELS.change,
    qual2Value: q.change,
    focusTitle: `Ease up on ${r.topFfi[0].name.toLowerCase()}`,
    focusDesc:
      'This is where the most manual effort is going right now. Automating or consolidating it would free up real bandwidth.',
    casScoreRaw: r.casScore,
    casDirect: entry.cas.direct,
    casOutOfControl: entry.cas.outOfControl,
  };
}

export function planItemsFor(report) {
  const items = [
    {
      id: 'friction',
      title: `Automate ${report.topFfi0Name}`,
      desc: 'Set up autopay, consolidate accounts, or delegate this task — one less thing on your plate this week.',
    },
    {
      id: 'pressure',
      title: `Take one step on ${report.topSps0Name}`,
      desc: 'Pick one action within your influence this month — a call, a policy review, or the start of a plan.',
    },
  ];
  if (report.casScoreRaw < 50) {
    items.push({
      id: 'agency',
      title: "Focus on what's yours to control",
      desc: `Put your energy toward the ${report.casDirect} item(s) you can act on directly. Set the ${report.casOutOfControl} systemic stressor(s) aside for now.`,
    });
  } else {
    items.push({
      id: 'momentum',
      title: 'Keep the momentum going',
      desc: "You're managing more of this than it might feel like. Revisit this assessment in a month to see the shift.",
    });
  }
  return items;
}

export function buildRatingList(categories, values) {
  return categories.map((name, idx) => ({
    idx,
    name,
    dots: [1, 2, 3, 4, 5].map((v) => ({ v, filled: v <= values[idx] })),
  }));
}
