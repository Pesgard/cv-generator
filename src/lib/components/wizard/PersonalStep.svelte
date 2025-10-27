<script lang="ts">
    import { createForm } from 'felte';
    import { validator } from '@felte/validator-zod';
    import { reporter } from '@felte/reporter-svelte';
    import { personalSchema, type PersonalData } from '$lib/schemas';
    import { cvData, updateStepValidation } from '$lib/stores/wizard';
    import Input from '../ui/Input.svelte';
    import { User, Mail, Phone, Linkedin, Github } from '@lucide/svelte';
  
    interface Props {
      onValidChange?: (isValid: boolean) => void;
    }
  
    let { onValidChange }: Props = $props();
  
    const { form, errors, isValid, data } = createForm<PersonalData>({
      extend: [validator({ schema: personalSchema }), reporter],
      initialValues: {
        personal: {
          name: $cvData.personal?.name || '',
          email: $cvData.personal?.email || '',
          phone: $cvData.personal?.phone || '',
          linkedin: $cvData.personal?.linkedin || '',
          github: $cvData.personal?.github || ''
        }
      },
      onSubmit: (values) => {
        cvData.update(storeData => ({ ...storeData, ...values }));
      }
    });
  
    // Observar cambios en la validación
    $effect(() => {
      updateStepValidation(0, $isValid);
      onValidChange?.($isValid);
    });
  
    // Sincronizar con el store cuando cambian los valores
    $effect(() => {
      cvData.update(storeData => ({
        ...storeData,
        personal: $data.personal
      }));
    });
  </script>
  
  <div class="max-w-4xl mx-auto space-y-8 p-6">
    <div class="text-center">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User class="w-8 h-8 text-blue-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Información Personal
      </h3>
      <p class="text-gray-600">
        Completa tus datos básicos de contacto
      </p>
    </div>
  
    <form use:form class="space-y-6">
      <div class="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-2">
              <User class="w-4 h-4 text-gray-600" />
              <Input
                label="Nombre completo"
                bind:value={$data.personal.name}
                placeholder="Ej: Juan Carlos Pérez García"
                required
                error={$errors.personal?.name?.[0]}
              />
            </div>
          </div>
  
          <div class="flex items-center gap-2 mb-2">
            <Mail class="w-4 h-4 text-gray-600" />
            <Input
              label="Email"
              type="email"
              bind:value={$data.personal.email}
              placeholder="tu@email.com"
              required
              error={$errors.personal?.email?.[0]}
            />
          </div>
  
          <div class="flex items-center gap-2 mb-2">
            <Phone class="w-4 h-4 text-gray-600" />
            <Input
              label="Teléfono"
              type="tel"
              bind:value={$data.personal.phone}
              placeholder="+52 55 1234 5678"
              required
              error={$errors.personal?.phone?.[0]}
            />
          </div>
  
          <div class="flex items-center gap-2 mb-2">
            <Linkedin class="w-4 h-4 text-gray-600" />
            <Input
              label="LinkedIn"
              bind:value={$data.personal.linkedin}
              placeholder="esgardpeinado"
              required
              error={$errors.personal?.linkedin?.[0]}
            />
          </div>
  
          <div class="flex items-center gap-2 mb-2">
            <Github class="w-4 h-4 text-gray-600" />
            <Input
              label="GitHub"
              bind:value={$data.personal.github}
              placeholder="esgardpeinado"
              required
              error={$errors.personal?.github?.[0]}
            />
          </div>
        </div>
  
        <!-- Vista previa -->
        {#if $data.personal?.name || $data.personal?.email}
          <div class="mt-6 bg-gray-50 rounded-lg p-4 border">
            <h4 class="font-semibold text-gray-900 mb-2">Vista previa del encabezado</h4>
            <div class="space-y-1">
              {#if $data.personal?.name}
                <h3 class="text-lg font-bold text-gray-900">{$data.personal.name}</h3>
              {/if}
              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                {#if $data.personal?.email}
                  <span class="flex items-center gap-1">
                    <Mail class="w-3 h-3" />
                    {$data.personal.email}
                  </span>
                {/if}
                {#if $data.personal?.phone}
                  <span class="flex items-center gap-1">
                    <Phone class="w-3 h-3" />
                    {$data.personal.phone}
                  </span>
                {/if}
                {#if $data.personal?.linkedin}
                  <span class="flex items-center gap-1">
                    <Linkedin class="w-3 h-3" />
                    {$data.personal.linkedin}
                  </span>
                {/if}
                {#if $data.personal?.github}
                  <span class="flex items-center gap-1">
                    <Github class="w-3 h-3" />
                    {$data.personal.github}
                  </span>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </div>
    </form>
  
    <!-- Consejos -->
    <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <h4 class="font-semibold text-blue-900 mb-4">💡 Consejos para tu información personal</h4>
      <div class="space-y-2 text-sm text-blue-800">
        <p><strong>• Email profesional:</strong> Usa una dirección seria, evita apodos o números aleatorios</p>
        <p><strong>• LinkedIn actualizado:</strong> Asegúrate que tu perfil esté completo y actualizado</p>
        <p><strong>• GitHub activo:</strong> Mantén repositorios públicos que muestren tu mejor código</p>
        <p><strong>• Teléfono:</strong> Incluye código de país si buscas trabajo internacional</p>
      </div>
    </div>
  </div>