import { colors, serif } from '../theme';
import { BackButton, ScreenPad } from '../components/ui';

export default function Plan({ state }) {
  const { planItems, checkedCount, backFromPlan } = state;

  return (
    <ScreenPad>
      <BackButton onClick={backFromPlan} />

      <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: colors.ink, marginBottom: 4 }}>
        Your action plan
      </div>
      <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>Small, specific steps based on your report.</div>
      <div style={{ fontSize: 13, color: colors.green, fontWeight: 600, marginBottom: 20 }}>
        {checkedCount} of {planItems.length} done
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {planItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onToggle}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              textAlign: 'left',
              background: '#fff',
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 16,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                border: `2px solid ${item.checked ? colors.green : '#d9d3c4'}`,
                background: item.checked ? colors.green : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {item.checked ? '✓' : ''}
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: item.checked ? '#94a3ab' : colors.ink,
                  marginBottom: 3,
                  textDecoration: item.checked ? 'line-through' : 'none',
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: 13, color: colors.mutedText, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </ScreenPad>
  );
}
