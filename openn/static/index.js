$(function() {

    $('#signIn .password').keypress(function(e) {
        if (e.which == 13) {
            login();
        }
    });
    $('#signUp .password').keypress(function(e) {
        if (e.which == 13) {
            createUser();
        }
    });

    $('#signIn .button').click(function() {
        login();
    });

    $('#signUp .button').click(function() {
        createUser();
    })


    function setStorage(val) {
        var customEvent = document.createEvent('Event');
        customEvent.initEvent('setUser', true, true);
        hiddenDiv = document.getElementById('setUserEventDiv');
        $('#setUserEventDiv').text(val);
        hiddenDiv.dispatchEvent(customEvent);
    }
    function createUser() {
        $.ajax({
            url: "/create",
            dataType: 'json',
            method: 'GET',
            data: {
                user: $('#signUp .username').val(),
                password: $('#signUp .password').val(),
                // password2: $('#signup-password2').val()
            }
        }).done(function(data) {
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
                    default:
                        var msg = 'Sorry, we couldn\'t sign you up!';
                }
                $('#signup-errorbox').text(msg).fadeIn('fast');
            } else {
                // Successful sign-up! Let's refresh the page now after logging the user in on the server-side
                setStorage($('#signUp .username').val());
                location.reload();
            }
        });
    }


    function login() {
        $.ajax({
            url: "/authenticate",
            dataType: 'json',
            method: 'GET',
            data: {
                user: $('#signIn .username').val(),
                password: $('#signIn .password').val()
            }
        }).done(function(data) {
            console.log(data);
            if (data.errors) {
                switch (data.errors) {
                    case 'username_none':
                        var msg = 'Please enter a username.';
                        break;
                    case 'pass_none':
                        var msg = 'Please enter a password.';
                        break;
                    default:
                        var msg = 'Sorry, we couldn\'t sign you in. Check your username and password.';
                }
                $('#signin-errorbox').text(msg).fadeIn('fast');
            } else {
                setStorage($('#signIn .username').val());
                console.log('success');
                // Successful sign-up! Let's refresh the page now after logging the user in on the server-side
                location.reload();
            }
        });
    }

});
