import { colors, serif } from '../theme';
import { BackButton, ScreenPad } from '../components/ui';

function MetricCard({ title, badge, badgeBg, badgeColor, note, barPct, barColor, rows }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 18, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.ink }}>{title}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: badgeColor, background: badgeBg, padding: '2px 8px', borderRadius: 8 }}>
          {badge}
        </div>
      </div>
      <div style={{ fontSize: 12, color: colors.muted, marginBottom: 10 }}>{note}</div>
      <div style={{ height: 8, background: '#f3efe8', borderRadius: 4, marginBottom: 12 }}>
        <div style={{ height: '100%', background: barColor, borderRadius: 4, width: `${barPct}%` }} />
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            color: colors.mutedText,
            marginBottom: i < rows.length - 1 ? 4 : 0,
          }}
        >
          <span>{r.label}</span>
          <span style={{ fontWeight: 700, color: colors.ink }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Results({ state }) {
  const { report, backFromResults, goPlan } = state;

  const quals = [
    report.hasQual0 && { label: report.qual0Label, value: report.qual0Value },
    report.hasQual1 && { label: report.qual1Label, value: report.qual1Value },
    report.hasQual2 && { label: report.qual2Label, value: report.qual2Value },
  ].filter(Boolean);

  return (
    <ScreenPad>
      <BackButton onClick={backFromResults} />

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: colors.ink }}>Your capacity report</div>
        <div style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{report.dateStr}</div>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyDark})`,
          borderRadius: 22,
          padding: '24px 20px',
          color: '#fff',
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colors.paleBlue,
            marginBottom: 14,
          }}
        >
          Financial Capacity Index
        </div>
        <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
          {report.fciRounded}
          <span style={{ fontSize: 18, color: colors.paleBlue }}>/100</span>
        </div>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.16)',
            padding: '5px 14px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            marginTop: 10,
          }}
        >
          {report.label}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <MetricCard
          title="Structural pressure"
          badge={`${report.spsTotal}/50`}
          badgeBg={colors.redBg}
          badgeColor={colors.red}
          note={`Normalized ${report.spsNormFixed}/100`}
          barPct={report.spsBarPct}
          barColor={colors.red}
          rows={[
            { label: report.topSps0Name, value: `${report.topSps0Val}/5` },
            { label: report.topSps1Name, value: `${report.topSps1Val}/5` },
          ]}
        />
        <MetricCard
          title="Financial friction"
          badge={`${report.ffiTotal}/40`}
          badgeBg={colors.amberBg}
          badgeColor={colors.amberDark}
          note={`Normalized ${report.ffiNormFixed}/100`}
          barPct={report.ffiBarPct}
          barColor={colors.amber}
          rows={[
            { label: report.topFfi0Name, value: `${report.topFfi0Val}/5` },
            { label: report.topFfi1Name, value: `${report.topFfi1Val}/5` },
          ]}
        />
        <MetricCard
          title="Control alignment"
          badge={`${report.casScoreRounded}%`}
          badgeBg={colors.greenBg}
          badgeColor={colors.green}
          note="Stressors in direct/indirect control"
          barPct={report.casBarPct}
          barColor={colors.green}
          rows={[
            { label: 'Actionable', value: report.actionable },
            { label: 'Systemic / external', value: report.systemic },
          ]}
        />
      </div>

      {report.hasQual && (
        <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 18, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>In their own words</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quals.map((q) => (
              <div key={q.label}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: colors.muted, marginBottom: 3 }}>
                  {q.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: '#3a4650',
                    fontStyle: 'italic',
                    borderLeft: `2px solid ${colors.border}`,
                    paddingLeft: 10,
                  }}
                >
                  {q.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#f7f4ee', border: `1px solid ${colors.border}`, borderRadius: 18, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.ink, marginBottom: 10 }}>What this means</div>
        <div style={{ fontSize: 14, color: '#3a4650', lineHeight: 1.6, marginBottom: 10 }}>{report.narrativeIntro}</div>
        <div style={{ fontSize: 14, color: '#3a4650', lineHeight: 1.6 }}>{report.narrativeDrivers}</div>
      </div>

      <button
        onClick={goPlan}
        style={{
          width: '100%',
          background: colors.navy,
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        View your action plan
      </button>
    </ScreenPad>
  );
}
