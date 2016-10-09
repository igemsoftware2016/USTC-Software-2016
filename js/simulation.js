/**
 * Created by Pjer1 on 8/19/2016.
.
 */


Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m,key,value) {
            vars[key] = value;
        });
    return vars;
}



var data_raw;
var vis;
var status=0;
function vis_data(data,x_max,x_min,y_max,y_min){
    if(status==1){
        vis.remove();}
    var vis_root = d3.select("#visualisation");
    vis=vis_root.append("svg")
        .attr("width",600)
        .attr("height",500);
    var    WIDTH = 600,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([x_min,x_max]),
        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([y_min,y_max]),
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


    status=1;
}
var n_node;
var data_graph_g;

function  run_sim(n,data_graph) {
    var str_func='';
    var str_init='';
    for(var i=0;i<n;i++){
        node = data_graph.nodes[i];
        id_func = "input_func_"+node.id;
        id_init = "input_init_"+node.id;

        str_func+="dy"+node.id+"dx="+document.getElementById(id_func).value;
        str_init+="y"+node.id+"="+document.getElementById(id_init).value;
        if(i!=n-1){
            str_func += "\n";
            str_init += "\n";
        }
    }
    console.log(str_func);
    console.log(str_init);
    var str_post={"plugin":"simulation","eqs":str_func,"init":str_init};
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: str_post,
        success: function(response){
            var Jr = JSON.parse(response);
            if(Jr['success']==true) {
                var meta_data = JSON.parse(Jr['result']);
                var data_res = [];
                var data_all = [];
                var data_t_all = [];
                for (var i = 0;i< meta_data[0].length;i++) {
                    if (i % 20 == 0) {
                        var data_temp = [];
                        for (var j = 0; j < meta_data.length; j++) {
                            data_temp.push(meta_data[j][i]);
                            data_all.push(meta_data[j][i]);
                        }
                        data_res.push({"value": data_temp, "time": i / 200.});
                        data_t_all.push(i/200.);
                    }
                }
                var glo_max = (data_all).max();
                var glo_min = (data_all).min();
                var glo_t_max = (data_t_all).max();
                var glo_t_min = (data_t_all).min();

                console.log(data_res);

                vis_data(data_res,glo_t_max,glo_t_min,glo_max,glo_min);
            }
            else {
                Materialize.toast(Jr['error']+"error", 3000, 'rounded');
            }
        }
    });
}


$(function () {
    console.log("begin");
    d3.json("data/simu_data.json", function (error, data_graph) {


        data_graph_g=data_graph;
        var func_container = d3.selectAll("#functions");
        var func  = func_container.append("div")
            .selectAll("div")
            .data(data_graph.nodes)
            .enter()
            .append("div")
            .attr("class","card row")
            .attr("style","margin:25px");

        func.append("div")
            .attr("class","col m2 s4")
            .attr("style","margin-top:15px")
            .attr("lang","latex")
            .append("img")
            .attr("src",function (d,i) {
                src_str = "http://latex.codecogs.com/gif.latex?\\frac{dy_{"
                    +   d.id
                    + "}}{dx} \\quad=";
                return src_str
            });

        var inp = func.append("div")
            .attr("class","input-field col m10 s12");


        inp.append("input")
            .attr("id",function (d) {
                fnstr = ("input_func_"+d.id);
                return fnstr;
            }).attr("type" ,"text");

        inp.append("label")
            .attr("for",function (d) {
            fnstr = "input_label_func_"+d.id;
            return fnstr;
        }).text(function (d) {
            return "Control Function of index "+d.id;
        });



        func.append("div")
            .attr("class","col m2 s4")
            .attr("style","margin-top:25px")
            .attr("lang","latex")
            .append("img")
            .attr("src",function (d,i) {
                src_str = "http://latex.codecogs.com/gif.latex?y_{"
                    +   d.id
                    + "} \\quad=";
                return src_str
            });

        var inp_1 = func.append("div")
            .attr("class","input-field col m10 s12");


        inp_1.append("input")
            .attr("id",function (d) {
                fnstr = ("input_init_"+d.id);
                return fnstr;
            }).attr("type" ,"text");

        inp_1.append("label").attr("for",function (d) {
            fnstr = "input_label_init_"+d.id;
            return fnstr;
        }).html(function (d) {
            return "Initial Value of index "+d.id;
        });

        func_container
            .append("div")
            .attr("class","center")
            .append("a")
            .attr("class","btn btn-large waves-effect ")
            .html("run!")
            .attr("onclick","run_sim(n_node,data_graph_g)");



        n_node = data_graph.nodes.length;
        console.log(n_node);

        
        

        data_raw = [{
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

        //vis_data(data_raw)


    });
});