import { colors, serif } from '../theme';
import { ScreenPad } from '../components/ui';

export default function Learn({ state }) {
  const { latestReport, resources } = state;

  return (
    <ScreenPad>
      <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: colors.ink, marginBottom: 4 }}>
        Resources for you
      </div>
      <div style={{ fontSize: 13, color: colors.muted, marginBottom: 20 }}>
        Guides and support, picked up from your last assessment.
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyDark})`,
          borderRadius: 18,
          padding: 18,
          color: '#fff',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: colors.paleBlue,
            marginBottom: 6,
          }}
        >
          Recommended for you
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{latestReport.focusTitle}</div>
        <div style={{ fontSize: 13, color: colors.paleBlueBg, lineHeight: 1.5 }}>{latestReport.focusDesc}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {resources.map((r) => (
          <div
            key={r.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: '#fff',
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: r.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
                color: r.fg,
                fontWeight: 700,
                fontFamily: serif,
              }}
            >
              {r.initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink, marginBottom: 2 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: colors.muted }}>{r.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </ScreenPad>
  );
}
