import { colors, serif } from '../theme';
import { Avatar, ScreenPad } from '../components/ui';

export default function Home({ state }) {
  const { latestReport, viewLatestReport, goPlan, startAssessment } = state;

  const stats = [
    { label: 'Pressure', value: latestReport.spsNormFixed, dot: colors.red },
    { label: 'Friction', value: latestReport.ffiNormFixed, dot: colors.amber },
    { label: 'Agency', value: `${latestReport.casScoreRounded}%`, dot: colors.green },
  ];

  return (
    <ScreenPad>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: colors.ink }}>Hi, Guest</div>
          <div style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>Your financial wellness benefit</div>
        </div>
        <Avatar initial="G" />
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyDark})`,
          borderRadius: 24,
          padding: '26px 22px',
          color: '#fff',
          boxShadow: '0 12px 28px rgba(0,60,92,0.22)',
          marginBottom: 18,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 52,
              background: `conic-gradient(${colors.orange} ${latestReport.fciBarPct}%, rgba(255,255,255,0.16) 0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 82,
                height: 82,
                borderRadius: 41,
                background: colors.navyDarker,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{latestReport.fciRounded}</div>
              <div style={{ fontSize: 10, color: colors.paleBlue }}>/ 100</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.16)',
                padding: '5px 12px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {latestReport.label}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: colors.paleBlueBg }}>
              Last assessed {latestReport.dateStr}
            </div>
          </div>
        </div>
        <button
          onClick={viewLatestReport}
          style={{
            marginTop: 18,
            width: '100%',
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            padding: 12,
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          View full report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={viewLatestReport}
            style={{
              textAlign: 'left',
              background: '#fff',
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: '12px 10px',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: s.dot, marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: colors.muted, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.ink }}>{s.value}</div>
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 18, padding: 18, marginBottom: 18 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: colors.orange,
            marginBottom: 8,
          }}
        >
          This week's focus
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.ink, marginBottom: 4 }}>{latestReport.focusTitle}</div>
        <div style={{ fontSize: 13, color: colors.mutedText, lineHeight: 1.5, marginBottom: 12 }}>{latestReport.focusDesc}</div>
        <button
          onClick={goPlan}
          style={{ background: 'none', border: 'none', color: colors.navy, fontSize: 13, fontWeight: 700, padding: 0, cursor: 'pointer' }}
        >
          View action plan →
        </button>
      </div>

      <button
        onClick={startAssessment}
        style={{
          width: '100%',
          background: colors.orange,
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 18px rgba(213,106,42,0.28)',
        }}
      >
        Retake the assessment
      </button>
    </ScreenPad>
  );
}
