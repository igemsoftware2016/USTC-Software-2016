
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function postForm(){
    var formData = JSON.stringify($('form').serializeObject());

    $.ajax({
        type: "POST",
        url: "/validateLogin",
        data: formData,
        success: function(){
            console.log(formData);
        },
        dataType: "json",
        contentType : "application/json"
    });
}
