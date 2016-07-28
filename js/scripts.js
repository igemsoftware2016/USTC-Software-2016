// Focus function for input
_focus = function(elem) {
    var _this = $(elem);
    _this.siblings('.placeholder').addClass('focus');
    _this.siblings('.bottom-liner').addClass('lined');
    _this.siblings('.highlight').addClass('light');
};

// Blur function for input
_blur = function(elem) {
    var _this = $(elem);

    // Reset hightlight for input
    _this.siblings('.highlight').addClass('no-light');
    setTimeout(function() {
        _this.siblings('.highlight').removeClass('no-light');
        _this.siblings('.highlight').removeClass('light');
    }, 200);

    // If input is empty return to normal
    if (_this.val() == 0) {
        _this.siblings('.placeholder').removeClass('focus');
        _this.siblings('.bottom-liner').removeClass('lined');
    }
};

$(function() {
    // input On focus
    $('.material-input').on('focus', function() {
        _focus(this);
        $(this).select();
    });

    // input On blur
    $('.material-input').on('blur', function() {
        _blur(this);
    });

    // Enter fake credentials and show button
    $('input#password').on('keyup', function() {
        if (!$('#username').val() <= 0) {
            if ($('input#password').val().length >= 5) {
                $('.btn-custom').removeClass("not-visible");
            }
        }
        if ($('input#password').val().length <= 5) {
            $('.btn-custom').addClass("not-visible");
        }
    });

    // Ripple effect
    $('#flow-button').on("click", function(event) {
        // Get mouse coordinates
        var offset = $(this).offset();
        var MousePosX = (event.pageX - offset.left);
        var MousePosY = (event.pageY - offset.top);

        // Append svg with coordinates in circle element
        $('#flow-button').append('<svg class="ripple-svg" height="100%" width="100%"><circle class="circle" r="10" cy="' + MousePosY + '" cx="' + MousePosX + '" fill="black" /></svg>');

        // Animate the circle radius and opacity with velocity
        $('.ripple-svg:last .circle').velocity({
            r: 300,
            opacity: 0
        }, 600);

        // If there are more than 5, delete all of them but the last one - Wait 600ms (animation time)
        if ($('.ripple-svg').length > 5) {
            setTimeout(function() {
                $('.ripple-svg:not(:last-child)').remove();
            }, 600);
        }
    });

});
