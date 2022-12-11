<script lang="ts">
	$: time = (ms: string | number | Date) => new Date(ms).toISOString().slice(11, -1);
	let lapse = 0;
	let running = false;

	let salary = 60000;
	let days = 260;
	let hours = 7.5;
	let minutes = 60;
	let seconds = 60;
	let milliseconds = 1000;

	const handleRunClick = () => {
		// if (running) {
		//   clearInterval(intervalRef.current);
		// } else {
		//   const startTime = Date.now() - lapse;
		//   intervalRef.current = setInterval(() => {
		//     setLapse(Date.now() - startTime);
		//   }, 0);
		// }
		// setRunning(!running);
	};

	const handleClearClick = () => {
		// clearInterval(intervalRef.current);
		// setLapse(0);
		// setRunning(false);
	};

	const cost = (lapse: string | number) => {
		new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format((salary / days / hours / minutes / seconds / milliseconds) * parseInt(lapse));
	};
</script>

<div>
	<label for="">{time(lapse)}</label>
	<h2>{cost(lapse)}</h2>
	<button on:click={handleRunClick}>
		{running ? 'Stop' : 'Start'}
	</button>
	<button on:click={handleClearClick}>Clear</button>
</div>

<style>
	button {
		font-size: 2rem;
		padding: 1rem;
		margin: 1rem;
		background: transparent;
		/* color: ${props => props.theme.dark}; */
		/* border: 2px solid ${props => props.theme.dark}; */
		border-radius: 10px;
		/* &:hover {
      transform: translateY(-3px);
      transition: all 0.2s;
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.8);
    } */
	}

	label {
		display: block;
		font-size: 4rem;
		margin: 2rem;
		background: transparent;
		/* color: ${props => props.theme.dark}; */
		text-align: center;
	}
</style>
