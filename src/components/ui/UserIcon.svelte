<script lang="ts">
  interface Props {
    name: string | null | undefined;
  }

  const { name }: Props = $props();

  const [firstName, lastName] = name?.split(" ") as string[];
  const initials = `${firstName.split("")[0].toUpperCase()}${lastName.split("")[0].toUpperCase()}`;
</script>

{#if name}
  <span class="size-10 rounded-full bg-stone-300 dark:bg-stone-700 flex justify-center items-center">
    {initials}
  </span>
{/if}
