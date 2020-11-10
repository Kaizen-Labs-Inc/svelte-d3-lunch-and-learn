<script>
    import { selectAll, csv, autoType } from 'd3';
    import { onMount } from 'svelte';
    let rows;
    let loading = true;
    let headline = "Loading"

    onMount(() => {
        csv('aircraft_data.csv', autoType).then(data => {
            console.log(data);
            rows = data;
            let svg = selectAll('svg')
                .style('background-color', '#000033');

            let groups = svg.selectAll('g')
                .data(data)
                .enter()
                .append('g');

            headline = "Airplane data";
            loading = false;
        });
    })
</script>
<style>
    h1 {
        color: #123456;
    }
</style>
<h1>{headline}</h1>
<svg>
</svg>
{#if !loading}
    {#each rows as row}
        <div>{row.Airplane}</div>
    {/each}
{/if}
