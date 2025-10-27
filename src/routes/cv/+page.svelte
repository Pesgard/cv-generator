<script lang="ts">
  import { currentStep, nextStep, prevStep, goToStep } from '$lib/stores/wizard';
  import WizardNavigation from '$lib/components/wizard/WizardNavigation.svelte';
  import PersonalStep from '$lib/components/wizard/PersonalStep.svelte';
  import SummaryStep from '$lib/components/wizard/SummaryStep.svelte';
  import ExperienceStep from '$lib/components/wizard/ExperienceStep.svelte';
  import ProjectsStep from '$lib/components/wizard/ProjectsStep.svelte';
  import EducationStep from '$lib/components/wizard/EducationStep.svelte';
  import SkillsStep from '$lib/components/wizard/SkillsStep.svelte';
  import PreviewStep from '$lib/components/wizard/PreviewStep.svelte';
  
  // Estado local para validación de cada paso
  let stepValidities = $state([false, false, false, false, false, false, false]);
  
  function handleStepValidation(stepIndex: number, isValid: boolean) {
    stepValidities[stepIndex] = isValid;
  }
  
  function handleGoToStep(stepIndex: number) {
    goToStep(stepIndex);
  }
  
  // Determinar si podemos avanzar al siguiente paso
  let canProceed = $derived(stepValidities[$currentStep]);
  let isLastStep = $derived($currentStep === 6);
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Navegación del wizard -->
  <WizardNavigation 
    onNext={nextStep}
    onPrev={prevStep}
    canNext={canProceed}
    canPrev={$currentStep > 0}
    isLastStep={isLastStep}
  />
  
  <!-- Contenido del paso actual -->
  <main class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {#if $currentStep === 0}
        <PersonalStep onValidChange={(valid) => handleStepValidation(0, valid)} />
      {:else if $currentStep === 1}
        <SummaryStep onValidChange={(valid) => handleStepValidation(1, valid)} />
      {:else if $currentStep === 2}
        <ExperienceStep onValidChange={(valid) => handleStepValidation(2, valid)} />
      {:else if $currentStep === 3}
        <ProjectsStep onValidChange={(valid) => handleStepValidation(3, valid)} />
      {:else if $currentStep === 4}
        <EducationStep onValidChange={(valid) => handleStepValidation(4, valid)} />
      {:else if $currentStep === 5}
        <SkillsStep onValidChange={(valid) => handleStepValidation(5, valid)} />
      {:else if $currentStep === 6}
        <PreviewStep 
          onValidChange={(valid) => handleStepValidation(6, valid)}
          onGoToStep={handleGoToStep}
        />
      {/if}
    </div>
  </main>
</div>