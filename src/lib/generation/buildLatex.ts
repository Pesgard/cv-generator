import fs from "fs";
import path from "path";
import { escapeLatex } from "./escapeLatex";
import { generateEducationSection } from "./sections/education";
import { generateExperienceSection } from "./sections/experience";
import { generateSkillsSection } from "./sections/skills";
import { generateSummary } from "./sections/summary";
import { generateProjectsSection } from "./sections/projects";

export function buildLatex(cvData: any): string {
  const templatePath = path.resolve("static", "cv-template.tex");
  const template = fs.readFileSync(templatePath, "utf-8");

  return template
    .replace(/{{name}}/g, escapeLatex(cvData.personal?.name || ""))
    .replace(/{{email}}/g, escapeLatex(cvData.personal?.email || ""))
    .replace(/{{phone}}/g, escapeLatex(cvData.personal?.phone || ""))
    .replace(/{{linkedin}}/g, escapeLatex(cvData.personal?.linkedin || ""))
    .replace(/{{github}}/g, escapeLatex(cvData.personal?.github || ""))
    .replace(/{{summary}}/g, generateSummary(cvData.summary))
    .replace(/{{experience_block}}/g, generateExperienceSection(cvData.experience))
    .replace(/{{projects_block}}/g, generateProjectsSection(cvData.projects))
    .replace(/{{education_block}}/g, generateEducationSection(cvData.education))
    .replace(/{{skills_block}}/g, generateSkillsSection(cvData.skills));
}
