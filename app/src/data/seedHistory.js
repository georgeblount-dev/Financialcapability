export const seedHistory = [
  {
    id: 3,
    date: '2026-07-29',
    sps: [3, 3, 2, 3, 1, 3, 3, 2, 2, 2],
    ffi: [2, 3, 2, 3, 2, 2, 2, 3],
    cas: { direct: 2, indirect: 2, outOfControl: 1 },
    qualitative: {
      overwhelming:
        "Keeping track of my 401(k) contributions alongside our monthly bills — it feels like a lot to manage at once.",
      confident: "I'm on top of my day-to-day budgeting and know where my paycheck is going.",
      change: "I'd love to automate more of my savings so I'm not thinking about it every month.",
    },
  },
  {
    id: 2,
    date: '2026-06-22',
    sps: [3, 4, 3, 3, 2, 3, 3, 3, 2, 3],
    ffi: [3, 3, 3, 3, 2, 3, 3, 3],
    cas: { direct: 1, indirect: 2, outOfControl: 2 },
    qualitative: { overwhelming: '', confident: '', change: '' },
  },
  {
    id: 1,
    date: '2026-05-18',
    sps: [4, 4, 4, 3, 2, 4, 4, 3, 3, 3],
    ffi: [4, 4, 3, 4, 3, 4, 3, 3],
    cas: { direct: 1, indirect: 1, outOfControl: 3 },
    qualitative: { overwhelming: '', confident: '', change: '' },
  },
];
