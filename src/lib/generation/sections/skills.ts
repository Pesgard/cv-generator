import { escapeLatex } from "../escapeLatex";

export interface CVSkill {
  category: string;
  items: string;
}

export function generateSkillsSection(skills: CVSkill[]): string {
  if (!skills || skills.length === 0) return "";

  return skills.map((skill) => {
    const category = escapeLatex(skill.category || "");
    const items = escapeLatex(skill.items || "");
    return `${category} & \\normalsize{${items}} \\\\`;
  }).join("\n");
}
