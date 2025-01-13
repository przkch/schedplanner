<script lang="ts">
  import { getRandomId } from "@lib/utils";

  import type { ChangeEventHandler, HTMLInputTypeAttribute } from "svelte/elements";

  interface Props {
    name: string;
    type: HTMLInputTypeAttribute;
    placeholder?: string;
    label?: string;
    required?: boolean;
    class?: string;
    onchange?: ChangeEventHandler<HTMLInputElement>;
    value?: string;
    autocomplete?: AutoFill;
    disabled?: boolean;
  }

  const props: Props = $props();

  const id = getRandomId("input");
</script>

<div class={props.class}>
  <label for={id} class="text-stone-900 dark:text-stone-100">{props.label}</label>
  <input
    {id}
    name={props.name}
    placeholder={props.placeholder}
    type={props.type}
    required={props.required}
    onchange={props.onchange}
    value={props.value}
    autocomplete={props.autocomplete}
    disabled={props.disabled}
    class="block w-full px-4 py-2 text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 border rounded-md focus:outline-none disabled:opacity-75"
  />
</div>
