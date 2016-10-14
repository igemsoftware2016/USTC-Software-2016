function getEventData(){
    var dictPost={"plugin":"pano","action":"get_event_data"};
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
                get_user_info_by_id(1,jsonResp);
            }
            else{
                alert(jsonResp.error);
            }
        }
    });
}

function get_user_forum(){
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
    Materialize.toast(Jr['error'], 3000, 'rounded');
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
    var num=obj.events.length;
    var  dictPost  =  {"plugin":"user_model","action":"get_user_data_by_id","user_id":obj.events[i-1].user_id};
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
                obj.events[i-1].user_name=jsonResp.user_name;
                obj.events[i-1].avt_src=jsonResp.avt_src;
                if (obj.events[i-1].img_src==""){
                    obj.events[i-1].img_src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAuUlEQVR4Ae2XP8rCUBAHp5F4gPxBsA45mpUgXkt4Se4Rkc97fIQkhVZrK+JbxGwhujN9Bh77K8IPsWTPkSsXOnYkGLPmjNx5YoUhCX/Igx0LzNgiT9zwBhU1AxLxQEpGQCJOtFT653tEMQUgRxR7LVEjqhkABaLaEGVAVAM5BQ2iOhJFjPSAXeBVPKADfqa+Aw/4Dr53Bx6wD/iZfkZgQgwcidIiBgb0H5CZ/lOClmgYZzxOoMRxjLkBL3E6cltSSnYAAAAASUVORK5CYII=';
                }
                loadforum(obj.events[i-1]);
                i++;
                if(i<=num){
                    get_user_info_by_id(i,obj);
                }
                else{
                    var comment_buttons=document.getElementsByClassName("demo-actions-comment");
                    var comment_areas=document.getElementsByClassName("demo-comment");
                    var commentspc_1=document.getElementsByClassName("demo-commentspc_1");
                    for (var j=1;j<=(comment_buttons.length);j++) {
                        if (comment_areas[j-1].style.display=="none") {
                            comment_buttons[j-1].addEventListener("click",changedisplay_1(j));
                        }
                        if (comment_areas[j-1].style.display=="flex") {
                            comment_buttons[j-1].addEventListener("click",changedisplay_2(j));
                        }
                    }
                    
                    var sbmbutton=document.getElementsByClassName("demo-commentsbm");
                    var txtfld=document.getElementsByClassName("demo-comment-input");
                    for (var j=1;j<=sbmbutton.length;j++) {
                        sbmbutton[j-1].addEventListener("click",submitComment(j));
                    }
                }
            }
            else {
                alert(jsonResp['error']);
            }
        }
});
}

function changedisplay_1(i) {
                        return function() {
                            comment_areas[i-1].setAttribute("style","display: flex;");
                            commentspc_1[i-1].setAttribute("style","display: none;");
                            comment_buttons[i-1].addEventListener("click",changedisplay_2(i));
                        }  
                    }
                    function changedisplay_2(i) {
                        return function() {
                            comment_areas[i-1].setAttribute("style","display: none;");
                            commentspc_1[i-1].setAttribute("style","display: block;");
                            comment_buttons[i-1].addEventListener("click",changedisplay_1(i));
                        }  
                    }



function submitComment(i){
    return function() {
        var textfield=document.getElementsByClassName("demo-comment-input");
        var comment=textfield[i-1].value;
        if(comment==null||comment.length==0){
            alert("Empty comment!");
            return;
        }
        var id1=parseInt(document.getElementsByClassName("demo-event-id")[i-1].innerHTML);
        var dictPost={"plugin":"pano","action":"submit_comment","comment":comment,"event_id":id1};
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
                    Materialize.toast(jsonResp['error'],2500,"rounded");
                }
            }
        });
    }
}