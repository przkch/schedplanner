<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  interface Props {
    class?: string;
    disabled?: boolean;
    label?: string;
    type?: "button" | "submit" | undefined;
    onclick?: MouseEventHandler<HTMLButtonElement>;
  }

  const props: Props = $props();
</script>

<div class={["flex justify-center sm:justify-end", props.class]}>
  <button
    class="px-8 py-2.5 leading-5 transition-colors duration-300 transform rounded-md text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 enabled:hover:bg-stone-600 focus:outline-none enabled:focus:bg-stone-600 disabled:opacity-75"
    type={props.type || "submit"}
    disabled={props.disabled}
    onclick={props.onclick}
  >
    {props.label}
  </button>
</div>
