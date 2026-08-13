import { colors } from '../theme';
import { Avatar, ScreenPad, SectionLabel } from '../components/ui';

function Row({ children, last }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: last ? 'none' : `1px solid ${colors.borderLight}`,
        fontSize: 15,
        color: colors.ink,
      }}
    >
      {children}
      <span style={{ color: colors.chevron }}>›</span>
    </div>
  );
}

export default function ProfileScreen({ state }) {
  return (
    <ScreenPad>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <Avatar initial="G" size={56} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.ink }}>Guest</div>
          <div style={{ fontSize: 13, color: colors.muted }}>Retirement plan benefit member</div>
        </div>
      </div>

      <SectionLabel style={{ margin: '0 4px 8px' }}>Account</SectionLabel>
      <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        <Row>Notifications</Row>
        <Row>Privacy &amp; security</Row>
        <Row last>Linked accounts</Row>
      </div>

      <SectionLabel style={{ margin: '0 4px 8px' }}>Support</SectionLabel>
      <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        <Row>Help center</Row>
        <Row last>Message your coach</Row>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        <button
          onClick={state.signOut}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '14px 16px',
            fontSize: 15,
            color: colors.red,
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>

      <div style={{ fontSize: 12, lineHeight: 1.6, color: colors.muted, padding: '0 4px' }}>
        This is a private tool. Your responses are visible only to you and are never shared without your permission.
      </div>
    </ScreenPad>
  );
}
