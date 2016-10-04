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

raw_data=[{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
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
}];


console.log(raw_data);

window.onload=(
    function () {
        var res_width = 500;
        var res_height = 500;
        var svg = d3.select('#result_blast').append('svg')
            .attr('width',res_width)
            .attr('height',res_height);
        console.log('start')

    }
);