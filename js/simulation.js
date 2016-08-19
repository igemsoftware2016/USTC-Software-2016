/**
 * Created by Pjer1 on 8/19/2016.
 */


$(function () {
    console.log("begin");
    d3.json("data/simu_data.json", function (error, data_graph) {


        var func = d3.selectAll("#functions").append("div")
            .selectAll("div")
            .data(data_graph.nodes)
            .enter()
            .append("div")
            .attr("class","card row");

        func.append("div")
            .attr("class","col m2 s4")
            .attr("style","margin-top:15px")
            .attr("lang","latex")
            .append("img")
            .attr("src",function (d,i) {
                console.log(i);
                console.log(d);
                src_str = "http://latex.codecogs.com/gif.latex?\\frac{dy_{"
                    +   d.id
                    + "}}{dx} \\quad=";
                return src_str
            });

        var inp = func.append("div")
            .attr("class","input-field col m10 s20");


        inp.append("input")
            .attr("id",function (d) {
                fnstr = ("input_func"+d.id);
                return fnstr;
            }).attr("type" ,"text");

        inp.append("label").attr("for",function (d) {
            fnstr = "input_func"+d.id;
            return fnstr;
        }).html(function (d) {
            return "ControlFunction"+d.id;
        });

        var data = [{
            "value": ["202","177"],
            "time": "2000"
        }, {
            "value": ["215","167"],
            "time": "2001"
        }, {
            "value": ["179","157"],
            "time": "2002"
        }, {
            "value": ["199","187"],
            "time": "2003"
        }, {
            "value": ["163","187"],
            "time": "2007"
        }, {
            "value": ["176","157"],
            "time": "2010"
        }];


        var vis = d3.select("#visualisation"),
            WIDTH = 600,
            HEIGHT = 500,
            MARGINS = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            },
            xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000,2010]),
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([134,215]),
            xAxis = d3.svg.axis()
                .scale(xScale),

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");



        vis.append("svg:g")
            .attr("class","axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);

        vis.append("svg:g")
            .attr("class","axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        var lineGen_1 = d3.svg.line()
            .x(function(d) {
                return xScale(d.time);
            })
            .y(function(d) {
                return yScale(d.value[0]);
            })
            .interpolate("basis");

        var lineGen_2 = d3.svg.line()
            .x(function(d) {
                return xScale(d.time);
            })
            .y(function(d) {
                return yScale(d.value[1]);
            })
            .interpolate("basis");

        vis.append('svg:path')
            .attr('d', lineGen_1(data))
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        vis.append('svg:path')
            .attr('d', lineGen_2(data))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    });
});