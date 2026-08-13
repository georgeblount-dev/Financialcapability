import { colors } from '../theme';

function Icon({ path, closed }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {closed ? (
        <>
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4.5 20c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : (
        <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

const TABS = [
  { key: 'home', label: 'Home', path: 'M4 11L12 4l8 7M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9' },
  { key: 'progress', label: 'Progress', path: 'M5 20V12M12 20V6M19 20v-9' },
  { key: 'learn', label: 'Learn', path: 'M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5v0A2.5 2.5 0 016.5 18H20' },
  { key: 'profile', label: 'Profile', profile: true },
];

export default function TabBar({ activeTab, onNavigate }) {
  return (
    <div
      style={{
        display: 'flex',
        borderTop: `1px solid ${colors.border}`,
        background: '#fff',
        padding: '10px 8px 24px',
      }}
    >
      {TABS.map((t) => {
        const active = activeTab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onNavigate(t.key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? colors.navy : colors.inactive,
            }}
          >
            <Icon path={t.path} closed={t.profile} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
