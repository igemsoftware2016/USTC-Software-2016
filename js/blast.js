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