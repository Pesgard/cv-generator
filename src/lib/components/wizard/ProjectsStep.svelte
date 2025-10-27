<script lang="ts">
    import { createForm } from 'felte';
    import { validator } from '@felte/validator-zod';
    import { reporter } from '@felte/reporter-svelte';
    import { projectsSchema, type ProjectsData } from '$lib/schemas';
    import { cvData, updateStepValidation } from '$lib/stores/wizard';
    import Input from '../ui/Input.svelte';
    import Button from '../ui/Button.svelte';
    import { FolderOpen, Plus, Trash2, GripVertical, ExternalLink } from '@lucide/svelte';
    import { autoAnimate } from '@formkit/auto-animate';
  
    interface Props {
      onValidChange?: (isValid: boolean) => void;
    }
  
    let { onValidChange }: Props = $props();
  
    const { form, errors, isValid, data } = createForm<ProjectsData>({
      extend: [validator({ schema: projectsSchema }), reporter],
      initialValues: {
        projects: $cvData.projects || [{
          name: '',
          link: '',
          description: ''
        }]
      },
      onSubmit: (values) => {
        cvData.update(storeData => ({ ...storeData, ...values }));
      }
    });
  
    // Observar cambios en la validación
    $effect(() => {
      updateStepValidation(3, $isValid);
      onValidChange?.($isValid);
    });
  
    // Sincronizar con el store cuando cambian los valores
    $effect(() => {
      cvData.update(storeData => ({
        ...storeData,
        projects: $data.projects || []
      }));
    });
  
    function addProject() {
      const currentProjects = $data.projects || [];
      $data.projects = [...currentProjects, {
        name: '',
        link: '',
        description: '',
        key: crypto.randomUUID() // Add a unique key for each project
      }];
    }
  
    function removeProject(index: number) {
      const currentProjects = $data.projects;
      if (currentProjects && currentProjects.length > 1) {
        $data.projects = currentProjects.filter((_: any, i: number) => i !== index);
      }
    }
  </script>
  
  <div class="max-w-4xl mx-auto space-y-8 p-6" use:autoAnimate>
    <div class="text-center">
      <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FolderOpen class="w-8 h-8 text-orange-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Proyectos
      </h3>
      <p class="text-gray-600">
        Muestra tus proyectos más relevantes y destacados
      </p>
    </div>
  
    <form use:form class="space-y-8">
      <div class="space-y-6" use:autoAnimate>
        {#each $data.projects || [] as project, projectIndex}
          <div class="bg-white border-2 border-gray-200 rounded-lg p-6 relative">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <GripVertical class="w-4 h-4 text-gray-400" />
                <h4 class="font-semibold text-gray-900">
                  Proyecto {projectIndex + 1}
                </h4>
              </div>
              {#if ($data.projects?.length || 0) > 1}
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => removeProject(projectIndex)}
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              {/if}
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del proyecto"
                bind:value={$data.projects[projectIndex].name}
                placeholder="Ej: Sistema de gestión de inventario"
                required
                error={$errors.projects?.[projectIndex]?.name?.[0]}
              />
  
              <Input
                label="Enlace del proyecto (opcional)"
                bind:value={$data.projects[projectIndex].link}
                placeholder="https://github.com/usuario/proyecto"
                error={$errors.projects?.[projectIndex]?.link?.[0]}
              />
  
              <div class="md:col-span-2">
                <Input
                  label="Descripción"
                  bind:value={$data.projects[projectIndex].description}
                  rows={3}
                  placeholder="Describe el proyecto, tecnologías utilizadas, tu rol y logros principales..."
                  required
                  error={$errors.projects?.[projectIndex]?.description?.[0]}
                />
              </div>
            </div>
  
            <!-- Vista previa del proyecto -->
            {#if project.name || project.description}
              <div class="mt-4 bg-gray-50 rounded-lg p-4 border">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900 flex items-center gap-2">
                      {project.name || 'Nombre del proyecto'}
                      {#if project.link}
                        <ExternalLink class="w-4 h-4 text-gray-500" />
                      {/if}
                    </h5>
                    {#if project.description}
                      <p class="text-sm text-gray-700 mt-1">
                        {project.description}
                      </p>
                    {/if}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
  
      <div class="flex justify-center">
        <Button variant="secondary" onclick={addProject}>
          <Plus class="w-4 h-4" />
          Agregar proyecto
        </Button>
      </div>
    </form>
  
    <!-- Consejos para proyectos -->
    <div class="bg-orange-50 rounded-lg p-6 border border-orange-200">
      <h4 class="font-semibold text-orange-900 mb-4">💡 Consejos para destacar tus proyectos</h4>
      <div class="space-y-2 text-sm text-orange-800">
        <p><strong>• Tecnologías:</strong> Menciona las herramientas y lenguajes utilizados</p>
        <p><strong>• Resultados:</strong> Incluye métricas o impacto del proyecto</p>
        <p><strong>• Tu rol:</strong> Especifica tu contribución al proyecto</p>
        <p><strong>• Desafíos:</strong> Explica problemas técnicos que resolviste</p>
        <p><strong>• Enlaces:</strong> Incluye GitHub, demo en vivo o portfolio</p>
      </div>
    </div>
  </div>