$(function() {

    $('#login .password').keypress(function(e) {
        if (e.which == 13) {
            login();
        }
    });
    $('#create .password').keypress(function(e) {
        if (e.which == 13) {
            createUser();
        }
    });

    $('#login button').click(function() {
        login();
        setStorage();
    });

    $('#create button').click(function() {
        createUser();
    })


    function setStorage() {
        var customEvent = document.createEvent('Event');
        customEvent.initEvent('setUser', true, true);
        hiddenDiv = document.getElementById('setUserEventDiv');
        hiddenDiv.dispatchEvent(customEvent);
    }
    function createUser() {
        $.ajax({
            url: "/create",
            dataType: 'json',
            method: 'GET',
            data: {
                user: $('#create .username').val(),
                password: $('#create .password').val(),
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


    function login() {
        console.log('hi');
        $.ajax({
            url: "/authenticate",
            dataType: 'json',
            method: 'GET',
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

    function logout() {
        $.ajax({
            url: "/logout", 
            dataType: 'json',
            method: 'GET'
        }).done(function(data) {
            console.log(data);
        });
    }

});
