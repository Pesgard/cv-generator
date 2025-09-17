// Escape de caracteres especiales en LaTeX
export function escapeLatex(text: string): string {
    if (!text) return "";
    return String(text)
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\$/g, "\\$")
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/#/g, "\\#")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/_/g, "\\_")
      .replace(/~/g, "\\textasciitilde{}");
  }
  