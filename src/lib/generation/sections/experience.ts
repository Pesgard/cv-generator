import { escapeLatex } from "../escapeLatex";

export interface CVExperience {
  title: string;
  company: string;
  period: string;
  description?: string;
  bullets?: string[];
}

export function generateExperienceSection(experiences: CVExperience[]): string {
  if (!experiences || experiences.length === 0) return "";

  return experiences.map((exp) => {
    const title = escapeLatex(exp.title || "");
    const company = escapeLatex(exp.company || "");
    const period = escapeLatex(exp.period || "");
    const description = escapeLatex(exp.description || "");

    if (exp.bullets && exp.bullets.length > 0) {
      const bullets = exp.bullets
        .map((bullet) => `\\item ${escapeLatex(bullet)}`)
        .join("\n");

      return `\\begin{joblong}{${title}${company ? ` at ${company}` : ""}}{${period}}
${bullets}
\\end{joblong}`;
    } else {
      return `\\begin{jobshort}{${title}${company ? ` at ${company}` : ""}}{${period}}
${description}
\\end{jobshort}`;
    }
  }).join("\n\n");
}
