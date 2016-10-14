/**
 * Created by Pjer1 on 10/5/2016.
 */

var demo="True";

 function upload_file(){

     var waiting=jQuery('#loading');
    waiting.removeClass("hide");
     var btn = jQuery('#upload_btn');
    var f_upload = new FormData();
    f_upload.append('file', $('#pdb-file')[0].files[0]);
    f_upload.append('plugin','ABACUS');
    f_upload.append('demo',demo);
     f_upload.append('amount',jQuery('#amount').value);
     f_upload.append('tag',jQuery('#tag').value);
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
             if(Jr['success']==Jr['success']){//true) {
                 alert('The file has been accepted by server and being processed,it may take some time,we will email to inform you when finished', 3000, 'rounded');
                waiting.addClass(" hide");
                 btn.addClass(" disable");
             }
             else {
                 Materialize.toast('Error : '+Jr['error'], 3000, 'rounded');
                waiting.addClass(" hide");
             }
         }
     });
    //.done(L.addClass("hide"));
    console.log("haha")
}


