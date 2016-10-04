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
        .startAngle(deg2arc(0.5))
        .endAngle(deg2arc(359.5))
        .innerRadius(0.78 * radius)
        .outerRadius(0.50 * radius)
        .cornerRadius(10);

    var arc_k = d3.svg.arc()
        .startAngle(deg2arc(360*hit_start/(q_end-q_start+1)))
        .endAngle(deg2arc(360*hit_end/(q_end-q_start+1)))
        .innerRadius(0.9 * radius)
        .outerRadius(0.8 * radius)
        .cornerRadius(armRadius-3);



    var total = raw_data["q_length"];

    svg.append("path")
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
        .attr("startOffset", "52.5%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#root_path")
        .text( "end point")
        .attr("style","font-size:14px;font-family:consolas")
        .attr("fill","white");



    svg.append("path")
        .attr("d",arc_k)
        .attr("fill",function (d) {
            return color(0.99)
        })
        .attr("id","hit_path");


    svg.append("text")
        .attr("dy", "1.15em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .append("textPath")
        .attr("startOffset", "1.2%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#hit_path")
        .text(hit_start)
        .attr("style","font-size:14px;font-family:consolas")
        .attr("fill","white");

    svg.append("text")
        .attr("dy", "1.15em")
        .attr("dx", ".75em")
        .style("text-anchor", "start")
        .append("textPath")
        .attr("startOffset", "48.0%")
        .attr("class", "arc-text")
        .attr("xlink:href", "#hit_path")
        .text(hit_end)
        .attr("style","font-size:14px;font-family:consolas")
        .attr("fill","white");


    var c_start = svg.append("circle")
        .attr("cx",17)
        .attr("cy",-0.72*radius)
        .attr("r",8)
        .attr("fill","black")

    var e_start = svg.append("circle")
        .attr("cx",-17)
        .attr("cy",-0.72*radius)
        .attr("r",8)
        .attr("fill","black")

};

window.onload=(
    function () {

        var res_width = 500;
        var res_height = 500;
        var svg = d3.select('#result_blast').append('svg')
            .attr('width',res_width)
            .attr('height',res_height)
            .append("g")
            .attr("transform", "translate(" + res_width / 2 + "," + res_height / 2 + ")");


        draw_arcs(svg,'gi|688010384|gb|KM018299.1|',1,46,8,25)


    }
);