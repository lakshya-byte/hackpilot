import type { RubricCriterion } from "./types";

// Mirrors hackpilot-agent/app/nodes/pitch_parse_input.py's DEFAULT_RUBRIC_CRITERIA —
// intentionally duplicated: that copy is a server-side safety net, this one seeds
// the editable UI before a rubric is uploaded or the defaults are otherwise touched.
export const DEFAULT_RUBRIC_CRITERIA: RubricCriterion[] = [
  { criterion: "Innovation", weight: 25, description: "Originality of the idea and approach." },
  { criterion: "Impact", weight: 20, description: "Real-world value and reach of the solution." },
  { criterion: "Feasibility", weight: 20, description: "How realistic the build is in the time given." },
  { criterion: "Execution", weight: 20, description: "Quality and polish of what was actually built." },
  { criterion: "Presentation", weight: 15, description: "Clarity and persuasiveness of the pitch itself." },
];
