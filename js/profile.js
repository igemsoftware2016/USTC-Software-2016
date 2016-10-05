function getMessageData(){
	var dictPost={"plugin":"user_model","action":"get_message_data"};
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
                                for (var i=1;i<=jsonResp.message.length;i++){
                                  var res=get_user_info_by_id(jsonResp.message[i-1].user_id);
                                   jsonResp.message[i-1].user_name=res.user_name;
                                   jsonResp.message[i-1].avt_src=res.avt_src;
                           }
        	        }
        	        else{
        		        Materialize.toast(jsonResp['error'],2500,'rounded');
        	        }
                }
	});
	return jsonResp;
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

function getFriendData(){
        var dictPost={"plugin":"user_model","action":"get_friend_data"};
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
                                for (var i=1;i<=jsonResp.friend.length;i++){
                                  var res=get_user_info_by_id(jsonResp.friend[i-1].user_id);
                                   jsonResp.friend[i-1].user_name=res.user_name;
                                   jsonResp.friend[i-1].avt_src=res.avt_src;
                                   jsonResp.friend[i-1].user_email=res.user_email;
                           }
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
        var id=obj.message[i-1].user_name;
        var hr="user_name?user_id="+obj.message[i-1].user_id;
        var msg=obj.message[i-1].detail;
        document.getElementById("usr_hr").innerHTML=id;
        document.getElementById("usr_hr").href=hr;
        document.getElementById("usr_msg").innerHTML=msg;
  }
}

function sendAgree(i,obj,bool){
   return function(){
        var friend_id=obj.message[i-1].user_id;
        var dictPost={"plugin":"user_model","action":"response_friend","user_id":friend_id,"modify":bool};
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
                                window.location.reload();
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
        var dictPost={"plugin":"user_model","action":"message","user_id":friend_id,"response":res_content};
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
        window.location("user_data.html?user_id="+obj.friend[i-1].user_id);
}