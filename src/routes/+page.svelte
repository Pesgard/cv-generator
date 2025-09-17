<script lang="ts">
	let cv = {
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

	function addExperience() {
		cv.experience.push({ title: '', company: '', period: '', description: '', bullets: [''] });
	}
	function addBullet(exp: any) {
		exp.bullets.push('');
	}
	function addProject() {
		cv.projects.push({ name: '', link: '', description: '' });
	}
	function addEducation() {
		cv.education.push({ period: '', degree: '', institution: '', gpa: '' });
	}
	function addSkill() {
		cv.skills.push({ category: '', items: '' });
	}

	async function generatePDF() {
		const res = await fetch('/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(cv)
		});

		if (!res.ok) {
			const err = await res.json();
			alert('Error: ' + (err.error || 'unknown'));
			return;
		}

		const blob = await res.blob();
		const url = URL.createObjectURL(blob);
		window.open(url, '_blank');
	}
</script>

<main class="mx-auto max-w-3xl space-y-6 p-6">
	<h1 class="text-2xl font-bold">CV Builder – Formulario de prueba</h1>

	<!-- Datos personales -->
	<section>
		<h2 class="mb-2 text-xl">Datos personales</h2>
		<input placeholder="Nombre" bind:value={cv.personal.name} class="mb-2 w-full" />
		<input placeholder="Email" bind:value={cv.personal.email} class="mb-2 w-full" />
		<input placeholder="Teléfono" bind:value={cv.personal.phone} class="mb-2 w-full" />
		<input placeholder="LinkedIn (usuario)" bind:value={cv.personal.linkedin} class="mb-2 w-full" />
		<input placeholder="GitHub (usuario)" bind:value={cv.personal.github} class="mb-2 w-full" />
	</section>

	<!-- Resumen -->
	<section>
		<h2 class="mb-2 text-xl">Resumen</h2>
		<textarea rows="3" bind:value={cv.summary} class="w-full"></textarea>
	</section>

	<!-- Experiencia -->
	<section>
		<h2 class="mb-2 text-xl">Experiencia</h2>
		{#each cv.experience as exp, i}
			<div class="mb-4 border p-3">
				<input placeholder="Título" bind:value={exp.title} class="mb-2 w-full" />
				<input placeholder="Empresa" bind:value={exp.company} class="mb-2 w-full" />
				<input placeholder="Periodo" bind:value={exp.period} class="mb-2 w-full" />
				<textarea placeholder="Descripción" bind:value={exp.description} class="mb-2 w-full"
				></textarea>
				<h4 class="font-semibold">Bullets</h4>
				{#each exp.bullets as bullet, j}
					<input placeholder="Logro" bind:value={exp.bullets[j]} class="mb-1 w-full" />
				{/each}
				<button type="button" class="text-sm text-blue-500" on:click={() => addBullet(exp)}
					>+ Agregar bullet</button
				>
			</div>
		{/each}
		<button type="button" class="text-sm text-green-600" on:click={addExperience}
			>+ Agregar experiencia</button
		>
	</section>

	<!-- Proyectos -->
	<section>
		<h2 class="mb-2 text-xl">Proyectos</h2>
		{#each cv.projects as project}
			<div class="mb-4 border p-3">
				<input placeholder="Nombre del proyecto" bind:value={project.name} class="mb-2 w-full" />
				<input placeholder="Link" bind:value={project.link} class="mb-2 w-full" />
				<textarea placeholder="Descripción" bind:value={project.description} class="mb-2 w-full"
				></textarea>
			</div>
		{/each}
		<button type="button" class="text-sm text-green-600" on:click={addProject}
			>+ Agregar proyecto</button
		>
	</section>

	<!-- Educación -->
	<section>
		<h2 class="mb-2 text-xl">Educación</h2>
		{#each cv.education as edu}
			<div class="mb-4 border p-3">
				<input placeholder="Periodo" bind:value={edu.period} class="mb-2 w-full" />
				<input placeholder="Título/Degree" bind:value={edu.degree} class="mb-2 w-full" />
				<input placeholder="Institución" bind:value={edu.institution} class="mb-2 w-full" />
				<input placeholder="GPA" bind:value={edu.gpa} class="mb-2 w-full" />
			</div>
		{/each}
		<button type="button" class="text-sm text-green-600" on:click={addEducation}
			>+ Agregar educación</button
		>
	</section>

	<!-- Skills -->
	<section>
		<h2 class="mb-2 text-xl">Skills</h2>
		{#each cv.skills as skill}
			<div class="mb-4 border p-3">
				<input
					placeholder="Categoría (ej. Backend)"
					bind:value={skill.category}
					class="mb-2 w-full"
				/>
				<input
					placeholder="Items (ej. Node.js, Express, SQL)"
					bind:value={skill.items}
					class="mb-2 w-full"
				/>
			</div>
		{/each}
		<button type="button" class="text-sm text-green-600" on:click={addSkill}>+ Agregar skill</button
		>
	</section>

	<div>
		<button type="button" class="rounded bg-blue-600 px-4 py-2 text-white" on:click={generatePDF}>
			Generar PDF
		</button>
	</div>
</main>
