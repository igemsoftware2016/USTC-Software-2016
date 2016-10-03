function getEventData(){
	var dictPost={"plugin":"forum","action":"get_event_data"};
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

function submitComment(i,obj){
	return function() {
		var textfield=document.getElementsByClassName("demo-comment-input");
		var comment=textfield[i-1].value;
        var id1=obj.event[i-1].event_id;
        var id2=document.getElementById("this_is_a_user_name").innerHTML;
		var dictPost={"plugin":"forum","action":"submit_comment","comment":comment,"event_id":id1,"user_id":id2};
		console.log(dictPost);
		var jsonResp=[];
		var user_area=document.getElementsByClassName("demo-comment-other")[i-1];
		var user_item=document.createElement("div");
		user_item.className="demo-icon_text-align_1";
		var user_id=document.createElement("a");
		user_id.href="profile.html";
		user_id.innerHTML=id2;
		user_id.style.color="#00C853";
		user_id.style.textDecoration="none";
		user_id.style.fontSize="16px";
		user_id.style.paddingRight="4px";
        componentHandler.upgradeElement(user_id);
        user_item.appendChild(user_id);
        var user_comment=document.createElement("span");
        user_comment.innerHTML=comment;
        user_comment.style.fontSize="16px";
        user_comment.style.paddingLeft="4px";
        componentHandler.upgradeElement(user_comment);
        user_item.appendChild(user_comment);
        componentHandler.upgradeElement(user_item);
        user_area.appendChild(user_item);
		$.ajax({
			type:"POST",
			url:"/plugin/",
			data:dictPost,
			success:function(response){
				console.log(response);
				jsonResp=JSON.parse(response);
				if(jsonResp['success']==true){
                    alert("Successfully submitted!");
				}
				else{
					Materialize.toast(jsonResp['error'],2500,"rounded");
				}
			}
		});
	}
}

function submitPraise(i,obj,bool){
	return function(){
		var id1=obj.event[i-1].event_id;
    	var id2=document.getElementById("this_is_a_user_name").innerHTML;
		var dictPost={"plugin":"forum","action":"submit_praise","modify":bool,"event_id":id1,"user_id":id2};
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
	}
}