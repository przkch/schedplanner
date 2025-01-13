<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    icon: string;
    text: string;
    year: number;
    month: number;
    class?: string;
  }

  const props: Props = $props();

  const id = "month_button_" + Math.random().toString(16).slice(2);

  let year = props.year;
  let month = props.month;

  year = month == 0 ? year - 1 : month == 13 ? year + 1 : year;
  month = month == 0 ? 12 : month == 13 ? 1 : month;
</script>

<button
  {id}
  class={[
    "text-stone-900 dark:text-stone-100 bg-stone-200 dark:bg-stone-900 hover:bg-stone-300 dark:hover:bg-stone-700 text-sm p-2 sm:px-2 sm:py-1 rounded-full sm:rounded-xl transition-colors flex flex-row items-center gap-2",
    props.class,
  ]}
  onclick={() => {
    document.cookie = `year=${year}; expires=Session, path=/`;
    document.cookie = `month=${month}; expires=Session, path=/`;

    location.reload();
  }}
>
  <Icon icon={props.icon} />
  <span class="hidden sm:block">{props.text}</span>
</button>
