<script lang="ts">
  interface Props {
    year: number;
    month: number;
  }

  const { year, month }: Props = $props();
</script>

<input
  name="month"
  type="month"
  value={`${year}-${String(month).padStart(2, "0")}`}
  class="px-4 py-2 text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 border rounded-md"
  onchange={(e) => {
    const target = e.currentTarget;
    const [year, month] = target.value.split("-");

    document.cookie = `year=${year}; expires=Session, path=/`;
    document.cookie = `month=${month}; expires=Session, path=/`;

    location.reload();
  }}
/>
