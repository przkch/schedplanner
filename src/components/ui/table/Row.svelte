<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLElement> {}

  const { children, class: className, ...rest }: Props = $props();
</script>

<tr class={["even:bg-stone-200 dark:even:bg-stone-900", className]} {...rest}>
  {@render children?.()}
</tr>
