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

function setupCourseSearch() {
    $.ajax({
        url: "/getTags",
        dataType: 'json',
        method: 'GET'
    }).done(function(data) {
        $("#tags").autocomplete({
            source: function(request, response) {
                   var results = $.ui.autocomplete.filter(data.data, request.term);

                   response(results.slice(0, 10));
               }, 
            minlength: 3
        });
        $('#searchButton').click(function() { 
            startGraphing();
        });
        $('#tags').on('keypress', function(e) {
            if (e.which == 13) {
                startGraphing();
            }
        });
    });
   

}

function startGraphing() {
    var term = $('#tags').val();
    console.log(term);
}
$(function() {
    $('#logout').click(function() {
        logout();
    });

})
