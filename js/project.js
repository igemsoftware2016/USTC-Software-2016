function getProjectData(){
	var dictPost={"plugin":"project","action":"get_project_data"};
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
        	        }
        	        else{
        		        Materialize.toast(jsonResp['error'],2500,'rounded');
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
        var id=obj.project[i-1].project_id;
        var dictPost={"plugin":"pano","action":"delete","user_name":user,"project_name":id};
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
        var remark=document.getElementById("add_project_remark").value;
        var privacy=null;
        if(document.getElementById("add_private_state_private").checked=true){
                privacy="Private";
        }
        if(document.getElementById("add_private_state_public").checked=true){
                privacy="Public";
        }
        if(name==null||remark==null||privacy==null||name.length==0||remark.length==0){
                alert("Please complete the information!");
                return;
        }
        var dictPost={"plugin":"project","action":"new","user_name":user,"project_name":name,"project_remark":remark,"private":privacy};
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
                                window.location="pano.html#"+jsonResp['project_id'];
                        }
                        else{
                                Materialize.toast(jsonResp['error'],2500,'rounded');
                        }
                }
        });
   }
}