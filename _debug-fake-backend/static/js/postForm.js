
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

    $.ajax({
        type: "POST",
        url: "/validateLogin",
        data: formData,
        success: function(response){
            console.log(response);
            if(response['error'] == 'a1'){

                Materialize.toast('Account not found', 3000, 'rounded');
            }
            if(response['error'] == 'a2'){

                Materialize.toast('Wrong Password', 3000, 'rounded');
            }
        },
        dataType: "json",
        contentType : "application/json"
    });
}

function postForm_sign_up(){
    var formData = JSON.stringify($('form').serializeObject());

    $.ajax({
        type: "POST",
        url: "/signup",
        data: formData,
        success: function(){
            if(response['error'] == 'a2'){
                Materialize.toast('Email already registered!!', 3000, 'rounded');
            }
        },
        dataType: "json",
        contentType : "application/json"
    });
}
