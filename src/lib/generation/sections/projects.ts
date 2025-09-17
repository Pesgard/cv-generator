import { escapeLatex } from "../escapeLatex";

export interface CVProject {
  name: string;
  link?: string;
  description: string;
}

export function generateProjectsSection(projects: CVProject[]): string {
  if (!projects || projects.length === 0) return "";

  return projects.map((project) => {
    const name = escapeLatex(project.name || "");
    const link = project.link || "";
    const description = escapeLatex(project.description || "");

    let linkText = "";
    if (link) {
      try {
        new URL(link);
        linkText = `\\href{${link}}{Link}`;
      } catch {
        linkText = escapeLatex(link);
      }
    }

    return `\\begin{tabularx}{\\linewidth}{ @{}l r@{} }
  \\textbf{${name}} & \\hfill ${linkText} \\\\[3.75pt]
  \\multicolumn{2}{@{}X@{}}{${description}} \\\\
\\end{tabularx}`;
  }).join("\n\n");
}
