<script lang="ts">
  import { getRandomId } from "@lib/utils";

  import type { ChangeEventHandler } from "svelte/elements";

  interface Props {
    class?: string;
    label?: string;
    name?: string;
    required?: boolean;
    onchange?: ChangeEventHandler<HTMLSelectElement>;
    disabled?: boolean;
    children?: any;
  }

  const props: Props = $props();

  const id = getRandomId("input");
</script>

<div class={props.class}>
  <label for={id} class="text-stone-900 dark:text-stone-100">{props.label}</label>
  <select
    {id}
    name={props.name}
    required={props.required}
    onchange={props.onchange}
    disabled={props.disabled}
    class="block w-full px-4 py-2 text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 border rounded-md focus:outline-none disabled:opacity-75"
  >
    {@render props.children?.()}
  </select>
</div>
