<script lang="ts">
  import * as m from "@paraglide/messages";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {}

  const { children, class: className, ...rest }: Props = $props();
</script>

<button
  class={[
    "px-8 py-2.5 transition-colors duration-300 rounded-md",
    "text-stone-900 dark:text-stone-100",
    "bg-stone-100 dark:bg-stone-900",
    "border-stone-200 dark:border-stone-800 enabled:hover:bg-stone-600",
    "focus:outline-none focus:bg-stone-600 disabled:opacity-75",
    className,
  ]}
  {...rest}
>
  {#if children}
    {@render children?.()}
  {:else}
    {m.add()}
  {/if}
</button>
