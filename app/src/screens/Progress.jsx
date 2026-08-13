import { colors, serif } from '../theme';
import { ScreenPad, SectionLabel } from '../components/ui';

export default function Progress({ state }) {
  const { progressCopy, chartList, historyList } = state;

  return (
    <ScreenPad>
      <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: colors.ink, marginBottom: 4 }}>
        Your progress
      </div>
      <div style={{ fontSize: 13, color: colors.muted, marginBottom: 22 }}>{progressCopy}</div>

      <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 18, padding: '18px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 120, padding: '0 4px' }}>
          {chartList.map((c, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: colors.ink }}>{c.fci}</div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 34,
                  borderRadius: '8px 8px 3px 3px',
                  background: c.barColor,
                  height: `${c.barHeightPx}px`,
                }}
              />
              <div style={{ fontSize: 10, color: colors.muted }}>{c.shortDate}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionLabel>Past assessments</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {historyList.map((h, i) => (
          <button
            key={i}
            onClick={h.onTap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#fff',
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: '12px 14px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: colors.navy,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {h.fci}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{h.label}</div>
              <div style={{ fontSize: 12, color: colors.muted }}>{h.dateStr}</div>
            </div>
            <div style={{ color: colors.chevron, fontSize: 16 }}>›</div>
          </button>
        ))}
      </div>
    </ScreenPad>
  );
}
