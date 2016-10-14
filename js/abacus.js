/**
 * Created by Pjer1 on 10/5/2016.
 */

var demo="True";

 function upload_file(){

     var L=jQuery('#loading');
    L.removeClass("hide");
    var f_upload = new FormData();
    f_upload.append('file', $('#pdb-file')[0].files[0]);
    f_upload.append('plugin','ABACUS');
    f_upload.append('demo',demo);
     f_upload.append('amount',1);
     f_upload.append('action','design');
     console.log(f_upload);
     $.ajax({
         type: "POST",
         url: "/plugin/",
         responseTime: 2000,
         data:f_upload,
         processData: false,
         contentType: false,
         success: function(response){
             var Jr = JSON.parse(response);
             if(Jr['success']==true) {
                 window.location="home.html"
             }
             else {
                 Materialize.toast('Error : '+Jr['error'], 3000, 'rounded');
             }
         }
     });
    //.done(L.addClass("hide"));
    console.log("haha")
}


