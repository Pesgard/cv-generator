<script lang="ts">
	import { CircleAlert } from "@lucide/svelte";

    

    interface Props {
      label: string;
      value?: string;
      type?: 'text' | 'email' | 'tel' | 'url';
      placeholder?: string;
      required?: boolean;
      error?: string;
      rows?: number;
      oninput?: (value: string) => void;
    }
  
    let {
      label,
      value = $bindable(''),
      type = 'text',
      placeholder = '',
      required = false,
      error = '',
      rows,
      oninput
    }: Props = $props();
  
    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      value = target.value;
      if (oninput) {
        oninput(value);
      }
    }
  
    const inputClass = $derived(`
      w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
      ${error 
        ? 'border-red-300 bg-red-50 focus:border-red-500' 
        : 'border-gray-200 bg-white focus:border-blue-500 hover:border-gray-300'
      }
    `.trim());
  </script>
  
  <div class="space-y-2">
    <label class="block text-sm font-semibold text-gray-700" for="input-field">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
    
    {#if rows}
      <textarea
        id="input-field"
        {rows}
        class={inputClass}
        {placeholder}
        {required}
        bind:value
        oninput={handleInput}
      ></textarea>
    {:else}
      <input
        id="input-field"
        {type}
        class={inputClass}
        {placeholder}
        {required}
        bind:value
        oninput={handleInput}
      />
    {/if}
    
    {#if error}
      <p class="text-sm text-red-600 flex items-center gap-1">
        <CircleAlert class="w-4 h-4" />
        {error}
      </p>
    {/if}
  </div>