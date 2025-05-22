<script lang="ts">
  import type { HTMLTdAttributes } from "svelte/elements";

  interface Props extends HTMLTdAttributes {}

  const { children, class: className, ...rest }: Props = $props();
</script>

<td class={["px-6 py-4", className]} {...rest}>
  {@render children?.()}
</td>
