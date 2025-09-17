import { escapeLatex } from "../escapeLatex";

export interface CVEducation {
  period: string;
  degree: string;
  institution: string;
  gpa?: string;
}

export function generateEducationSection(education: CVEducation[]): string {
  if (!education || education.length === 0) return "";

  return education.map((edu) => {
    const period = escapeLatex(edu.period || "");
    const degree = escapeLatex(edu.degree || "");
    const institution = escapeLatex(edu.institution || "");
    const gpa = escapeLatex(edu.gpa || "");
    const gpaText = gpa ? ` \\hfill (GPA: ${gpa})` : "";

    return `${period} & ${degree}${institution ? ` at \\textbf{${institution}}` : ""}${gpaText} \\\\`;
  }).join("\n");
}
