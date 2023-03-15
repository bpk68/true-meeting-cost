<script lang="ts">
	import SalarySelect from './salary-select.svelte';

	export let person: { salary: number; cost: number };
	export let index: number;
	export let range: { min: number; max: number; step: number } = {
		min: 25,
		max: 150,
		step: 25
	};
	const defaultPerson = { salary: 25000, cost: 0 };
	person = person || defaultPerson;
</script>

<div>
	<label for={`person-${index}-salary`}>Person {index + 1} Salary:</label>
	<SalarySelect {person} {range} />
	<p>Cost: ${person.cost.toFixed(2)}</p>
</div>
