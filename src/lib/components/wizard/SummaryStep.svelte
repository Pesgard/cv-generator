<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { reporter } from '@felte/reporter-svelte';
	import { summarySchema, type SummaryData } from '$lib/schemas';
	import { cvData, updateStepValidation } from '$lib/stores/wizard';
	import Input from '../ui/Input.svelte';
	import { FileText, Lightbulb } from '@lucide/svelte';

	interface Props {
		onValidChange?: (isValid: boolean) => void;
	}

	let { onValidChange }: Props = $props();

	const { form, errors, isValid, data } = createForm<SummaryData>({
		extend: [validator({ schema: summarySchema }), reporter],
		initialValues: {
			summary: $cvData.summary || ''
		},
		onSubmit: (values) => {
			cvData.update((storeData) => ({ ...storeData, ...values }));
		}
	});

	// Observar cambios en la validación
	$effect(() => {
		updateStepValidation(1, $isValid);
		onValidChange?.($isValid);
	});

	// Sincronizar con el store cuando cambian los valores
	$effect(() => {
		cvData.update((storeData) => ({
			...storeData,
			summary: $data.summary
		}));
	});

	const summaryExamples = [
		'Desarrollador Full Stack con 5+ años de experiencia en JavaScript, React y Node.js. Especializado en crear aplicaciones web escalables y optimizar el rendimiento del frontend. Apasionado por las metodologías ágiles y el desarrollo colaborativo.',
		'Ingeniera de Software enfocada en tecnologías cloud y DevOps. Experiencia implementando pipelines CI/CD y arquitecturas de microservicios en AWS. Busco contribuir a equipos innovadores en el desarrollo de productos tecnológicos de impacto.',
		'Desarrollador Frontend especializado en React y TypeScript, con sólida experiencia en UX/UI. He liderado equipos pequeños y me enfoco en crear interfaces intuitivas y accesibles. Interesado en proyectos que combinen tecnología y diseño.'
	];

	let characterCount = $derived($data.summary?.length || 0);
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<div class="text-center">
		<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
			<FileText class="h-8 w-8 text-green-600" />
		</div>
		<h3 class="mb-2 text-lg font-semibold text-gray-900">Resumen Profesional</h3>
		<p class="text-gray-600">
			Escribe un resumen que capture tu experiencia y objetivos profesionales
		</p>
	</div>

	<form use:form class="space-y-6">
		<div class="rounded-lg border-2 border-gray-200 bg-white p-6">
			<div class="space-y-4">
				<div>
					<div class="mb-2 flex items-center justify-between">
						<label class="block text-sm font-semibold text-gray-700">
							Resumen profesional
							<span class="text-xs text-gray-500">
								{characterCount}/500 caracteres
							</span>
							<Input
								label=""
								bind:value={$data.summary}
								rows={6}
								placeholder="Desarrollador Full Stack con X años de experiencia en... Especializado en... Apasionado por... Busco oportunidades para..."
								required
								error={$errors.summary?.[0]}
							/>
						</label>
					</div>
				</div>

				<!-- Vista previa -->
				{#if $data.summary}
					<div class="rounded-lg border bg-gray-50 p-4">
						<h4 class="mb-2 font-semibold text-gray-900">Vista previa</h4>
						<p class="text-sm leading-relaxed text-gray-700">
							{$data.summary}
						</p>
					</div>
				{/if}
			</div>
		</div>
	</form>

	<!-- Ejemplos de resúmenes -->
	<div class="rounded-lg border border-green-200 bg-green-50 p-6">
		<div class="mb-4 flex items-center gap-2">
			<Lightbulb class="h-5 w-5 text-green-600" />
			<h4 class="font-semibold text-green-900">Ejemplos de resúmenes efectivos</h4>
		</div>
		<div class="space-y-4">
			{#each summaryExamples as example, index}
				<div class="rounded-lg border border-green-200 bg-white p-4">
					<p class="mb-3 text-sm leading-relaxed text-gray-700">
						{example}
					</p>
					<button
						type="button"
						class="text-xs font-medium text-green-700 transition-colors hover:text-green-800"
						onclick={() => {
							$data.summary = example;
						}}
					>
						Usar como plantilla
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Consejos -->
	<div class="rounded-lg border border-green-200 bg-green-50 p-6">
		<h4 class="mb-4 font-semibold text-green-900">Elementos clave de un buen resumen</h4>
		<div class="grid grid-cols-1 gap-4 text-sm text-green-800 md:grid-cols-2">
			<div class="space-y-2">
				<p><strong>• Años de experiencia:</strong> Menciona tu nivel de experiencia</p>
				<p><strong>• Tecnologías principales:</strong> Destaca tus herramientas clave</p>
				<p><strong>• Especialización:</strong> Define tu área de expertise</p>
				<p><strong>• Logros cuantificados:</strong> Incluye números cuando sea posible</p>
			</div>
			<div class="space-y-2">
				<p><strong>• Objetivos profesionales:</strong> Indica qué buscas</p>
				<p><strong>• Soft skills relevantes:</strong> Liderazgo, trabajo en equipo</p>
				<p><strong>• Industrias de interés:</strong> Sectores donde quieres trabajar</p>
				<p><strong>• Valor único:</strong> Qué te diferencia de otros candidatos</p>
			</div>
		</div>
	</div>
</div>
