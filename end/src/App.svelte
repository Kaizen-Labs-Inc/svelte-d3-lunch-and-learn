<script>
    import { csv, autoType, scaleLinear, min, max, select, axisBottom, axisLeft } from 'd3';
    import { onMount } from 'svelte';
    let rows = [];
    let type = 'all';
    let loading = true;
    let headline = "Loading"

    $: filteredRows = reFilterRows(rows, type);

    function reFilterRows(sourceRows, typeString) {
        console.log('refiltering rows for type ' + typeString);
        return sourceRows.filter(r => {
            if (typeString === 'all') {
                return true
            } else {
                console.log(r.Type + " matched")
                return r.Type === type;
            }
        });
    }


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
    onMount(() => {


        let box = document.getElementById('js-svg-container');
        let boxWidth = Math.round(box.offsetWidth - 2);
        let width = boxWidth - margin.left - margin.right - radius * 2;
        let height = Math.round(width * .61 - radius * 2);

        csv('aircraft_data.csv', autoType).then(data => {
            rows = data;

            let speeds = data.map(d => { return d.Speed; });
            let smpg = data.map(d => { return d.SMPG; });

            let x = scaleLinear()
                .domain([min(speeds), max(speeds)])
                .range([margin.left + radius, boxWidth - margin.right - radius]);

            let y = scaleLinear()
                .domain([max(smpg), min(smpg)])
                .range([margin.top + radius, height - margin.bottom - radius]);

            let svg = select('#js-svg-container')
                .append('svg')
                .attr('height', height)
                .attr('width', boxWidth);

            let groups = svg.selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('transform', d => {
                    return 'translate(' + x(d.Speed) + ',' + y(d.SMPG) + ')';
                });

            let circles = groups.append('circle')
                .attr('r', radius)
                .style('fill', d => { return types[d.Type].color; })
                .on('click', d => { alert(JSON.stringify(d)) })

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
    <div id="js-svg-container"></div>
    <label>
        Types:
        <select bind:value={type}>
            <option id="all">Show all</option>
            {#each Object.keys(types) as id}
                <option value={id}>{types[id].name}</option>
            {/each}
        </select>
    </label>
    {#if !loading}
        {#each filteredRows as row}
            <div>{row.Airplane}</div>
        {/each}
    {/if}
</div>
