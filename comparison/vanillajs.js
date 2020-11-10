document.addEventListener('DOMContentLoaded', function() {

    let margin = {
        top: 5,
        bottom: 25,
        left: 25,
        right: 5
    };

    let radius = 5;

    let typeColors = {
        E: '#4CB963',
        TD: '#ECD444',
        T: '#D7BCE8',
        NA: '#EF3054',
        JP: '#1E2EDE',
        J: '#7E22cE'
    }

    let box = document.getElementById('js-svg-container');
    let boxWidth = Math.round(box.offsetWidth - 2);
    let width = boxWidth - margin.left - margin.right - radius * 2;
    let height = Math.round(width * .61 - radius * 2);

    d3.csv('aircraft_data.csv', d3.autoType).then(data => {
        let speeds = data.map(d => { return d.Speed; });
        let smpg = data.map(d => { return d.SMPG; });

        let x = d3.scaleLinear()
            .domain([d3.min(speeds), d3.max(speeds)])
            .range([margin.left + radius, boxWidth - margin.right - radius]);

        let y = d3.scaleLinear()
            .domain([d3.max(smpg), d3.min(smpg)])
            .range([margin.top + radius, height - margin.bottom - radius]);

        let svg = d3.select('#js-svg-container')
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
            .style('fill', d => { return typeColors[d.Type]; })
            .on('click', d => { alert(JSON.stringify(d)) })

        let scaleXAxis = d3.axisBottom()
            .scale(x);

        let axisX = svg.append("g")
            .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
            .call(scaleXAxis);

        let scaleYAxis = d3.axisLeft()
            .scale(y);

        let axisY = svg.append("g")
            .attr('transform', 'translate(' + margin.left + ', 0)')
            .call(scaleYAxis);

        data.forEach(d => {
            let el = document.createElement("div")
            let txt = document.createTextNode(d.Airplane + ' - ' + d.Profile);
            el.appendChild(txt);
            box.appendChild(el)
        })
    });
});