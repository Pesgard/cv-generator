import { z } from 'zod';

export const personalSchema = z.object({
  personal: z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    linkedin: z.string().min(1, 'LinkedIn es requerido'),
    github: z.string().min(1, 'GitHub es requerido')
  })
});

export const summarySchema = z.object({
  summary: z.string().min(10, 'El resumen debe tener al menos 10 caracteres')
});

export const experienceSchema = z.object({
  experience: z.array(
    z.object({
      title: z.string().min(1, 'El título es requerido'),
      company: z.string().min(1, 'La empresa es requerida'),
      period: z.string().min(1, 'El periodo es requerido'),
      description: z.string().optional(),
      bullets: z.array(z.string().min(1, 'El punto no puede estar vacío')).optional()
    }).refine(
      (data) => {
        // Al menos debe tener descripción o bullets
        return data.description || (data.bullets && data.bullets.length > 0);
      },
      {
        message: 'Debe proporcionar una descripción o al menos un punto clave',
        path: ['description']
      }
    )
  ).min(1, 'Debe tener al menos una experiencia')
});

export const projectsSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string().min(1, 'El nombre del proyecto es requerido'),
      link: z.string().url('URL inválida').optional().or(z.literal('')),
      description: z.string().min(1, 'La descripción es requerida')
    })
  ).min(1, 'Debe tener al menos un proyecto')
});

export const educationSchema = z.object({
  education: z.array(
    z.object({
      period: z.string().min(1, 'El periodo es requerido'),
      degree: z.string().min(1, 'El título es requerido'),
      institution: z.string().min(1, 'La institución es requerida'),
      gpa: z.string().optional()
    })
  ).min(1, 'Debe tener al menos una educación')
});

export const skillsSchema = z.object({
  skills: z.array(
    z.object({
      category: z.string().min(1, 'La categoría es requerida'),
      items: z.string().min(1, 'Los items son requeridos')
    })
  ).min(1, 'Debe tener al menos una habilidad')
});

export const cvSchema = personalSchema
  .merge(summarySchema)
  .merge(experienceSchema)
  .merge(projectsSchema)
  .merge(educationSchema)
  .merge(skillsSchema);

export type CVData = z.infer<typeof cvSchema>;
export type PersonalData = z.infer<typeof personalSchema>;
export type SummaryData = z.infer<typeof summarySchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type ProjectsData = z.infer<typeof projectsSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type SkillsData = z.infer<typeof skillsSchema>;