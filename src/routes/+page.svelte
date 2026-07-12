<script lang="ts">
	import { onMount } from 'svelte';

	type MeetingState = 'ready' | 'running' | 'paused' | 'finished';

	let attendees = $state(6),
		annual_salary = $state(90000),
		planned_minutes = $state(45),
		elapsed_seconds = $state(0);

	let meeting_state = $state<MeetingState>('ready'),
		started_at = $state<number | null>(null),
		accumulated_seconds = $state(0);

	const hourly_rate = $derived(annual_salary / 2080);
	const cost_per_second = $derived((hourly_rate * attendees) / 3600);
	const current_cost = $derived(cost_per_second * elapsed_seconds);
	const projected_cost = $derived(
		cost_per_second * planned_minutes * 60,
	);

	const person_hours = $derived((attendees * elapsed_seconds) / 3600);

	const progress = $derived(
		Math.min(100, (elapsed_seconds / (planned_minutes * 60)) * 100),
	);

	const is_active = $derived(
		meeting_state === 'running' || meeting_state === 'paused',
	);

	const money = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
		maximumFractionDigits: 2,
	});

	const whole_money = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
		maximumFractionDigits: 0,
	});

	function format_time(total: number) {
		return [
			Math.floor(total / 3600),
			Math.floor((total % 3600) / 60),
			total % 60,
		]
			.map((part) => String(part).padStart(2, '0'))
			.join(':');
	}

	function start() {
		meeting_state = 'running';
		started_at = Date.now();
	}

	function pause() {
		accumulated_seconds = elapsed_seconds;
		started_at = null;
		meeting_state = 'paused';
	}

	function resume() {
		started_at = Date.now();
		meeting_state = 'running';
	}

	function finish() {
		if (meeting_state === 'running')
			accumulated_seconds = elapsed_seconds;
		started_at = null;
		meeting_state = 'finished';
	}

	function reset() {
		elapsed_seconds = 0;
		accumulated_seconds = 0;
		started_at = null;
		meeting_state = 'ready';
	}

	onMount(() => {
		const timer = setInterval(() => {
			if (meeting_state === 'running' && started_at !== null)
				elapsed_seconds =
					accumulated_seconds +
					Math.floor((Date.now() - started_at) / 1000);
		}, 250);
		return () => clearInterval(timer);
	});
</script>

<svelte:head>
	<title>True Meeting Cost — The room is on the clock</title>
	<meta
		name="description"
		content="A live, privacy-friendly calculator that makes the real cost of meetings visible."
	/>
</svelte:head>

<div class:meeting-active={is_active} class="app-shell">
	<header class="topbar">
		<div class="brand">
			<span class="brand-mark" aria-hidden="true">TMC</span><span>
				True Meeting Cost
			</span>
		</div>
		<p>Private by design · Nothing leaves your browser</p>
	</header>
	<main>
		<section class="intro" aria-labelledby="page-title">
			<div>
				<p class="eyebrow">A running ledger for the room</p>
				<h1 id="page-title">The room is <em>on the clock.</em></h1>
			</div>
			<p class="lede">
				Turn headcount, compensation, and time into one honest number.
				Keep the conversation when it earns its place.
			</p>
		</section>
		<div class="workspace">
			<section class="setup" aria-labelledby="setup-title">
				<div class="section-heading">
					<span>01</span>
					<div>
						<h2 id="setup-title">Set the room</h2>
						<p>
							Use the average annual salary for a fast, useful
							estimate.
						</p>
					</div>
				</div>
				<div class="fields">
					<label>
						<span>People in the room</span>
						<div class="stepper">
							<button
								type="button"
								onclick={() =>
									(attendees = Math.max(1, attendees - 1))}
								disabled={is_active || attendees <= 1}
								aria-label="Remove one attendee">−</button
							><input
								bind:value={attendees}
								type="number"
								min="1"
								max="500"
								disabled={is_active}
								aria-describedby="attendee-help"
							/><button
								type="button"
								onclick={() =>
									(attendees = Math.min(500, attendees + 1))}
								disabled={is_active || attendees >= 500}
								aria-label="Add one attendee">+</button
							>
						</div>
						<small id="attendee-help">
							{attendees === 1 ? '1 person' : `${attendees} people`} contributing
						</small>
					</label>
					<label
						><span>Average annual salary</span>
						<div class="money-input">
							<span aria-hidden="true">£</span><input
								bind:value={annual_salary}
								type="number"
								min="1000"
								max="1000000"
								step="1000"
								disabled={is_active}
							/>
						</div>
						<small
							>≈ {money.format(hourly_rate)} per person / hour</small
						></label
					>
					<label
						><span>Planned duration</span>
						<div class="duration-input">
							<input
								bind:value={planned_minutes}
								type="number"
								min="1"
								max="480"
								disabled={is_active}
							/><span>minutes</span>
						</div>
						<small
							>Projected investment: {whole_money.format(
								projected_cost,
							)}</small
						></label
					>
				</div>
			</section>
			<section
				class="meter"
				aria-labelledby="meter-title"
				aria-live="polite"
			>
				<div class="meter-top">
					<div>
						<p class="eyebrow">
							{meeting_state === 'ready'
								? 'Ready when you are'
								: meeting_state === 'finished'
									? 'Meeting complete'
									: meeting_state}
						</p>
						<h2 id="meter-title">Live investment</h2>
					</div>
					<div class="status"><i></i>{meeting_state}</div>
				</div>
				<div class="cost-readout">
					<span class="currency">£</span><strong
						>{current_cost.toLocaleString('en-GB', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}</strong
					>
				</div>
				<p class="rate">
					{money.format(cost_per_second * 60)} per minute
				</p>
				<div class="timeline">
					<div class="timeline-labels">
						<span>Elapsed</span><strong
							>{format_time(elapsed_seconds)}</strong
						><span>{planned_minutes}:00 planned</span>
					</div>
					<div
						class="track"
						role="progressbar"
						aria-label="Meeting progress"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={Math.round(progress)}
					>
						<div style:width={`${progress}%`}></div>
					</div>
				</div>
				<div class="controls">
					{#if meeting_state === 'ready'}<button
							class="primary"
							type="button"
							onclick={start}
							>Start meeting <span aria-hidden="true">→</span></button
						>{:else if meeting_state === 'running'}<button
							class="primary"
							type="button"
							onclick={pause}
							>Pause <span aria-hidden="true">Ⅱ</span></button
						><button class="secondary" type="button" onclick={finish}
							>End meeting</button
						>{:else if meeting_state === 'paused'}<button
							class="primary"
							type="button"
							onclick={resume}
							>Resume <span aria-hidden="true">→</span></button
						><button class="secondary" type="button" onclick={finish}
							>End meeting</button
						>{:else}<button
							class="primary"
							type="button"
							onclick={reset}
							>Start another <span aria-hidden="true">↻</span></button
						>{/if}
				</div>
				<div class="stats" aria-label="Meeting ledger">
					<div>
						<span>Person-hours</span><strong
							>{person_hours.toFixed(2)}</strong
						>
					</div>
					<div>
						<span>Projected total</span><strong
							>{whole_money.format(projected_cost)}</strong
						>
					</div>
					<div><span>People</span><strong>{attendees}</strong></div>
				</div>
			</section>
		</div>
	</main>
	<footer>
		<p>A useful meeting should outrun its meter.</p>
		<span>No accounts. No tracking. Just the arithmetic.</span>
	</footer>
</div>
