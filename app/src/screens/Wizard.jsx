import { colors, serif } from '../theme';

function StepIntro() {
  const parts = [
    { color: colors.red, title: 'Structural pressure', desc: "External realities you're facing" },
    { color: colors.green, title: 'Sphere of control', desc: "What's actionable versus systemic" },
    { color: colors.amber, title: 'Financial friction', desc: 'How manual your systems feel' },
  ];
  return (
    <div style={{ animation: 'omFadeUp .35s ease both' }}>
      <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: colors.ink, marginBottom: 8 }}>
        Let's check in
      </div>
      <div style={{ fontSize: 14, color: colors.mutedText, lineHeight: 1.6, marginBottom: 20 }}>
        Four short parts — the pressures you're facing, what's in your control, the friction in your systems, and a
        couple of open questions. Takes about five minutes.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {parts.map((p) => (
          <div
            key={p.title}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              background: '#fff',
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: '12px 14px',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color, marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{p.title}</div>
              <div style={{ fontSize: 12, color: colors.muted }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: colors.muted, background: '#eef3f6', padding: '12px 14px', borderRadius: 12, lineHeight: 1.5 }}>
        This stays private — visible only to you, never shared.
      </div>
    </div>
  );
}

function RatingStep({ title, desc, list, group, setDraftValue }) {
  return (
    <div style={{ animation: 'omFadeUp .35s ease both' }}>
      <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: colors.ink, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: colors.mutedText, marginBottom: 18 }}>{desc}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {list.map((cat) => (
          <div key={cat.name}>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>{cat.name}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {cat.dots.map((d) => (
                <button
                  key={d.v}
                  onClick={() => setDraftValue(group, cat.idx, d.v)}
                  style={{
                    flex: 1,
                    height: 38,
                    borderRadius: 10,
                    border: `1px solid ${d.filled ? colors.navy : colors.dotEmpty}`,
                    background: d.filled ? colors.navy : '#fff',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CasStep({ draft, bumpCas }) {
  const groups = [
    {
      key: 'direct',
      inc: () => bumpCas('direct', 1),
      dec: () => bumpCas('direct', -1),
      title: 'Direct control',
      desc: 'Actionable immediately — e.g. cancel a subscription',
      bg: colors.greenBg,
      border: colors.greenBorder,
      titleColor: colors.greenDark,
      descColor: colors.green,
      btnColor: colors.green,
      value: draft.cas.direct,
    },
    {
      key: 'indirect',
      inc: () => bumpCas('indirect', 1),
      dec: () => bumpCas('indirect', -1),
      title: 'Indirect control',
      desc: 'Influenceable over time — e.g. credit score, career path',
      bg: colors.amberBg,
      border: colors.amberBorder,
      titleColor: colors.amberDarker,
      descColor: colors.amberDark,
      btnColor: colors.amberDark,
      value: draft.cas.indirect,
    },
    {
      key: 'outOfControl',
      inc: () => bumpCas('outOfControl', 1),
      dec: () => bumpCas('outOfControl', -1),
      title: 'Out of your control',
      desc: 'Systemic or external — e.g. inflation, interest rates',
      bg: '#fdecee',
      border: colors.redBorder,
      titleColor: colors.redDark,
      descColor: colors.redMid,
      btnColor: colors.redMid,
      value: draft.cas.outOfControl,
    },
  ];

  return (
    <div style={{ animation: 'omFadeUp .35s ease both' }}>
      <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: colors.ink, marginBottom: 4 }}>
        Sphere of control
      </div>
      <div style={{ fontSize: 13, color: colors.mutedText, marginBottom: 18 }}>
        Think of your top financial stressors right now. How many fall into each group?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {groups.map((g) => (
          <div key={g.key} style={{ background: g.bg, border: `1px solid ${g.border}`, borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: g.titleColor, marginBottom: 2 }}>{g.title}</div>
            <div style={{ fontSize: 12, color: g.descColor, marginBottom: 14 }}>{g.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={g.dec}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: '#fff',
                  border: `1px solid ${g.border}`,
                  fontSize: 18,
                  color: g.btnColor,
                  cursor: 'pointer',
                }}
              >
                −
              </button>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 700, color: g.titleColor }}>{g.value}</div>
              <button
                onClick={g.inc}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: g.btnColor,
                  border: 'none',
                  fontSize: 18,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QualStep({ qualList, updateQual }) {
  return (
    <div style={{ animation: 'omFadeUp .35s ease both' }}>
      <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: colors.ink, marginBottom: 4 }}>
        In your own words
      </div>
      <div style={{ fontSize: 13, color: colors.mutedText, marginBottom: 18 }}>
        Optional, but it helps your coach understand the full picture.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {qualList.map((q) => (
          <div key={q.id} style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.ink, marginBottom: 10 }}>{q.label}</div>
            <textarea
              value={q.value}
              onChange={(e) => updateQual(q.id, e.target.value)}
              placeholder="Type here..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: 10,
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'none',
                height: 80,
                outline: 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Wizard({ state }) {
  const {
    wizardClose,
    wizardProgressPct,
    isStep0,
    isStep1,
    isStep2,
    isStep3,
    isStep4,
    showWizardBack,
    wizardBack,
    wizardNext,
    wizardNextLabel,
    spsList,
    ffiList,
    draft,
    setDraftValue,
    bumpCas,
    qualList,
    updateQual,
  } = state;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '28px 20px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={wizardClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: '#f3efe8',
            border: 'none',
            color: colors.mutedText,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        <div style={{ flex: 1, height: 6, background: colors.border, borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: colors.orange,
              borderRadius: 3,
              width: `${wizardProgressPct}%`,
              transition: 'width .3s ease',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, padding: '8px 20px 24px' }}>
        {isStep0 && <StepIntro />}
        {isStep1 && (
          <RatingStep
            title="Structural pressure"
            desc="Rate how much pressure each brings right now — 1 is none, 5 is severe."
            list={spsList}
            group="sps"
            setDraftValue={setDraftValue}
          />
        )}
        {isStep2 && <CasStep draft={draft} bumpCas={bumpCas} />}
        {isStep3 && (
          <RatingStep
            title="Financial friction"
            desc="Rate the effort each takes — 1 is automated and easy, 5 is manual and hard."
            list={ffiList}
            group="ffi"
            setDraftValue={setDraftValue}
          />
        )}
        {isStep4 && <QualStep qualList={qualList} updateQual={updateQual} />}
      </div>

      <div style={{ display: 'flex', gap: 10, padding: '14px 20px 26px', borderTop: `1px solid ${colors.border}` }}>
        {showWizardBack && (
          <button
            onClick={wizardBack}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: '#fff',
              color: colors.mutedText,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        )}
        <button
          onClick={wizardNext}
          style={{
            flex: 2,
            padding: 14,
            borderRadius: 12,
            border: 'none',
            background: colors.orange,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {wizardNextLabel}
        </button>
      </div>
    </div>
  );
}
