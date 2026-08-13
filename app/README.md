# Financial Capability App

React + Vite implementation of the `Financial Capability App.dc.html` design (see `../chats/chat1.md` and `../README.md` for the design brief). Mobile-first web app for nBalance's financial capability assessment: home dashboard, a 5-step assessment wizard, a capacity report, an action plan, progress history, learn resources, and profile.

State is in-memory only (matches the prototype) — assessment history resets on page reload, no backend or auth.

## Run

```
npm install
npm run dev
```

## Build

```
npm run build
```

## Structure

- `src/lib/scoring.js` — FCI/SPS/FFI/CAS scoring logic, ported from the design's scoring script
- `src/state/useAppState.js` — app state (tab/screen navigation, wizard draft, assessment history)
- `src/screens/` — Home, Progress, Learn, Profile, Wizard, Results, Plan
- `src/theme.js` — shared color/type tokens
