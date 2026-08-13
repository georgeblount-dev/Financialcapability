import { colors, serif } from '../theme';

export function ScreenPad({ children, style }) {
  return (
    <div style={{ padding: '28px 20px 28px', animation: 'omFadeUp .4s ease both', ...style }}>
      {children}
    </div>
  );
}

export function Avatar({ initial, size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: colors.navy,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.375,
        fontWeight: 700,
        fontFamily: serif,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

export function SectionLabel({ children, style }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: colors.muted,
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function BackButton({ onClick, children = '← Back' }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: colors.navy,
        fontSize: 14,
        fontWeight: 600,
        padding: 0,
        marginBottom: 14,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function PageTitle({ children, style }) {
  return (
    <div
      style={{
        fontFamily: serif,
        fontSize: 24,
        fontWeight: 700,
        color: colors.ink,
        marginBottom: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
