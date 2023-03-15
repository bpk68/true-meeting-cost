<script lang="ts">
	export let person: { salary: number; cost: number };
	export let range: { min: number; max: number; step: number } = {
		min: 25,
		max: 400,
		step: 25
	};
	let options: number[] = [];

	$: {
		options = Array.from(
			{ length: (range.max - range.min) / range.step + 1 },
			(_, i) => range.min + i * range.step
		);
	}
</script>

<select bind:value={person.salary}>
	{#each options as option}
		<option value={option * 1000}>${option}k</option>
	{/each}
</select>
