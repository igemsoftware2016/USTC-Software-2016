function getMessageData(){
	var dictPost={"plugin":"profile","action":"get_message_data"};
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

function getFriendData(){
        var dictPost={"plugin":"profile","action":"get_friend_data"};
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

function prepareMsgData(i,obj){
  return function(){
        var id=obj.message[i-1].user_id;
        var hr=obj.message[i-1].usr_src;
        var msg=obj.message[i-1].detail;
        document.getElementById("usr_hr").innerHTML=id;
        document.getElementById("usr_hr").href=hr;
        document.getElementById("usr_msg").innerHTML=msg;
  }
}

function sendAgree(i,obj,bool){
   return function(){
        var user_id=document.getElementById("this_is_a_user_name").innerHTML;
        var friend_id=obj.message[i-1].user_id;
        var dictPost={"plugin":"profile","action":"handle_friend_apply","user_id1":user_id,"user_id2":friend_id,"modify":bool};
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
                                alert("Successfully submitted!");
                        }
                        else{
                                Materialize.toast(jsonResp['error'],2500,'rounded');
                        }
                }
        });
   }
}

function sendResponse(i,obj){
   return function(){
        var user_id=document.getElementById("this_is_a_user_name").innerHTML;
        var friend_id=obj.message[i-1].user_id;
        var res_content=document.getElementById("msg-res").value;
        if(res_content==null||res_content.length==0){
                alert("Empty response!");
                return;
        }
        var dictPost={"plugin":"profile","action":"handle_friend_apply","user_id1":user_id,"user_id2":friend_id,"response":res_content};
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
                                alert("Successfully submitted!");
                        }
                        else{
                                Materialize.toast(jsonResp['error'],2500,'rounded');
                        }
                }
        });
    }
}

function relocate(i,obj){
        return function(){
                window.location(obj.friend[i-1].usr_src);
        }
}