<script lang="ts">
  import { onMount } from "svelte";
  import Person from "./person.svelte";
  import Stopwatch from "./stopwatch.svelte";

  let people: { salary: number; cost: number }[] = [];
  let totalCost = 0;
  let timer: string | number | NodeJS.Timer | undefined;
  let seconds = 0;
  let range = { min: 25, max: 150, step: 25 };

  const addPerson = () => {
    people.push({
      salary: 25000,
      cost: 0,
    });
  };

  const startTimer = () => {
    timer = setInterval(() => {
      seconds += 1;
      people.forEach((person, index) => {
        person.cost += person.salary / (52 * 40 * 60 * 60);
        people[index] = person;
      });
      totalCost = people.reduce((total, person) => total + person.cost, 0);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  onMount(() => {
    addPerson();
    startTimer();
  });
</script>

<h1>Meeting Cost</h1>
<Stopwatch {seconds} />
<p>Total Cost: ${totalCost.toFixed(2)}</p>
{#each people as person, index (index)}
  <Person {person} {index} {range} />
{/each}
<button on:click={addPerson}>Add Person</button>
<button on:click={stopTimer}>Stop Timer</button>
