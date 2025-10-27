<script lang="ts">
	import { Loader } from '@lucide/svelte';
  
    import type { Snippet } from 'svelte';
  
    interface Props {
      variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
      size?: 'sm' | 'md' | 'lg';
      disabled?: boolean;
      loading?: boolean;
      type?: 'button' | 'submit';
      class?: string;
      onclick?: (event: MouseEvent) => void;
      children?: Snippet;
    }
  
    let {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      type = 'button',
      class: className = '',
      onclick,
      children
    }: Props = $props();
  
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300',
      ghost: 'bg-transparent hover:bg-gray-50 text-gray-600 border-transparent hover:border-gray-200',
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700'
    };
  
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };
  
    const buttonClass = $derived(`
      inline-flex items-center justify-center gap-2 font-semibold border-2 rounded-lg 
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current
      ${variants[variant]} ${sizes[size]} ${className}
    `.trim());
  
    function handleClick(event: MouseEvent) {
      if (!disabled && !loading && onclick) {
        onclick(event);
      }
    }
  </script>
  
  <button
    {type}
    class={buttonClass}
    disabled={disabled || loading}
    onclick={handleClick}
  >
    {#if loading}
      <Loader class="w-4 h-4 animate-spin" />
    {/if}
    
    {#if children}
      {@render children()}
    {/if}
  </button>