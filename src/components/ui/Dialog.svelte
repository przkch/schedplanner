<script lang="ts">
  import type { Action } from "svelte/action";
  import type { HTMLDialogAttributes } from "svelte/elements";

  const { children, class: className, ...rest }: HTMLDialogAttributes = $props();

  const handleBackdropClick: Action<HTMLDialogElement> = (node: HTMLDialogElement) => {
    $effect(() => {
      node.addEventListener("click", (event: MouseEvent) => {
        const rect = node.getBoundingClientRect();

        const isInDialog = [
          rect.top <= event.clientY,
          event.clientY <= rect.top + rect.height,
          rect.left <= event.clientX,
          event.clientX <= rect.left + rect.width,
        ].every((c) => c);

        if (!isInDialog && event.target === event.currentTarget) node.close();
      });
    });
  };
</script>

<dialog
  use:handleBackdropClick
  class={["fixed m-auto p-4 rounded-xl", "text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900", className]}
  {...rest}
>
  {@render children?.()}
</dialog>

<style>
  dialog::backdrop {
    background-color: var("--color-stone-900/75");
    backdrop-filter: blur(4px);
  }
</style>
