import { escapeLatex } from "../escapeLatex";

export function generateSummary(summary: string): string {
  return escapeLatex(summary || "");
}
