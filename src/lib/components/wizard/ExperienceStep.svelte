<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { reporter } from '@felte/reporter-svelte';
	import { experienceSchema, type ExperienceData } from '$lib/schemas';
	import { cvData, updateStepValidation } from '$lib/stores/wizard';
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';
	import { Briefcase, Plus, Trash2, GripVertical } from '@lucide/svelte';
	import { autoAnimate } from '@formkit/auto-animate';

	interface Props {
		onValidChange?: (isValid: boolean) => void;
	}

	let { onValidChange }: Props = $props();

	const { form, errors, isValid, data } = createForm<ExperienceData>({
		extend: [validator({ schema: experienceSchema }), reporter],
		initialValues: {
			experience: $cvData.experience
		},
		onSubmit: (values) => {
			cvData.update((storeData) => ({ ...storeData, ...values }));
		}
	});

	// Observar cambios en la validación
	$effect(() => {
		updateStepValidation(2, $isValid);
		onValidChange?.($isValid);
	});

	// Sincronizar con el store cuando cambian los valores
	$effect(() => {
		cvData.update((storeData) => ({
			...storeData,
			experience: $data.experience || []
		}));
	});

	function addExperience() {
		const currentExperience = $data.experience || [];
		$data.experience = [
			...currentExperience,
			{
				title: '',
				company: '',
				period: '',
				description: '',
				bullets: [''],
				key: crypto.randomUUID()
			}
		];
	}

	function removeExperience(index: number) {
		const currentExperience = $data.experience;
		if (currentExperience && currentExperience.length > 1) {
			$data.experience = currentExperience.filter((_, i) => i !== index);
		}
	}

	function addBullet(expIndex: number) {
		const currentExperience = $data.experience;
		if (currentExperience && currentExperience[expIndex]) {
			const bullets = currentExperience[expIndex].bullets || [];
			currentExperience[expIndex].bullets = [...bullets, ''];
			// Trigger reactivity
			$data.experience = [...currentExperience];
		}
	}

	function removeBullet(expIndex: number, bulletIndex: number) {
		const currentExperience = $data.experience;
		if (currentExperience && currentExperience[expIndex] && currentExperience[expIndex].bullets) {
			const bullets = currentExperience[expIndex].bullets || [];
			if (bullets.length > 1) {
				currentExperience[expIndex].bullets = bullets.filter((_, i) => i !== bulletIndex);
				// Trigger reactivity
				$data.experience = [...currentExperience];
			}
		}
	}

	function toggleBulletsMode(expIndex: number, useBullets: boolean) {
		const currentExperience = $data.experience;
		if (currentExperience && currentExperience[expIndex]) {
			if (useBullets) {
				currentExperience[expIndex].bullets = currentExperience[expIndex].bullets || [''];
				currentExperience[expIndex].description = '';
			} else {
				currentExperience[expIndex].bullets = undefined;
			}
			// Trigger reactivity
			$data.experience = [...currentExperience];
		}
	}

	function updateBullet(expIndex: number, bulletIndex: number, value: string) {
		const currentExperience = $data.experience;
		if (currentExperience && currentExperience[expIndex] && currentExperience[expIndex].bullets) {
			currentExperience[expIndex].bullets![bulletIndex] = value;
			// Trigger reactivity
			$data.experience = [...currentExperience];
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6" use:autoAnimate>
	<div class="text-center">
		<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
			<Briefcase class="h-8 w-8 text-purple-600" />
		</div>
		<h3 class="mb-2 text-lg font-semibold text-gray-900">Experiencia Laboral</h3>
		<p class="text-gray-600">Agrega tu historial profesional, empezando por el más reciente</p>
	</div>

	<form use:form class="space-y-8">
		<div class="space-y-6" use:autoAnimate>
			{#each $data.experience || [] as exp, expIndex}
				<div class="relative rounded-lg border-2 border-gray-200 bg-white p-6">
					<div class="mb-4 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<GripVertical class="h-4 w-4 text-gray-400" />
							<h4 class="font-semibold text-gray-900">
								Experiencia {expIndex + 1}
							</h4>
						</div>
						{#if ($data.experience?.length || 0) > 1}
							<Button variant="ghost" size="sm" onclick={() => removeExperience(expIndex)}>
								<Trash2 class="h-4 w-4" />
							</Button>
						{/if}
					</div>

					<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
						<Input
							label="Cargo/Posición"
							bind:value={exp.title}
							placeholder="Ej: Desarrollador Frontend Senior"
							required
							error={$errors.experience?.[expIndex]?.title?.[0]}
						/>

						<Input
							label="Empresa"
							bind:value={exp.company}
							placeholder="Ej: Tech Solutions Inc."
							required
							error={$errors.experience?.[expIndex]?.company?.[0]}
						/>

						<Input
							label="Periodo"
							bind:value={exp.period}
							placeholder="Ej: Enero 2020 - Presente"
							required
							error={$errors.experience?.[expIndex]?.period?.[0]}
						/>

						<div class="space-y-2">
							<span class="block text-sm font-semibold text-gray-700">
								Formato de descripción
                            </span>
							<div class="flex gap-2">
								<button
									type="button"
									class="rounded-md border px-3 py-1 text-xs transition-colors
                         {!exp.bullets || exp.bullets.length === 0
										? 'border-blue-200 bg-blue-100 text-blue-700'
										: 'border-gray-200 bg-gray-100 text-gray-600'}"
									onclick={() => toggleBulletsMode(expIndex, false)}
								>
									Párrafo
								</button>
								<button
									type="button"
									class="rounded-md border px-3 py-1 text-xs transition-colors
                         {exp.bullets && exp.bullets.length > 0
										? 'border-blue-200 bg-blue-100 text-blue-700'
										: 'border-gray-200 bg-gray-100 text-gray-600'}"
									onclick={() => toggleBulletsMode(expIndex, true)}
								>
									Puntos clave
								</button>
							</div>
						</div>
					</div>

					<!-- Descripción o bullets -->
					{#if exp.bullets && exp.bullets.length > 0}
						<div class="space-y-3">
							<label class="block text-sm font-semibold text-gray-700">
								Logros y responsabilidades
								{#each exp.bullets as bullet, bulletIndex}
									<div class="flex gap-2">
										<Input
											label=""
											value={bullet}
											placeholder="Ej: Desarrollé una API que mejoró el rendimiento en 40%"
											error={$errors.experience?.[expIndex]?.bullets?.[bulletIndex]}
											oninput={(value) => updateBullet(expIndex, bulletIndex, value)}
										/>
										{#if exp.bullets && exp.bullets.length > 1}
											<Button
												variant="ghost"
												size="sm"
												onclick={() => removeBullet(expIndex, bulletIndex)}
												class="self-end"
											>
												<Trash2 class="h-4 w-4" />
											</Button>
										{/if}
									</div>
								{/each}
							</label>
							<Button variant="ghost" size="sm" onclick={() => addBullet(expIndex)}>
								<Plus class="h-4 w-4" />
								Agregar punto
							</Button>
						</div>
					{:else}
						<Input
							label="Descripción del trabajo"
							bind:value={exp.description}
							rows={3}
							placeholder="Describe tus principales responsabilidades y logros en este puesto..."
						/>
					{/if}
				</div>
			{/each}
		</div>

		<div class="flex justify-center">
			<Button variant="secondary" onclick={addExperience}>
				<Plus class="h-4 w-4" />
				Agregar experiencia
			</Button>
		</div>
	</form>
</div>
