import { writable } from 'svelte/store';
import type { CVData } from '../schemas';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  isValid: boolean;
}

export const steps: WizardStep[] = [
  { id: 'personal', title: 'Datos Personales', description: 'Información básica de contacto', completed: false, isValid: false },
  { id: 'summary', title: 'Resumen', description: 'Descripción profesional', completed: false, isValid: false },
  { id: 'experience', title: 'Experiencia', description: 'Historial laboral', completed: false, isValid: false },
  { id: 'projects', title: 'Proyectos', description: 'Proyectos destacados', completed: false, isValid: false },
  { id: 'education', title: 'Educación', description: 'Formación académica', completed: false, isValid: false },
  { id: 'skills', title: 'Habilidades', description: 'Competencias técnicas', completed: false, isValid: false },
  { id: 'preview', title: 'Vista Previa', description: 'Revisar y generar', completed: false, isValid: false }
];

export const currentStep = writable(0);
export const wizardSteps = writable(steps);

export const initialCVData: CVData = {
  personal: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  experience: [
    {
      title: '',
      company: '',
      period: '',
      description: '',
      bullets: ['']
    }
  ],
  projects: [
    {
      name: '',
      link: '',
      description: ''
    }
  ],
  education: [
    {
      period: '',
      degree: '',
      institution: '',
      gpa: ''
    }
  ],
  skills: [
    {
      category: '',
      items: ''
    }
  ]
};

export const cvData = writable<CVData>(initialCVData);

export function updateStepValidation(stepIndex: number, isValid: boolean) {
  wizardSteps.update(steps => {
    steps[stepIndex].isValid = isValid;
    steps[stepIndex].completed = isValid;
    return steps;
  });
}

export function goToStep(stepIndex: number) {
  currentStep.set(stepIndex);
}

export function nextStep() {
  currentStep.update(step => Math.min(step + 1, steps.length - 1));
}

export function prevStep() {
  currentStep.update(step => Math.max(step - 1, 0));
}