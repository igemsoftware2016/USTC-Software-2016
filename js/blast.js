/**
 * Created by Pjer1 on 10/3/2016.
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


function blast_req(){
    var s_data = ($('#form_bl').serializeObject());
    console.log(s_data);
    var  dictPost  =  {"plugin":"blast","action":"req","sequence":s_data["sequence"]};
    console.log(dictPost);
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: dictPost,
        success: function(response){
            var Jr = JSON.parse(response);
            if(Jr['success']==true) {
                //get the result ready for everyone
            }
            else {
                Materialize.toast(Jr['error'], 3000, 'rounded');
            }
        }
    });
}

// initial blast data (should be from serve)

raw_data={"q_length":46,"blast_result":[{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
'hit_start':21,
'hit_end':67
},
{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
    'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
    'hit_start':21,
    'hit_end':67,
},{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
    'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
    'hit_start':21,
    'hit_end':67,
},{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
    'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
    'hit_start':21,
    'hit_end':67
}]};


console.log(raw_data);
result = raw_data["blast_result"];
sample = result[0];

var text_start;
var text_end;
var radius;
var arc_k;

var draw_arcs = function(svg,target_id,q_start,q_end,hit_start,hit_end){


    var color = d3.scale.linear()
        .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
        .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });


    var deg2arc  = function (arc){
        return arc*Math.PI/180
    };
    var res_width = 500;
    var res_height = 500;

    var radius = Math.min(res_width, res_height) / 1.9,
        armRadius = radius / 12,
        dotRadius = armRadius - 6;

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
            return color(0.4)
        })
        .attr("id","root_path");

    svg.append("text")
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

    svg.append("text")
        .attr("dy", "1.35em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .append("textPath")
        .attr("startOffset", "1.2%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#root_path")
        .text( "start point")
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
        .text( "end point")
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

window.onload=(
    function () {

        var res_width = 500;
        var res_height = 500;
        var svg = d3.select('#result_blast').append('svg')
            .attr('width',res_width)
            .attr('height',res_height+300)
            .append("g")
            .attr("transform", "translate(" + res_width / 2 + "," + res_height / 2 + ")");

        var arc_ret = draw_arcs(svg,'gi|688010384|gb|KM018299.1|',1,146,1,120);
        current_start = 8;
        current_end = 25;


        arc_ret.transition().duration(300).delay(6000)
            .attrTween("d", arcTween(0.3,6)).each("end",function () {
            text_end.text("dsaf");
            text_start.text("asdf");
        });

        console.log(arc_ret);

    }
);