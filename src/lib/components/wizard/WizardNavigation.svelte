<script lang="ts">
    import type { Snippet } from 'svelte';
    import { currentStep, wizardSteps, nextStep, prevStep, goToStep } from '$lib/stores/wizard';
    import { Check, ChevronRight } from '@lucide/svelte';
    import Button from '../ui/Button.svelte';
    import { autoAnimate } from '@formkit/auto-animate';
  
    interface Props {
      onNext?: () => void;
      onPrev?: () => void;
      canNext?: boolean;
      canPrev?: boolean;
      isLastStep?: boolean;
      finalAction?: Snippet;
    }
  
    let {
      onNext,
      onPrev,
      canNext = true,
      canPrev = true,
      isLastStep = false,
      finalAction
    }: Props = $props();
  
    function handleNext() {
      if (onNext) {
        onNext();
      } else {
        nextStep();
      }
    }
  
    function handlePrev() {
      if (onPrev) {
        onPrev();
      } else {
        prevStep();
      }
    }
  
    function handleStepClick(stepIndex: number) {
      // Solo permite navegar a pasos completados o el siguiente paso
      if ($wizardSteps[stepIndex].completed || stepIndex <= $currentStep + 1) {
        goToStep(stepIndex);
      }
    }
  </script>
  
  <div class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="max-w-4xl mx-auto">
      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            Paso {$currentStep + 1} de {$wizardSteps.length}
          </span>
          <span class="text-sm text-gray-500">
            {Math.round((($currentStep + 1) / $wizardSteps.length) * 100)}% completado
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style="width: {(($currentStep + 1) / $wizardSteps.length) * 100}%"
          ></div>
        </div>
      </div>
  
      <!-- Steps Navigation -->
      <nav class="flex flex-wrap gap-2" use:autoAnimate>
        {#each $wizardSteps as step, index}
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                   {index === $currentStep 
                     ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                     : step.completed 
                       ? 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200' 
                       : index < $currentStep 
                         ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200' 
                         : 'bg-gray-50 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                   }"
            onclick={() => handleStepClick(index)}
            disabled={!step.completed && index > $currentStep + 1}
          >
            {#if step.completed}
              <Check class="w-4 h-4" />
            {:else}
              <span class="w-4 h-4 text-xs bg-current rounded-full flex items-center justify-center text-white">
                {index + 1}
              </span>
            {/if}
            <span class="hidden sm:inline">{step.title}</span>
          </button>
        {/each}
      </nav>
  
      <!-- Current Step Info -->
      <div class="mt-4 text-center">
        <h2 class="text-xl font-bold text-gray-900">
          {$wizardSteps[$currentStep]?.title}
        </h2>
        <p class="text-gray-600 mt-1">
          {$wizardSteps[$currentStep]?.description}
        </p>
      </div>
    </div>
  </div>
  
  <!-- Navigation Buttons -->
  <div class="bg-white border-t border-gray-200 px-6 py-4">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <Button
        variant="ghost"
        onclick={handlePrev}
        disabled={!canPrev || $currentStep === 0}
      >
        <ChevronRight class="w-4 h-4 rotate-180" />
        Anterior
      </Button>
  
      <div class="flex gap-3">
        {#if isLastStep}
          <Button variant="primary" disabled={!canNext}>
            {#if finalAction}
              {@render finalAction()}
            {:else}
              Generar CV
            {/if}
          </Button>
        {:else}
          <Button
            variant="primary"
            onclick={handleNext}
            disabled={!canNext}
          >
            Siguiente
            <ChevronRight class="w-4 h-4" />
          </Button>
        {/if}
      </div>
    </div>
  </div>