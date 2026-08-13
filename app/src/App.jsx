import { useAppState } from './state/useAppState';
import TabBar from './components/TabBar';
import Home from './screens/Home';
import Progress from './screens/Progress';
import Learn from './screens/Learn';
import Profile from './screens/Profile';
import Wizard from './screens/Wizard';
import Results from './screens/Results';
import Plan from './screens/Plan';
import { colors } from './theme';

function activeScreen(state) {
  if (state.isWizard) return <Wizard state={state} />;
  if (state.isResults) return <Results state={state} />;
  if (state.isPlan) return <Plan state={state} />;
  if (state.isProgress) return <Progress state={state} />;
  if (state.isLearn) return <Learn state={state} />;
  if (state.isProfile) return <Profile state={state} />;
  return <Home state={state} />;
}

export default function App() {
  const state = useAppState();
  const onNavigate = {
    home: state.goHome,
    progress: state.goProgress,
    learn: state.goLearn,
    profile: state.goProfile,
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 480,
        minHeight: '100vh',
        background: colors.appBg,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 60px rgba(0,60,92,0.08)',
      }}
    >
      <div className="scroll-area" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {activeScreen(state)}
      </div>
      {state.showTabBar && <TabBar activeTab={state.tab} onNavigate={(key) => onNavigate[key]()} />}
    </div>
  );
}
