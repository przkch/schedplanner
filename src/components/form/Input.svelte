<script lang="ts">
  import { getRandomId } from "@lib/utils";

  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends HTMLInputAttributes {
    label?: string;
  }

  const { children, class: className, label, ...rest }: Props = $props();

  const id = getRandomId("input");
</script>

{#snippet InputElement()}
  <input
    class={[
      "px-4 py-2 border rounded-md",
      "text-stone-900 dark:text-stone-100",
      "bg-stone-100 dark:bg-stone-900",
      "border-stone-200 dark:border-stone-800",
      "focus:outline-none disabled:opacity-75",
      className,
    ]}
    {...rest}
  />
{/snippet}

{#if label}
  <div class="flex flex-col gap-2">
    <label for={id} class="text-stone-900 dark:text-stone-100">{label}</label>
    {@render InputElement()}
  </div>
{:else}
  {@render InputElement()}
{/if}
