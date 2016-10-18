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
     f_upload.append('amount',$('#amount')[0].value);
     f_upload.append('tag',$('#tag')[0].value);
     f_upload.append('action','design');
     //console.log(f_upload);
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
                 btn.addClass(" disabled");
                 btn.onclick=function () {}
             }
             else {
                 Materialize.toast('Error : '+Jr['error'], 3000, 'rounded');
                waiting.addClass(" hide");
             }
         }
     });
    //.done(L.addClass("hide"));
    //console.log("haha")
}


function  get_status() {

    var data={"plugin":"ABACUS","action":"getstatus"};
    $.ajax({
        type:"POST",
        url:"/plugin/",
        data:data,
        success:function (response) {
            if (response.length>0){
                var Jr = JSON.parse(response);
                if(Jr.status == "Clean"){
                    alert("Ready to design")
                }
                if(Jr.status == "Failed"){
                    alert("reason : "+Jr.reason)
                }
                if(Jr.status == "Running"){
                    alert("Designing....(be patient)")
                }
                if(Jr.status == "Success"){
                    var sel_s = $('#get_status')[0];
                    sel_s.innerHTML = "Download File";
                    sel_s.href = Jr.url;
                }
            }
            else {alert("please connect to the server Admin for help")}
        }
    })
}
