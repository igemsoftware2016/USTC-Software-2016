
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

function postForm(){
    var formData = JSON.stringify($('form').serializeObject());
    var  dictPost  =  [{"plugin":"user_model"},{"action":"validate_login"},{"data":formData}];
    console.log(dictPost);
    $.ajax({
        type: "POST",
        url: "/plugin",
        data: JSON.stringify(dictPost),
        success: function(response){
            console.log(response);
            if(response['error'] == 'a1'){
                Materialize.toast('Account or Password Error', 3000, 'rounded');
            }
        },
        dataType: "json",
        contentType : "application/json"
    });
}

function postForm_sign_up(){
    var formData = JSON.stringify($('form').serializeObject());
    var  dictPost  =  [{"plugin":"user_model"},{"action":"create_user"},{"data":formData}];
    console.log(dictPost);
    $.ajax({
        type: "POST",
        url: "/plugin",
        data: dictPost,
        success: function(){
            if(response['error'] == 'a2'){
                Materialize.toast('Email already registered!!', 3000, 'rounded');
            }
        },
        dataType: "json",
        contentType : "application/json"
    });
}
