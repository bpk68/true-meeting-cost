<script lang="ts">
	export let seconds: number;
</script>

<p>
	Elapsed Time: {Math.floor(seconds / 3600)}:{Math.floor((seconds % 3600) / 60)
		.toString()
		.padStart(2, '0')}:{(seconds % 60).toString().padStart(2, '0')}
</p>
