
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
    var formData = ($('form').serializeObject());
    console.log(formData);
    var  dictPost  =  {"plugin":"user_model","action":"validate_login","email":formData["email"],"password":formData["password"],"remember":formData["remember"]};
    console.log(dictPost);
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: (dictPost),
        success: function(response){
            var Jr = JSON.parse(response);
            if(Jr['success']==true) {
                window.location="projects.html"
            }
            else {
                Materialize.toast(Jr['error'], 3000, 'rounded');
            }
        }
    });
}

function postForm_sign_up(){
    var FormData = ($('form').serializeObject());
    var  dictPost  =  {"plugin":"user_model","action":"create_user","email":FormData["email"],"password":FormData["passwd"],"username":FormData["username"]};
    console.log(dictPost);
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: dictPost,
        success: function(response){
            var Jr = JSON.parse(response);
            if(Jr['success']==true) {
                window.location="projects.html"
            }
            else {
                Materialize.toast(Jr['error'], 3000, 'rounded');
            }
        }
    });
}

function logout_form(){
    var  dictPost  =  {"plugin":"user_model","action":"logout"};
    console.log(dictPost);
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: dictPost,
        success: function(response){
            var Jr = JSON.parse(response);
            if(Jr['success']==true) {
                window.location="login.html"
            }
            else {
                Materialize.toast(Jr['error'], 3000, 'rounded');
            }
        }
    });
}

function postForm_enter(e) {
    if (e.keyCode == 13) {
        if (event.which == 13 || event.keyCode == 13) {
            postForm();
            return false;
        }
        return true;
    }
}