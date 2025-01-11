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
  class="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-md"
  onchange={(e) => {
    const target = e.currentTarget;
    const [year, month] = target.value.split("-");

    document.cookie = `year=${year}; expires=Session, path=/`;
    document.cookie = `month=${month}; expires=Session, path=/`;

    location.reload();
  }}
/>
