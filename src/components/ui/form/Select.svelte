<script lang="ts">
  import { getRandomId } from "@lib/utils";

  import type { HTMLSelectAttributes } from "svelte/elements";

  interface Props extends HTMLSelectAttributes {
    label?: string;
  }

  const { children, class: className, label, ...rest }: Props = $props();

  let id = $state(getRandomId("input"));

  if (rest.id) id = rest.id;
</script>

{#snippet SelectElement()}
  <select
    {id}
    class={[
      "px-4 py-2 border rounded-md",
      "text-stone-900 dark:text-stone-100",
      "bg-stone-100 dark:bg-stone-900",
      "border-stone-200 dark:border-stone-800",
      "focus:outline-none disabled:opacity-75",
      className,
    ]}
    {...rest}
  >
    {@render children?.()}
  </select>
{/snippet}

{#if label}
  <div class="flex flex-col gap-2">
    <label for={id} class="text-stone-900 dark:text-stone-100">{label}</label>
    {@render SelectElement()}
  </div>
{:else}
  {@render SelectElement()}
{/if}
