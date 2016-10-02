/**
 * Created by Pjer1 on 10/2/2016.
 */

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
                window.location="login-1.html"
            }
            else {
                Materialize.toast(Jr['error'], 3000, 'rounded');
            }
        }
    });
}