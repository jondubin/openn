
function logout() {
    $.ajax({
        url: "/logout", 
        dataType: 'json',
        method: 'GET'
    }).done(function() {
        location.reload();
    });
}
function setStorage(val) {
    var customEvent = document.createEvent('Event');
    customEvent.initEvent('removeUser', true, true);
    hiddenDiv = document.getElementById('setUserRemoveDiv');
    $('#setUserRemoveDiv').text(val);
    hiddenDiv.dispatchEvent(customEvent);
}
$(function() {
    $('#logout').click( function() {
        logout();
    });
}) 