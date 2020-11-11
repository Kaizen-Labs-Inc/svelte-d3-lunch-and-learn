<script>
    import {csv, autoType, scaleLinear, min, max, select, axisBottom, axisLeft, transition} from 'd3';
    import {onMount} from 'svelte';
    import {types} from './types';
    import Aircraft from "./Aircraft.svelte";

    let rows = [];
    const TYPE_ALL = 'all';
    let type = 'NA';
    $: description = types[type] ? types[type].description : '';
    let loading = true;
    let headline = "Loading";
    let svg;
    let circles;
    let x;
    let y;
    let highlighted;
    let minSeats = 1;

    let margin = {
        top: 5,
        bottom: 45,
        left: 45,
        right: 5
    };

    let radius = 7;

    function random(list) {
        return list[Math.floor((Math.random() * list.length))];
    }

    $: filteredRows = reFilterRows(rows, type, minSeats);

    $: {
        if (svg && filteredRows) {

            const slow = transition()
                .duration(1000);

            svg.selectAll('circle')
                .data(filteredRows)
                .join(
                    enter => enter.append('circle')
                        .attr('opacity', 0)
                        .attr('r', radius)
                        .attr('fill', d => types[d.Type].color)
                        .attr('cx', d => x(d.Speed))
                        .attr('cy', d => y(d.SMPG))
                        .call(e => e.transition(slow).attr('opacity', 1)),
                    update => update
                        .call(e => e.transition(slow)
                            .attr('fill', d => {
                                return types[d.Type].color;
                            })
                            .attr('cx', d => x(d.Speed))
                            .attr('cy', d => y(d.SMPG))
                        ),
                    remove => remove
                        .call(e => e.transition(slow).attr('opacity', 0))
                        .remove()
                )
                .on('click', e => { highlighted = e.target["__data__"] })
        }
    }

    function reFilterRows(sourceRows, typeString, minimumSeats) {
        let filtered = sourceRows.filter(r => {
            if (typeString !== TYPE_ALL && r.Type !== type) {
                return false
            }
            if (minimumSeats && r.Seats < minimumSeats) {
                return false
            }
            return true
        });
        console.log("found " + filtered.length)
        return filtered
    }

    onMount(() => {
        let box = document.getElementById('js-svg-container');
        let boxWidth = Math.round(box.offsetWidth - 2);
        let width = boxWidth - margin.left - margin.right - radius * 2;
        let height = Math.round(width * .61 - radius * 2);

        csv('aircraft_data.csv', autoType).then(data => {

            let speeds = data.map(d => {
                return d.Speed;
            });
            let smpg = data.map(d => {
                return d.SMPG;
            });

            // define x and y scale functions
            x = scaleLinear()
                .domain([min(speeds), max(speeds)])
                .range([margin.left + radius, boxWidth - margin.right - radius]);

            y = scaleLinear()
                .domain([max(smpg), min(smpg)])
                .range([margin.top + radius, height - margin.bottom - radius]);

            svg = select('#js-svg-container')
                .append('svg')
                .attr('height', height)
                .attr('width', boxWidth);

            // x axis
            let scaleXAxis = axisBottom()
                .scale(x);

            svg.append("g")
                .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
                .call(scaleXAxis);

            svg.append('text')
                .attr('x', margin.left + width / 2)
                .attr('y', height - 3)
                .attr('text-anchor', 'middle')
                .text('Speed (kts)')
                .attr('fill', '#444444');

            let scaleYAxis = axisLeft()
                .scale(y);

            // y axis
            svg.append("g")
                .attr('transform', 'translate(' + margin.left + ', 0)')
                .call(scaleYAxis);

            svg.append('text')
                .attr('x', 12)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .attr('transform', 'rotate(-90, 12, ' + height / 2 + ')')
                .text('Seat-miles / gallon')
                .attr('fill', '#444444');


            headline = 'Fuel Efficiency for Owner-flown Aircraft';
            rows = data;
            loading = false;
        });
    })
</script>
<style>
    h1 {
        color: #123456;
    }
    .container {
        max-width: 800px;
        margin: 0 auto 500px auto;
    }
    p {
        min-height: 40px;
        margin: 10px 0;
    }
    input {
        padding: 0;
        margin: 0;
    }
</style>
<div class="container">
    <h1>{headline}</h1>
    <label>
        Engine type:
        <select bind:value={type}>
            <option value={TYPE_ALL}>Show all</option>
            {#each Object.keys(types) as id}
                <option value={id}>{types[id].name}</option>
            {/each}
        </select>
    </label>
    <label>
        <div>Minimum seats: {minSeats}</div>
        <div>1 <input type="range" min="1" max="10" bind:value={minSeats} /> 10</div>
    </label>
    <p class="description">{description}</p>
    <div id="js-svg-container"></div>
    {#if highlighted}
        <Aircraft aircraft={highlighted} />
    {/if}
</div>
