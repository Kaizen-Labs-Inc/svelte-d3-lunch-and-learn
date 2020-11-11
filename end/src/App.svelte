<script>
    import { csv, autoType, scaleLinear, min, max, select, axisBottom, axisLeft } from 'd3';
    import { onMount } from 'svelte';
    let rows = [];
    const TYPE_ALL = 'all';
    let type = TYPE_ALL;
    let loading = true;
    let headline = "Loading";
    let svg;
    let circles;
    let x;
    let y;

    let types = {
        E: {color: '#4CB963', name: 'Electric'},
        TD: {color: '#ECD444', name: 'Turbo Diesel'},
        T: {color: '#D7BCE8', name: 'Turbocharged'},
        NA: {color: '#EF3054', name: 'Naturally-aspirated'},
        JP: {color: '#1E2EDE', name: 'Turboprop'},
        J: {color: '#7E22cE', name: 'Jet'}
    }

    let margin = {
        top: 5,
        bottom: 25,
        left: 25,
        right: 5
    };

    let radius = 5;


    $: filteredRows = reFilterRows(rows, type);

    $: {
        if (svg) {
            const slow = svg.transition()
                .duration(750);

            console.log(rows);
            console.log(filteredRows);

            circles.data(filteredRows)
                .join(
                    enter => enter
                        .append("circle")
                        .attr('r', radius)
                        .attr('fill', d => { return types[d.Type].color; })
                        .attr('cx', d => x(d.Speed))
                        .attr('cy', d => y(d.SMPG)),
                    update => update
                        .call(update => update.transition(slow)
                            .attr('fill', d => { return types[d.Type].color; })
                            .attr('cx', d => x(d.Speed))
                            .attr('cy', d => y(d.SMPG))
                        ),
                    exit => exit.call(exit => exit.remove())
                );


        }
    }

    function reFilterRows(sourceRows, typeString) {
        return sourceRows.filter(r => {
            if (typeString === TYPE_ALL) {
                return true
            } else {
                return r.Type === type;
            }
        });
    }

    onMount(() => {


        let box = document.getElementById('js-svg-container');
        let boxWidth = Math.round(box.offsetWidth - 2);
        let width = boxWidth - margin.left - margin.right - radius * 2;
        let height = Math.round(width * .61 - radius * 2);

        csv('aircraft_data.csv', autoType).then(data => {
            rows = data;

            let speeds = data.map(d => { return d.Speed; });
            let smpg = data.map(d => { return d.SMPG; });

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

            circles = svg.selectAll('circle')
                .data(data)
                .join('circle')
                .attr('r', radius)
                .attr('fill', d => { return types[d.Type].color; })
                .attr('cx', d => x(d.Speed))
                .attr('cy', d => y(d.SMPG))
                .on('click', e => { alert(JSON.stringify(e.target["__data__"])) });

            let scaleXAxis = axisBottom()
                .scale(x);

            let axisX = svg.append("g")
                .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
                .call(scaleXAxis);

            let scaleYAxis = axisLeft()
                .scale(y);

            let axisY = svg.append("g")
                .attr('transform', 'translate(' + margin.left + ', 0)')
                .call(scaleYAxis);

            headline = 'Owner-flown Aircraft Fuel Efficiency';
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
        margin: 0 auto;
    }
</style>
<div class="container">
    <h1>{headline}</h1>
    <label>
        Types:
        <select bind:value={type}>
            <option value={TYPE_ALL}>Show all</option>
            {#each Object.keys(types) as id}
                <option value={id}>{types[id].name}</option>
            {/each}
        </select>
    </label>
    <div id="js-svg-container"></div>
    {#if !loading}
        {#each filteredRows as row}
            <div>{row.Airplane}</div>
        {/each}
    {/if}
</div>
