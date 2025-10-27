<script lang="ts">
    import { createForm } from 'felte';
    import { validator } from '@felte/validator-zod';
    import { reporter } from '@felte/reporter-svelte';
    import { educationSchema, type EducationData } from '$lib/schemas';
    import { cvData, updateStepValidation } from '$lib/stores/wizard';
    import Input from '../ui/Input.svelte';
    import Button from '../ui/Button.svelte';
    import { GraduationCap, Plus, Trash2, GripVertical } from '@lucide/svelte';
    
    import { autoAnimate } from '@formkit/auto-animate';
  
    interface Props {
      onValidChange?: (isValid: boolean) => void;
    }
  
    let { onValidChange }: Props = $props();
  
    const { form, errors, isValid, data } = createForm<EducationData>({
      extend: [validator({ schema: educationSchema }), reporter],
      initialValues: {
        education: $cvData.education
      },
      onSubmit: (values) => {
        cvData.update(data => ({ ...data, ...values }));
      }
    });
  
    // Observar cambios en la validación
    $effect(() => {
      updateStepValidation(4, $isValid);
      onValidChange?.($isValid);
    });
  
    // Sincronizar con el store cuando cambian los valores
    $effect(() => {
      cvData.update(storeData => ({
        ...storeData,
        education: $data.education || []
      }));
    });
  
    function addEducation() {
      const currentEducation = $data.education || [];
      $data.education = [...currentEducation, {
        period: '',
        degree: '',
        institution: '',
        gpa: '',
        key: crypto.randomUUID() // Add a unique key for each education entry
      }];
    }
  
    function removeEducation(index: number) {
      const currentEducation = $data.education;
      if (currentEducation && currentEducation.length > 1) {
        $data.education = currentEducation.filter((_: any, i: number) => i !== index);
      }
    }
  
    const degreeTypes = [
      'Licenciatura en Ingeniería de Sistemas',
      'Licenciatura en Ciencias de la Computación',
      'Ingeniería en Software',
      'Técnico en Programación',
      'Maestría en Ingeniería de Software',
      'Bootcamp de Desarrollo Web',
      'Certificación en Cloud Computing',
      'Curso de Data Science'
    ];
  </script>
  
  <div class="max-w-4xl mx-auto space-y-8 p-6" use:autoAnimate>
    <div class="text-center">
      <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <GraduationCap class="w-8 h-8 text-emerald-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Formación Académica
      </h3>
      <p class="text-gray-600">
        Incluye tu educación formal, cursos y certificaciones relevantes
      </p>
    </div>
  
    <form use:form class="space-y-8">
      <div class="space-y-6" use:autoAnimate>
        {#each $data.education || [] as edu, eduIndex}
          <div class="bg-white border-2 border-gray-200 rounded-lg p-6 relative">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <GripVertical class="w-4 h-4 text-gray-400" />
                <h4 class="font-semibold text-gray-900">
                  Educación {eduIndex + 1}
                </h4>
              </div>
              {#if ($data.education?.length || 0) > 1}
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => removeEducation(eduIndex)}
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              {/if}
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Periodo"
                bind:value={edu.period}
                placeholder="Ej: 2018 - 2022"
                required
                error={$errors.education?.[eduIndex]?.period?.[0]}
              />
  
              <Input
                label="GPA / Promedio (opcional)"
                bind:value={edu.gpa}
                placeholder="Ej: 3.8/4.0 o 85/100"
                error={$errors.education?.[eduIndex]?.gpa?.[0]}
              />
  
              <div class="md:col-span-2">
                <Input
                  label="Título/Grado"
                  bind:value={edu.degree}
                  placeholder="Ej: Licenciatura en Ingeniería de Sistemas"
                  required
                  error={$errors.education?.[eduIndex]?.degree?.[0]}
                />
              </div>
  
              <div class="md:col-span-2">
                <Input
                  label="Institución"
                  bind:value={edu.institution}
                  placeholder="Ej: Universidad Nacional de Colombia"
                  required
                  error={$errors.education?.[eduIndex]?.institution?.[0]}
                />
              </div>
            </div>
  
            <!-- Vista previa de la educación -->
            {#if edu.period || edu.degree || edu.institution}
              <div class="mt-4 bg-gray-50 rounded-lg p-4 border">
                <div class="flex justify-between items-start">
                  <div>
                    <h5 class="font-medium text-gray-900">
                      {edu.degree || 'Título del grado'}
                    </h5>
                    {#if edu.institution}
                      <p class="text-sm text-gray-700 font-medium">
                        {edu.institution}
                      </p>
                    {/if}
                  </div>
                  <div class="text-right text-sm text-gray-600">
                    {#if edu.period}
                      <p>{edu.period}</p>
                    {/if}
                    {#if edu.gpa}
                      <p>GPA: {edu.gpa}</p>
                    {/if}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
  
      <div class="flex justify-center">
        <Button variant="secondary" onclick={addEducation}>
          <Plus class="w-4 h-4" />
          Agregar educación
        </Button>
      </div>
    </form>
  
    <!-- Sugerencias de títulos -->
    <div class="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
      <h4 class="font-semibold text-emerald-900 mb-4">🎓 Ejemplos de títulos comunes</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {#each degreeTypes as degree}
          <button
            type="button"
            class="text-left p-2 rounded hover:bg-emerald-100 text-emerald-800 transition-colors"
            onclick={() => {
              const currentEducation = $data.education;
              if (currentEducation && currentEducation.length > 0) {
                const lastIndex = currentEducation.length - 1;
                currentEducation[lastIndex].degree = degree;
              }
            }}
          >
            {degree}
          </button>
        {/each}
      </div>
      <div class="mt-4 text-sm text-emerald-800">
        <strong>Tip:</strong> Incluye certificaciones relevantes, bootcamps y cursos especializados que complementen tu formación.
      </div>
    </div>
  </div>