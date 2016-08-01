jQuery(function () {

    var margin = {top: -1, right: -1, bottom: -1, left: -1},
        width = 1920 - margin.left - margin.right,
        height = 1080 - margin.top - margin.bottom;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1 / 8, 8])
        .on("zoom", function () {
            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });

    var drag = d3.behavior.drag()
        .origin(function (d) {
            return d; 
        })
        .on("dragstart", function (d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
        })
        .on("drag", function (d) {
            d3.select(this)
                .attr("cx", d.x = d3.event.x)
                .attr("cy", d.y = d3.event.y);
        })
        .on("dragend", function (d) {
            d3.select(this).classed("dragging", false)
                .attr("cx", d.x = Math.round(d.x * 0.1) * 10)
                .attr("cy", d.y = Math.round(d.y * 0.1) * 10);
        });

    var wrapper = d3.select("#image");

    var wrapperBoundingBox = wrapper.node().getBoundingClientRect();

    var svg = wrapper.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (0.5 * wrapperBoundingBox.width - 2 * width) + "," + (0.5 * wrapperBoundingBox.height - 2 * height) + ")scale(4,4)")
        .call(zoom);
    console.log("haha")
    var rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all");

    var container = svg.append("g");

    container.append("g")
        .attr("class", "x-axis")
        .selectAll("line")
        .data(d3.range(0, width, 10))
        .enter().append("line")
        .attr("x1", function(d) { return d; })
        .attr("y1", 0)
        .attr("x2", function(d) { return d; })
        .attr("y2", height);

    container.append("g")
        .attr("class", "y-axis")
        .selectAll("line")
        .data(d3.range(0, height, 10))
        .enter().append("line")
        .attr("x1", 0)
        .attr("y1", function(d) { return d; })
        .attr("x2", width)
        .attr("y2", function(d) { return d; });

    d3.tsv("data/data.tsv", dottype, function(error, dots) {
        dot = container.append("g")
            .attr("class", "dot")
            .selectAll("circle")
            .data(dots)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .call(drag);
    });

    function dottype(d) {
        d.x = +d.x;
        d.y = +d.y;
        return d;
    }

    function zoomed() {
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
});
