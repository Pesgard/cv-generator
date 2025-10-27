<script lang="ts">
    import { createForm } from 'felte';
    import { validator } from '@felte/validator-zod';
    import { reporter } from '@felte/reporter-svelte';
    import { skillsSchema, type SkillsData } from '$lib/schemas';
    import { cvData, updateStepValidation } from '$lib/stores/wizard';
    import Input from '../ui/Input.svelte';
    import Button from '../ui/Button.svelte';
    import { Code, Plus, Trash2, GripVertical } from '@lucide/svelte';
    import { autoAnimate } from '@formkit/auto-animate';
  
    interface Props {
      onValidChange?: (isValid: boolean) => void;
    }
  
    let { onValidChange }: Props = $props();
  
    const { form, errors, isValid, data } = createForm<SkillsData>({
      extend: [validator({ schema: skillsSchema }), reporter],
      initialValues: {
        skills: $cvData.skills || [{
          category: '',
          items: ''
        }]
      },
      onSubmit: (values) => {
        cvData.update(storeData => ({ ...storeData, ...values }));
      }
    });
  
    // Observar cambios en la validación
    $effect(() => {
      updateStepValidation(5, $isValid);
      onValidChange?.($isValid);
    });
  
    // Sincronizar con el store cuando cambian los valores
    $effect(() => {
      cvData.update(storeData => ({
        ...storeData,
        skills: $data.skills || []
      }));
    });
  
    function addSkill() {
      const currentSkills = $data.skills || [];
      $data.skills = [...currentSkills, {
        category: '',
        items: '',
        key: crypto.randomUUID() // Add a unique key for each skill category
      }];
    }
  
    function removeSkill(index: number) {
      const currentSkills = $data.skills;
      if (currentSkills && currentSkills.length > 1) {
        $data.skills = currentSkills.filter((_: any, i: number) => i !== index);
      }
    }
  
    const skillCategories = [
      'Lenguajes de Programación',
      'Frameworks & Librerías',
      'Bases de Datos',
      'Herramientas de Desarrollo',
      'Metodologías',
      'Tecnologías Cloud',
      'Sistemas Operativos',
      'Soft Skills'
    ];
  
    const skillExamples = {
      'Lenguajes de Programación': 'JavaScript, TypeScript, Python, Java, C#, Go',
      'Frameworks & Librerías': 'React, Vue.js, Svelte, Node.js, Express, Django',
      'Bases de Datos': 'PostgreSQL, MongoDB, MySQL, Redis, Firebase',
      'Herramientas de Desarrollo': 'Git, Docker, Kubernetes, Jenkins, VS Code',
      'Metodologías': 'Agile, Scrum, TDD, DevOps, CI/CD',
      'Tecnologías Cloud': 'AWS, Azure, Google Cloud, Vercel, Netlify',
      'Sistemas Operativos': 'Linux, Windows, macOS',
      'Soft Skills': 'Liderazgo, Trabajo en equipo, Comunicación efectiva'
    };
  </script>
  
  <div class="max-w-4xl mx-auto space-y-8 p-6" use:autoAnimate>
    <div class="text-center">
      <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Code class="w-8 h-8 text-indigo-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Habilidades Técnicas
      </h3>
      <p class="text-gray-600">
        Organiza tus habilidades por categorías para mayor claridad
      </p>
    </div>
  
    <form use:form class="space-y-8">
      <div class="space-y-6" use:autoAnimate>
        {#each $data.skills || [] as skill, skillIndex}
          <div class="bg-white border-2 border-gray-200 rounded-lg p-6 relative">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <GripVertical class="w-4 h-4 text-gray-400" />
                <h4 class="font-semibold text-gray-900">
                  Categoría {skillIndex + 1}
                </h4>
              </div>
              {#if ($data.skills?.length || 0) > 1}
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => removeSkill(skillIndex)}
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              {/if}
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Categoría"
                bind:value={$data.skills[skillIndex].category}
                placeholder="Ej: Lenguajes de Programación"
                required
                error={$errors.skills?.[skillIndex]?.category?.[0]}
              />
  
              <Input
                label="Habilidades (separadas por comas)"
                bind:value={$data.skills[skillIndex].items}
                placeholder="JavaScript, TypeScript, Python, React..."
                required
                error={$errors.skills?.[skillIndex]?.items?.[0]}
              />
            </div>
  
            <!-- Vista previa de las habilidades -->
            {#if skill.category || skill.items}
              <div class="mt-4 bg-gray-50 rounded-lg p-4 border">
                <div>
                  <h5 class="font-medium text-gray-900 mb-2">
                    {skill.category || 'Categoría de habilidad'}
                  </h5>
                  {#if skill.items}
                    <div class="flex flex-wrap gap-1">
                      {#each skill.items.split(',').map(item => item.trim()).filter(item => item) as item}
                        <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">
                          {item}
                        </span>
                      {/each}
                    </div>
                  {:else}
                    <p class="text-sm text-gray-500 italic">
                      Las habilidades aparecerán aquí...
                    </p>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
  
      <div class="flex justify-center">
        <Button variant="secondary" onclick={addSkill}>
          <Plus class="w-4 h-4" />
          Agregar categoría
        </Button>
      </div>
    </form>
  
    <!-- Sugerencias de categorías -->
    <div class="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
      <h4 class="font-semibold text-indigo-900 mb-4">⚡ Categorías y ejemplos comunes</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each skillCategories as category}
          <div class="space-y-1">
            <button
              type="button"
              class="text-left w-full p-3 rounded-lg hover:bg-indigo-100 text-indigo-800 transition-colors border border-indigo-200"
              onclick={() => {
                const currentSkills = $data.skills;
                if (currentSkills && currentSkills.length > 0) {
                  const lastIndex = currentSkills.length - 1;
                  if (!currentSkills[lastIndex].category) {
                    currentSkills[lastIndex].category = category;
                    currentSkills[lastIndex].items = skillExamples[category as keyof typeof skillExamples] || '';
                    $data.skills = currentSkills;
                  }
                }
              }}
            >
              <div class="font-medium">{category}</div>
              <div class="text-xs text-indigo-600 mt-1">
                {skillExamples[category as keyof typeof skillExamples]?.substring(0, 50)}...
              </div>
            </button>
          </div>
        {/each}
      </div>
      <div class="mt-4 text-sm text-indigo-800">
        <strong>Tip:</strong> Haz clic en una categoría para aplicarla automáticamente al último campo vacío.
      </div>
    </div>
  </div>