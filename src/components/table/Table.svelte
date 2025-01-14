<script lang="ts">
  import type { HTMLTableAttributes } from "svelte/elements";

  interface Props extends HTMLTableAttributes {
    headers?: string[];
  }

  const { children, class: className, headers, ...rest }: Props = $props();
</script>

<table class={["w-full text-sm text-left rtl:text-right", className]} {...rest}>
  {#if headers}
    <thead>
      <tr class="text-xs bg-stone-100 dark:bg-stone-900">
        {#each headers as header}
          <th class="px-6 py-4">{header}</th>
        {/each}
      </tr>
    </thead>
  {/if}
  <tbody>
    {@render children?.()}
  </tbody>
</table>
