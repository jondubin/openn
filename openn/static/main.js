$(function() {

    $('#login .password').keypress(function(e) {
        console.log('hi');
        if (e.which == 13) {
            sendLoginAjax();
        }
    });


    function sendLoginAjax() {
        $.ajax({
            url: "/login/",
            dataType: 'json',
            method: 'POST',
            data: {
                user: $('#login .username').val(),
                password: $('#login .password').val()
            }
        }).done(function(data) {
            console.log(data);
            if (data.errors) {
                switch (data.errors) {
                    case 'username_taken':
                        var msg = 'That username is taken!';
                        break;
                    case 'username_none':
                        var msg = 'Please choose a username.';
                        break;
                    case 'pass_none':
                        var msg = 'Please choose a password.';
                        break;
                    case 'pass_nomatch':
                        var msg = 'Your passwords don\'t match!';
                        break;
                    default:
                        var msg = 'Sorry, we couldn\'t sign you up!';
                }
                $('#signup-errorbox').text(msg).fadeIn('fast');
            } else {
                // Successful sign-up! Let's refresh the page now after logging the user in on the server-side
                // location.reload();
            }
        });
    }

});
