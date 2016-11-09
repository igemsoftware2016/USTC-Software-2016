/**
 * Created by Pjer on 10/3/2016.
 *
 *  haha
 */
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var status_jump = "local";

function auto_input() {
    if (status_jump =="local"){

        var seq = $('#sequence')[0];
        seq.value = "acaagatacattgtgatactgaaaatacatgtgcagagaaa";
        Materialize.updateTextFields();
    }
}

function blast_req(){
    var s_data = ($('#form_bl').serializeObject());
    //console.log(s_data);
    var  dictPost  =  {"plugin":"BLAST","seq":s_data["sequence"]};

    $("#result_blast")[0].innerHTML="";
    myLoader();
    //console.log(dictPost);
    if(dictPost.seq.length>0) {
        $.ajax({
            type: "POST",
            url: "/plugin/",
            data: dictPost,
            success: function (response) {
                var Jr = JSON.parse(response);
                if (Jr['success'] == true) {

                    d3.selectAll('svg_blast_ct').remove();
                    d3.selectAll('#svg_blast').remove();
                    var data_res = Jr['result'];
                    var res_width = 500;
                    var res_height = 500;
                    var svg_container = d3.select('#result_blast').append('svg')
                        .attr('width', res_width + 285)
                        .attr('height', res_height + 125)
                        .attr("id","svg_blast")
                        .attr("class","svg_blast_ct");

                    var svg = svg_container.append("g")
                        .attr("transform", "translate(" + res_width / 2 + "," + res_height / 2 + ")");
                    glo_draw(svg,data_res.slice(0,22),s_data["sequence"].length);


                    //get the result ready for everyone
                    console.log("successfully request")
                }
                else {
                    Materialize.toast(Jr['error'], 3000, 'rounded');
                }
            }
        })
    }else {
        alert("input a codon sequence to BLAST")
    }
}

// initial blast data (should be from serve)

var raw_data={"q_length":46,"blast_result":[]};


console.log(raw_data);
result = raw_data["blast_result"];
q_len = raw_data["q_length"];
sample = result[0];

var text_start;
var text_end;
var radius;
var arc_k;
var color;
var root_text;
var text_info;
var text_benchmark;

var draw_arcs = function(svg,target_id,q_start,q_end,hit_start,hit_end){


    color = d3.scale.linear()
        .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
        .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });


    var deg2arc  = function (arc){
        return arc*Math.PI/180
    };
    var res_width = 500;
    var res_height = 500;

    var radius = Math.min(res_width, res_height) / 1.9;

    var arc_root = d3.svg.arc()
        //.startAngle(deg2arc(0.5))
        //.endAngle(deg2arc(359.5))
        .innerRadius(0.78 * radius)
        .outerRadius(0.50 * radius)
        .cornerRadius(10);

    arc_k = d3.svg.arc()
        //.startAngle(deg2arc(360*hit_start/(q_end-q_start+1)))
        //.endAngle(deg2arc(360*hit_end/(q_end-q_start+1)))
        .innerRadius(0.9 * radius)
        .outerRadius(0.8 * radius)
        .cornerRadius(9);



    var total = raw_data["q_length"];

    svg.append("path")
        .datum({endAngle:deg2arc(359),startAngle:deg2arc(1)})
        .attr("d",arc_root)
        .attr("fill",function (d) {
            return "#006666";//color(0.4)
        })
        .attr("id","root_path");

    root_text=svg.append("text")
        .attr("dy", "3.35em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .append("textPath")
        .attr("startOffset", "0%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#root_path")
        .text( "Original  Sequence VS "+target_id)
        .attr("style","font-size:24px;font-family:consolas")
        .attr("fill","white");

    text_info=svg.append("text")
        .attr("dy", "3.35em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .attr("x",-225)
        .attr("y",250);

    text_benchmark=svg.append("text")
        .attr("dy", "3.35em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .attr("x",-50)
        .attr("y",-20);


    svg.append("text")
        .attr("dy", "1.35em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .append("textPath")
        .attr("startOffset", "1.2%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#root_path")
        .text( "Start point")
        .attr("style","font-size:14px;font-family:consolas")
        .attr("fill","white");

    svg.append("text")
        .attr("dy", "1.35em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .append("textPath")
        .attr("startOffset", "52%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#root_path")
        .text( "End point")
        .attr("style","font-size:14px;font-family:consolas")
        .attr("fill","white");



    var arc_ret=svg.append("path")
        .datum({endAngle:deg2arc(360*hit_end/(q_end-q_start+1)),startAngle:deg2arc(360*hit_start/(q_end-q_start+1))})
        .attr("d",arc_k)
        .attr("fill",function (d) {
            return color(0.99)
        })
        .attr("id","hit_path");


    text_start = svg.append("text")
        .attr("dy", "1.15em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .append("textPath")
        .attr("startOffset", "0%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#hit_path")
        .text(hit_start)
        .attr("style","font-size:14px;font-family:consolas")
        .attr("fill","white");

    text_end = svg.append("text")
        .attr("dy", "1.15em")
        .attr("dx", "2.15em")
        .style("text-anchor", "end")
        .append("textPath")
        .attr("startOffset", "53.2301%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#hit_path")
        .text(hit_end)
        .attr("style","font-size:14px;font-family:consolas")
        .attr("fill","white");


    var c_start = svg.append("circle")
        .attr("cx",17)
        .attr("cy",-0.72*radius)
        .attr("r",8)
        .attr("fill","black");

    var e_start = svg.append("circle")
        .attr("cx",-17)
        .attr("cy",-0.72*radius)
        .attr("r",8)
        .attr("fill","black");

   /** data_map = [];
    var len = 50;
    for (var num_i = 0;num_i<len;num_i++){
        data_map.push({"value":num_i/len});
        svg
            .append("rect")
            .attr("x",len*8)
            .attr("y",100)
            .attr("width",8)
            .attr("height",8)
            .attr("fill",color(num_i/len))
    }
*/


    return arc_ret
};


function arcTween(start_n,end_n) {
    return function(d) {
        var interpolate_end = d3.interpolate(d.endAngle, end_n);
        var interpolate_begin = d3.interpolate(d.startAngle, start_n);
        return function(t) {
            d.endAngle = interpolate_end(t);
            d.startAngle = interpolate_begin(t);
            return arc_k(d);
        }
    }
}






function glo_draw(svg,data_result,ori_length) {
    

    ori_length = ori_length+0.001;
    var current_data = data_result[0];
    var current_start = data_result[0].query_start;
    var current_end = data_result[0].query_end;
    
    var arc_ret = draw_arcs(svg,current_data.ID,0,ori_length,current_start,current_end);
    

    var res_data_enter = svg.append("g").selectAll("text")
        .data(data_result)
        .enter();

    var rec = res_data_enter.append("rect")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("x",250)
        .attr("y", function (d,i) {
            return i*24-249
        })
        .attr("width", 250)
        .attr("height", 20)
        .attr("fill",function (d) {
            console.log(color((d.query_end-d.query_start)/ori_length));
            return color((d.query_end-d.query_start)/ori_length)
        })
        .attr("id",function (d,i) {
            return "rectangle_" + i;
        })
        .on("mouseover", function(d,i){
                renew_graph(d,i);
                renew_label(d,i)
            }
        ).on("mouseout",function (d,i) {
            flash_label(d,i)
        }).attr("stroke","white").attr("stroke-width",3)
        .on("click",function (d,i) {
            window.open('https://www.ncbi.nlm.nih.gov/gquery/?term='+encodeURIComponent(d.ID));
        });

    var text = res_data_enter.append("text")
        .text(function (d) {return d.ID})
        .attr("x",260)
        .attr("y",function (d,i) {
            return i*24-234
        })
        .attr("pointer-events", "none")
        .classed('noselcect',true);


    function flash_label(d,i) {
        d3.selectAll("#rectangle_"+i).attr("stroke","white").attr("stroke-width",3);
        d3.selectAll("#rectangle_"+i)
            .transition().duration(200).attrTween("width",function (d,i,a) {
            return d3.interpolate(a,250);


        });
    }

    function renew_label(d,i) {
        d3.selectAll("#rectangle_"+i).attr("stroke","yellow").attr("stroke-width",3);
        d3.selectAll("#rectangle_"+i)
            .transition().duration(200).attrTween("width",function (d,i,a) {
            return d3.interpolate(a,270)
        });


    }


    function renew_graph(d) {
        arc_ret.transition().duration(300)
            .attrTween("d", arcTween(d.query_start*Math.PI*2/ori_length,d.query_end*Math.PI*2/ori_length)).each("end",function () {
            text_end.text(d.query_end);
            text_start.text(d.query_start);
            root_text.text("Original Sequence VS" + d.ID);
            text_info.text("Description : "+d.description);
            text_benchmark.text("E-value: "+d.evalue);
            arc_ret.attr("fill", color((d.query_end-d.query_start)/ori_length))
        })

    }




}




function loader(config) {
    return function() {
        var radius = Math.min(config.width, config.height) / 2;
        var tau = 2 * Math.PI;

        var arc = d3.svg.arc()
            .innerRadius(radius*0.6)
            .outerRadius(radius*0.9)
            .cornerRadius(10)
            .startAngle(0);

        var svg = d3.select(config.container).append("svg")
            .attr("id", config.id)
            .attr("width", config.width)
            .attr("height", config.height)
            .append("g")
            .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")")

        var background = svg.append("path")
            .datum({endAngle: 0.33*tau})
            .style("fill", "#4a9c47")
            .attr("d", arc)
            .call(spin, 1500);

        function spin(selection, duration) {
            selection.transition()
                .ease("linear")
                .duration(duration)
                .attrTween("transform", function() {
                    return d3.interpolateString("rotate(0)", "rotate(360)");
                });

            setTimeout(function() { spin(selection, duration); }, duration);
        }

        function transitionFunction(path) {
            path.transition()
                .duration(7500)
                .attrTween("stroke-dasharray", tweenDash)
                .each("end", function() { d3.select(this).call(transition); });
        }

    };
}


var myLoader = loader({width: 500, height: 500, container: "#result_blast", id: "svg_blast"});




window.onload=(function () {

        //console.log(raw_data);

        var res_width = 500;
        var res_height = 500;
        var svg_container = d3.select('#result_blast').append('svg')
            .attr('width', res_width + 280)
            .attr('height', res_height + 200)
            .attr("id","svg_blast");
        
        var svg = svg_container.append("g")
            .attr("transform", "translate(" + res_width / 2 + "," + res_height / 2 + ")");

        svg_container.remove();

    }
);


