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
        	        if(jsonResp['success']==true) {
                        if (jsonResp.project.length > 0){
                            get_user_info_by_id(1, jsonResp);
                        }else {

                            document.getElementById("load-spinner").style.display="none";
                            $('#project')[0].innerHTML='<div style="margin-top: 15% ;margin-bottom: 15% "> <span class="mdl-textfield--full-width mdl-color-text--blue-grey-300"><h1>No project.</h1><h2>Try BioHub from creating a project by clicking "+"</h2></span></div>';
                        }
        	        }
        	        else{
                        alert(jsonResp.error);
        	        }
                }
	});
}

function get_user_pro(){
    var  dictPost  =  {"plugin":"user_model","action":"get_user_data"};
    console.log(dictPost);
    var Jr=[];
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: dictPost,
        success: function(response){
            console.log(response);
            Jr = JSON.parse(response);
            if(Jr['success']==true) {
                // load info
                if(Jr.avatar==null){
                    document.getElementById('side-head').setAttribute( 'src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAADFBMVEXFxcX////p6enW1tbAmiBwAAAFiElEQVR4AezAgQAAAACAoP2pF6kAAAAAAAAAAAAAAIDbu2MkvY0jiuMWWQoUmI50BB+BgRTpCAz4G6C8CJDrC3AEXGKPoMTlYA/gAJfwETawI8cuBs5Nk2KtvfiLW+gLfK9m+r3X82G653+JP/zjF8afP1S//y+An4/i51//AsB4aH+/QPD6EQAY/zwZwN8BAP50bh786KP4+VT+3fs4/noigEc+jnHeJrzxX+NWMDDh4g8+EXcnLcC9T8U5S/CdT8bcUeBEIrwBOiI8ki7Ba5+NrePgWUy89/nYyxQ8Iw3f+pWY4h1gb3eAW7sDTPEOsLc7wK1TIeDuDB+I/OA1QOUHv/dFsZQkhKkh4QlEfOULYz2nGj2/Nn1LmwR/86VxlCoAW6kCsHRGANx1RgCMo5Qh2EsZgrXNQZZShp5Liv7Il8eIc5C91EHY2hxk6bwYmNscZIReDBwtCdhbErC1JGBpScBcOgFMLQsZMQs5Whayd+UQsLYsZGlZyNyykKllISNmIUfAwifw8NXvTojAjGFrdYi11SGWVoeYWx1i6lmQCiEjFkKOVgjZ+xxIhZCtFULWHkCqxCw9gNQKmP9vNHzipdEPrRcxtVbAeDkAvve0iM2QozVD9hfjhp4YP/UrkJYDbD2AtBxgfSkAvvHEeNcDSAsilgtAWxIy91J8AXgZAJ5e33+4tuACcAG4AFwALgBXRXQB6AFcB5MXAuA6nl9/0Vx/011/1V5/1/dfTPJvRtdnu/zL6beeFO/7r+fXBYbrEkt/j+i6ytXfpuvvE/ZXOnsA/a3a/l5xf7O6v1t+Xe/vOyz6HpO8yyboM8o7rfJes77bru83THk48p7TvOs27zvOO6/73vO++z7l4cgnMPQzKPopHC0N9noSSz6LJp/Gk88jyicy5TOp6qlc+VyyfDJbPpuuns6XzyfMJzTmMyrrKZ35nNJ8Ums+q7af1tvPK+4nNodEnPKp3fnc8npyez67/qVP7+/fL8hfcMjfsOhf8cjfMclfcnn9+BkOnLECP8Q58OYeyJ40eoyF6Ee/En/JHlP6mIlRVXprF4BxtAvArV0AxtEuALd2ARhHuwDc2gVgHPX/hFv9fMBddjIGeKg/WCxlCsI46u+Ga5mCcJd+sIG9UkGAW32ZbApFAHhod4Bb3eo04h3god0BbiUHYApVCNjbHeBW+QDAXT4a7qg7r7e214057vg0QhkEHkoSwq0kIdydXw4/Q3H8hjYJ3vL0WConBJhCHQaOToeBrU0BljYFmEoVgHGUKgAPnREAt84IgLuqFgAYSUEOAHszDwuAtSkHAZhLGYIpdCLgKGUIHtocZG1zkLmUIRhxDnJU1RDA1uYga5uDzKUOwhTnIEfnxcDe5iBrcyQAYGlzkKkUYhhxDrKXQgxbSwLWUohhbknA1JKAEZOAvSUBW0sC1pYEzC0JmFoSMMJyCDhaFrK3JGDtyiFgaVnI3LKQqWUhI2YhR8tC9paFrC0LWVoWMrcsZGpZyIhZyNGykL2rSIGtlQHWVgZYWhlgbmWAqZUBRiwDHK0MsLcywNbKAGsOoNUhllaHmFsdYmp1iBHrEEerQ+w5gFYI2VodYm11iKXVIeYcQCuETK0QMmIh5MgBtELI3gohWyuErDmAVolZWiFkzgG0SszUKjGjfj6gVmKOVonZcwCtFbB9HQC+ozWDbz1bvGu9iKW1AuYcQOtFTLEX1GbIaFegN0OOHEBrhuw5gNYM2XIArRuz5gDacoB3bTnAEktxXQ4wfw0AvveM8b4tiJjSJOwLIsbXsAKeNeKCiOO3D+AVbUl0AfjGs8ZPbUnIdgFoa1LWC0BblfMuB9AeC1j6gqQE0J9LmC8AOYD2ZMb7i4bt2ZTpWoHfPoB7Tj2fXzT8N1X41vkq/QHOAAAAAElFTkSuQmCC' );
                }
                else {
                    document.getElementById('side-head').setAttribute( 'src', Jr.avatar );
                }
                document.getElementById('user-email').innerHTML=Jr.email;
            }
            else {
                alert(Jr['error']);
            }
            document.getElementById('this_is_a_user_name').innerHTML=String(Jr.id);
        }

    });
}

function add0(m){return m<10?'0'+m:m }
function date(shijianchuo)
{
var time = new Date(1000*shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function get_user_info_by_id(i,obj) {
    var num=obj.project.length;
    var  dictPost  =  {"plugin":"user_model","action":"get_user_data_by_id","user_id":obj.project[i-1].user_id};
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
                 obj.project[i-1].user_name=jsonResp.user_name;
                 if (obj.project[i-1].public==true){
                                    obj.project[i-1].private="Public";
                                }
                                else {
                                    obj.project[i-1].private="Private";
                                }
                                if (obj.project[i-1].img_src==""){
                                    obj.project[i-1].img_src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAuUlEQVR4Ae2XP8rCUBAHp5F4gPxBsA45mpUgXkt4Se4Rkc97fIQkhVZrK+JbxGwhujN9Bh77K8IPsWTPkSsXOnYkGLPmjNx5YoUhCX/Igx0LzNgiT9zwBhU1AxLxQEpGQCJOtFT653tEMQUgRxR7LVEjqhkABaLaEGVAVAM5BQ2iOhJFjPSAXeBVPKADfqa+Aw/4Dr53Bx6wD/iZfkZgQgwcidIiBgb0H5CZ/lOClmgYZzxOoMRxjLkBL3E6cltSSnYAAAAASUVORK5CYII=';
                                }

                get_user_info_by_id_comment(1,obj.project[i-1]);
                loadproject(obj.project[i-1]);
                i++;
                if(i<=num){
                get_user_info_by_id(i,obj);
            }
            else{
                document.getElementById("load-spinner").style.display="none";
                var dialog_remove_project=document.querySelector('.demo-remove-project');
            var show_dialogButtons_remove_project = document.querySelectorAll('.show-dialog-remove-project');
            if (! dialog_remove_project.showModal) {
                dialogPolyfill.registerDialog(dialog_remove_project);
            }
            for (var j=1;j<=(show_dialogButtons_remove_project.length);j++) {
              show_dialogButtons_remove_project[j-1].addEventListener('click', prepareRemoveData(j));
              show_dialogButtons_remove_project[j-1].addEventListener('click', function() {
                dialog_remove_project.showModal();
            });
            }
            var remove_projectButtons=dialog_remove_project.querySelectorAll('.close-dialog-remove-project');
            for (var j=1;j<=(remove_projectButtons.length);j++) {
              remove_projectButtons[j-1].addEventListener('click', function() {
                dialog_remove_project.close();
            });
            }
            var remove_project_control=document.getElementById("remove_project");
            remove_project_control.addEventListener("click",sendRemoveRequest());
            }
            }
            else {
                alert(jsonResp['error']);
            }
        }
    });
}

function prepareRemoveData(i){
    return function(){
        var name=document.getElementsByClassName("demo-titles")[i-1].innerHTML;
        document.getElementById("remove_project_id").innerHTML=name;
        var id=document.getElementsByClassName("demo-projids")[i-1].innerHTML;
        document.getElementById("demo-projid").innerHTML=id;
    }
}

function sendRemoveRequest(){
   return function(){
        var id=parseInt(document.getElementById("demo-projid").innerHTML);
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
                                window.location.reload();
                        }
                        else{
                                alert(jsonResp['error']);
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
        if(document.getElementById("add_private_state_private").checked==true){
                privacy=false;
        }
        if(document.getElementById("add_private_state_public").checked==true){
                privacy=true;
        }
        if(name==null||privacy==null||name.length==0){
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
                                window.location="pano.html?id="+jsonResp['id'];
                        }
                        else{
                                alert(jsonResp['error']);
                        }
                }
        });
   }
}

function get_user_info_by_id_comment(i,obj){
    var num=obj.comment.length;
    if(num!=0){
    var  dictPost  =  {"plugin":"user_model","action":"get_user_data_by_id","user_id":obj.comment[i-1].user_id};
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
                 obj.comment[i-1].user_name=jsonResp.user_name;
                 obj.comment[i-1].src="user_data.html#"+String(jsonResp.id);
                 obj.project_src="pano.html?id="+String(obj.project_id);
                loadcomment(obj,i);
                i++;
                if(i<=num){
                    get_user_info_by_id_comment(i,obj);
                }
            }
            else{
                alert(jsonResp["error"]);
            }
        }
    });
}
}

function loadcomment(obj,i){
    var com=obj.comment[i-1];
    var commentdiv=document.createElement("div");
    commentdiv.className="mdl-cell--12-col demo-icon_text-align";
    commentdiv.style.marginBottom="8px";
    var userlink=document.createElement("a");
    userlink.style.textDecoration="none";
    userlink.style.fontSize="16px";
    userlink.style.color="#00C853";
    userlink.innerHTML=com.user_name+"@";
    userlink.href=com.src;
    componentHandler.upgradeElement(userlink);
    commentdiv.appendChild(userlink);
    var projlink=document.createElement("a");
    projlink.style.textDecoration="none";
    projlink.style.fontSize="16px";
    projlink.style.paddingRight="8px";
    projlink.style.color="#00C853";
    projlink.innerHTML=obj.project_name+":";
    projlink.href=obj.project_src;
    componentHandler.upgradeElement(projlink);
    commentdiv.appendChild(projlink);
    var comment=document.createElement("span");
    comment.style.fontSize="16px";
    comment.innerHTML=com.content;
    componentHandler.upgradeElement(comment);
    commentdiv.appendChild(comment);
    componentHandler.upgradeElement(commentdiv);
    document.getElementById("comments").appendChild(commentdiv);
}
