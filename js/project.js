function getProjectData(){
	var dictPost={"plugin":"pano","action":"get_project_data"};
	console.log(dictPost);
	var jsonResp=[];
	$.ajax({
		type:"POST",
                url:"/plugin/",
                data:dictPost,
                success:function(response){
        	        console.log(response);
        	        jsonResp=JSON.parse(response);
        	        if(jsonResp['success']==true){
                                for (var i=1;i<=jsonResp.project.length;i++){
                                if (jsonResp.project[i-1].public==true){
                                    jsonResp.project[i-1].private="Public";
                                }
                                else {
                                    jsonResp.project[i-1].private="Private";
                                }
                                if (jsonResp.project[i-1].img_src==""){
                                    jsonResp.project[i-1].img_src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAuUlEQVR4Ae2XP8rCUBAHp5F4gPxBsA45mpUgXkt4Se4Rkc97fIQkhVZrK+JbxGwhujN9Bh77K8IPsWTPkSsXOnYkGLPmjNx5YoUhCX/Igx0LzNgiT9zwBhU1AxLxQEpGQCJOtFT653tEMQUgRxR7LVEjqhkABaLaEGVAVAM5BQ2iOhJFjPSAXeBVPKADfqa+Aw/4Dr53Bx6wD/iZfkZgQgwcidIiBgb0H5CZ/lOClmgYZzxOoMRxjLkBL3E6cltSSnYAAAAASUVORK5CYII=';
                                }
                        }
                        loadproject(jsonResp);
        	        }
        	        else{
                        alert("Error!");
        	        }
                }
	});
}

function add0(m){return m<10?'0'+m:m }
function date(shijianchuo)
{
//shijianchuo是整数，否则要parseInt转换
var time = new Date(shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function get_user_info_by_id(id) {
    var  dictPost  =  {"plugin":"user_model","action":"get_user_data_by_id","user_id":id};
    console.log(dictPost);
    var jsonResp=[];
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: dictPost,
        success: function(response){
            console.log(response);
            jsonResp = JSON.parse(response);
            if(jsonResp['success']==true) {
            }
            else {
                Materialize.toast(jsonResp['error'], 2500, 'rounded');
            }
        }
    });
    return jsonResp;
}

function prepareViewData(i,obj){
    return function(){
        var id=obj.project[i-1].project_name;
        var remark=obj.project[i-1].project_remark;
        var user_id=document.getElementById("this_is_a_user_name").innerHTML;
        var create=obj.project[i-1].create_time;
        var privacy=obj.project[i-1].private;
        var last_update=obj.project[i-1].last_update_time;
        document.getElementById("project_name").innerHTML=id;
        document.getElementById("project_remark").innerHTML=remark;
        document.getElementById("create_user_id").innerHTML=user_id;
        document.getElementById("create_user_date").innerHTML=create;
        document.getElementById("project_state").innerHTML=privacy;
        document.getElementById("update_user_id").innerHTML=id;
        document.getElementById("update_user_date").innerHTML=last_update;
   }
}

function prepareRemoveData(i,obj){
    return function(){
        var id=obj.project[i-1].project_name;
        document.getElementById("remove_project_id").innerHTML=id;
    }
}

function sendRemoveRequest(i,obj){
   return function(){
        var user=document.getElementById("this_is_a_user_name").innerHTML;
        var id=obj.project[i-1].id;
        var dictPost={"plugin":"pano","action":"delete","id":id};
        console.log(dictPost);
        var jsonResp=[];
        $.ajax({
                type:"POST",
                url:"/plugin/",
                data:dictPost,
                success:function(response){
                        console.log(response);
                        jsonResp=JSON.parse(response);
                        if(jsonResp['success']==true){
                                alert('Successfully removed!');
                        }
                        else{
                                Materialize.toast(jsonResp['error'],2500,'rounded');
                        }
                }
        });
    }
}

function sendCreateRequest(){
   return function(){
        var user=document.getElementById("this_is_a_user_name").innerHTML;
        var name=document.getElementById("add_project_name").value;
        var privacy=null;
        if(document.getElementById("add_private_state_private").checked=true){
                privacy=false;
        }
        if(document.getElementById("add_private_state_public").checked=true){
                privacy=true;
        }
        if(name==null||remark==null||privacy==null||name.length==0){
                alert("Please complete the information!");
                return;
        }
        var dictPost={"plugin":"pano","action":"new","title":name,"img":null,"public":privacy,"data":'{"nodes":[],"edges":[]}'};
        console.log(dictPost);
        var jsonResp=[];
        $.ajax({
                type:"POST",
                url:"/plugin/",
                data:dictPost,
                success:function(response){
                        console.log(response);
                        jsonResp=JSON.parse(response);
                        if(jsonResp['success']==true){
                                alert('Successfully created!');
                                window.location="pano.html#"+jsonResp['id'];
                        }
                        else{
                                Materialize.toast(jsonResp['error'],2500,'rounded');
                        }
                }
        });
   }
}