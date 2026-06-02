export const STAGES = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export const STAGE_ORDER = STAGES.map((s) => s.key);

export const stageLabel = (key) =>
  STAGES.find((s) => s.key === key)?.label ?? key;
