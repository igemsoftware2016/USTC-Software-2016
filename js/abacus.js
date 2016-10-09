/**
 * Created by Pjer1 on 10/5/2016.
 */



 function upload_file(){

     var L=jQuery('#loading');
    L.removeClass("hide");

     $.ajax({
         type: "POST",
         url: "http://code.appendto.com/plugins/jquery-mockjax",
         responseTime: 2000,
         success: function(response){
             var Jr = JSON.parse(response);
             if(Jr['success']==true) {
                 window.location="home.html"
             }
             else {
                 Materialize.toast(Jr['error'], 3000, 'rounded');
             }
         }
     })//.done(L.addClass("hide"));
    console.log("haha")
}


