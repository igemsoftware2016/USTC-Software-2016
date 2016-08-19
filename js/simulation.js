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
    });
});