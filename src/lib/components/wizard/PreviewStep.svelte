<script lang="ts">
    import { cvData, updateStepValidation } from '$lib/stores/wizard';
    import Button from '../ui/Button.svelte';
    import { Eye, Download, Edit, User, FileText, Briefcase, FolderOpen, GraduationCap, Zap, CheckCircle, AlertCircle } from '@lucide/svelte';
    import { autoAnimate } from '@formkit/auto-animate';
  
    interface Props {
      onValidChange?: (isValid: boolean) => void;
      onGoToStep?: (stepIndex: number) => void;
    }
  
    let { onValidChange, onGoToStep }: Props = $props();
    let isGenerating = $state(false);
    let generationError = $state('');
  
    // La vista previa siempre es válida si llegamos hasta aquí
    $effect(() => {
      updateStepValidation(6, true);
      onValidChange?.(true);
    });
  
    async function generatePDF() {
      isGenerating = true;
      generationError = '';
  
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify($cvData)
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error generando el CV');
        }
  
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Abrir en nueva ventana
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          // Si el popup fue bloqueado, crear un enlace de descarga
          const link = document.createElement('a');
          link.href = url;
          link.download = `CV_${$cvData.personal?.name?.replace(/\s+/g, '_') || 'curriculum'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        URL.revokeObjectURL(url);
      } catch (error) {
        generationError = error instanceof Error ? error.message : 'Error desconocido';
      } finally {
        isGenerating = false;
      }
    }
  
    // Función para verificar si una sección está completa
    function isSectionComplete(section: string): boolean {
      switch (section) {
        case 'personal':
          return !!(
            $cvData.personal?.name && 
            $cvData.personal?.email && 
            $cvData.personal?.phone && 
            $cvData.personal?.linkedin && 
            $cvData.personal?.github
          );
        case 'summary':
          return !!$cvData.summary && $cvData.summary.length >= 10;
        case 'experience':
          return $cvData.experience?.length > 0 && 
                 $cvData.experience.every(exp => exp.title && exp.company && exp.period);
        case 'projects':
          return $cvData.projects?.length > 0 && 
                 $cvData.projects.every(proj => proj.name && proj.description);
        case 'education':
          return $cvData.education?.length > 0 && 
                 $cvData.education.every(edu => edu.period && edu.degree && edu.institution);
        case 'skills':
          return $cvData.skills?.length > 0 && 
                 $cvData.skills.every(skill => skill.category && skill.items);
        default:
          return false;
      }
    }
  
    function goToSection(sectionName: string) {
      // Mapear sección a índice de paso
      const sectionMap = {
        personal: 0,
        summary: 1,
        experience: 2,
        projects: 3,
        education: 4,
        skills: 5
      };
      
      const stepIndex = sectionMap[sectionName as keyof typeof sectionMap];
      if (stepIndex !== undefined && onGoToStep) {
        onGoToStep(stepIndex);
      }
    }
  </script>
  
  <div class="max-w-4xl mx-auto space-y-8 p-6" use:autoAnimate>
    <div class="text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Eye class="w-8 h-8 text-green-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Vista Previa del CV
      </h3>
      <p class="text-gray-600">
        Revisa toda la información antes de generar tu CV profesional
      </p>
    </div>
  
    <!-- Estado de completitud -->
    <div class="bg-white rounded-lg border p-6">
      <h4 class="font-semibold text-gray-900 mb-4">Estado de las secciones</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        {#each [
          { key: 'personal', label: 'Datos Personales', icon: User },
          { key: 'summary', label: 'Resumen', icon: FileText },
          { key: 'experience', label: 'Experiencia', icon: Briefcase },
          { key: 'projects', label: 'Proyectos', icon: FolderOpen },
          { key: 'education', label: 'Educación', icon: GraduationCap },
          { key: 'skills', label: 'Habilidades', icon: Zap }
        ] as section}
          {@const isComplete = isSectionComplete(section.key)}
          <button
            class="flex items-center gap-2 p-3 rounded-lg border transition-colors text-sm
                   {isComplete 
                     ? 'bg-green-50 border-green-200 text-green-800' 
                     : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'}"
            onclick={() => goToSection(section.key)}
          >
            {#if isComplete}
              <CheckCircle class="w-4 h-4" />
            {:else}
              <AlertCircle class="w-4 h-4" />
            {/if}
            <section.icon class="w-4 h-4" />
            <span class="font-medium">{section.label}</span>
          </button>
        {/each}
      </div>
    </div>
  
    <!-- Resumen de datos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Información Personal -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center gap-2 mb-4">
          <User class="w-5 h-5 text-blue-600" />
          <h4 class="font-semibold text-gray-900">Información Personal</h4>
          <button 
            class="ml-auto text-blue-600 hover:text-blue-800"
            onclick={() => goToSection('personal')}
          >
            <Edit class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-2 text-sm">
          <p><strong>Nombre:</strong> {$cvData.personal?.name || 'No especificado'}</p>
          <p><strong>Email:</strong> {$cvData.personal?.email || 'No especificado'}</p>
          <p><strong>Teléfono:</strong> {$cvData.personal?.phone || 'No especificado'}</p>
          <p><strong>LinkedIn:</strong> {$cvData.personal?.linkedin || 'No especificado'}</p>
          <p><strong>GitHub:</strong> {$cvData.personal?.github || 'No especificado'}</p>
        </div>
      </div>
  
      <!-- Resumen -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center gap-2 mb-4">
          <FileText class="w-5 h-5 text-green-600" />
          <h4 class="font-semibold text-gray-900">Resumen Profesional</h4>
          <button 
            class="ml-auto text-blue-600 hover:text-blue-800"
            onclick={() => goToSection('summary')}
          >
            <Edit class="w-4 h-4" />
          </button>
        </div>
        <p class="text-sm text-gray-700 line-clamp-4">
          {$cvData.summary || 'No especificado'}
        </p>
        {#if $cvData.summary}
          <div class="mt-2 text-xs text-gray-500">
            {$cvData.summary.length} caracteres, {$cvData.summary.split(' ').length} palabras
          </div>
        {/if}
      </div>
  
      <!-- Experiencia -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center gap-2 mb-4">
          <Briefcase class="w-5 h-5 text-purple-600" />
          <h4 class="font-semibold text-gray-900">Experiencia ({$cvData.experience?.length || 0})</h4>
          <button 
            class="ml-auto text-blue-600 hover:text-blue-800"
            onclick={() => goToSection('experience')}
          >
            <Edit class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-3">
          {#each $cvData.experience?.slice(0, 2) || [] as exp}
            <div class="border-l-2 border-gray-200 pl-3">
              <p class="font-medium text-sm">{exp.title || 'Título no especificado'}</p>
              <p class="text-xs text-gray-600">{exp.company || 'Empresa'} • {exp.period || 'Periodo'}</p>
            </div>
          {/each}
          {#if ($cvData.experience?.length || 0) > 2}
            <p class="text-xs text-gray-500">Y {($cvData.experience?.length || 0) - 2} más...</p>
          {/if}
        </div>
      </div>
  
      <!-- Proyectos -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen class="w-5 h-5 text-indigo-600" />
          <h4 class="font-semibold text-gray-900">Proyectos ({$cvData.projects?.length || 0})</h4>
          <button 
            class="ml-auto text-blue-600 hover:text-blue-800"
            onclick={() => goToSection('projects')}
          >
            <Edit class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-3">
          {#each $cvData.projects?.slice(0, 2) || [] as project}
            <div class="border-l-2 border-gray-200 pl-3">
              <p class="font-medium text-sm">{project.name || 'Proyecto sin nombre'}</p>
              <p class="text-xs text-gray-600 line-clamp-2">
                {project.description?.substring(0, 60) || 'Sin descripción'}...
              </p>
            </div>
          {/each}
          {#if ($cvData.projects?.length || 0) > 2}
            <p class="text-xs text-gray-500">Y {($cvData.projects?.length || 0) - 2} más...</p>
          {/if}
        </div>
      </div>
  
      <!-- Educación -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center gap-2 mb-4">
          <GraduationCap class="w-5 h-5 text-emerald-600" />
          <h4 class="font-semibold text-gray-900">Educación ({$cvData.education?.length || 0})</h4>
          <button 
            class="ml-auto text-blue-600 hover:text-blue-800"
            onclick={() => goToSection('education')}
          >
            <Edit class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-3">
          {#each $cvData.education || [] as edu}
            <div class="border-l-2 border-gray-200 pl-3">
              <p class="font-medium text-sm">{edu.degree || 'Título no especificado'}</p>
              <p class="text-xs text-gray-600">{edu.institution || 'Institución'} • {edu.period || 'Periodo'}</p>
            </div>
          {/each}
        </div>
      </div>
  
      <!-- Habilidades -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center gap-2 mb-4">
          <Zap class="w-5 h-5 text-yellow-600" />
          <h4 class="font-semibold text-gray-900">Habilidades ({$cvData.skills?.length || 0})</h4>
          <button 
            class="ml-auto text-blue-600 hover:text-blue-800"
            onclick={() => goToSection('skills')}
          >
            <Edit class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-2">
          {#each $cvData.skills || [] as skill}
            <div class="text-sm">
              <span class="font-medium text-gray-900">{skill.category}:</span>
              <span class="text-gray-700">{skill.items?.substring(0, 50) || ''}...</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  
    <!-- Error de generación -->
    {#if generationError}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <AlertCircle class="w-5 h-5 text-red-600" />
          <div>
            <h4 class="font-medium text-red-900">Error al generar el CV</h4>
            <p class="text-sm text-red-700">{generationError}</p>
          </div>
        </div>
      </div>
    {/if}
  
    <!-- Botones de acción -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        variant="primary"
        size="lg"
        loading={isGenerating}
        onclick={generatePDF}
        disabled={!isSectionComplete('personal') || !isSectionComplete('summary')}
      >
        <Download class="w-5 h-5" />
        {isGenerating ? 'Generando CV...' : 'Descargar CV en PDF'}
      </Button>
    </div>
  
    <!-- Información adicional -->
    <div class="bg-blue-50 rounded-lg p-6 border border-blue-200 text-center">
      <h4 class="font-semibold text-blue-900 mb-2">🎉 ¡Tu CV está listo!</h4>
      <p class="text-sm text-blue-800">
        El CV se generará en formato PDF profesional. Puedes regresar a cualquier sección para hacer ajustes.
      </p>
    </div>
  </div>