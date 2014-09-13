
function logout() {
    $.ajax({
        url: "/logout", 
        dataType: 'json',
        method: 'GET'
    }).done(function() {
        location.reload();
    });
}

$(function() {
    $('#logout').click( function() {
        logout();
    });
}) 