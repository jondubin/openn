function logout() {
    $.ajax({
        url: "/logout",
        dataType: 'json',
        method: 'GET'
    }).done(function() {
        setStorage();
        location.reload();
    });
}

function setStorage() {
    var customEvent = document.createEvent('Event');
    customEvent.initEvent('removeUser', true, true);
    hiddenDiv = document.getElementById('setUserRemoveDiv');
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

gradesArray = [];
name = "";

function ajaxCallSearchCourse(course) {
    $.ajax({
        url: "/getCourse?course=" + course,
        datatype: 'json',
        method: 'GET',
        success: function(data) {
            gradesArray = data.grades;
            console.log(gradesArray);
            searchHistogram();
        }
    });
}

function ajaxCallSearchProf(prof) {
    $.ajax({
        url: "/getProf?prof=" + prof,
        datatype: 'json',
        method: 'GET',
        success: function(data) {
            gradesArray = data.grades;
            console.log(gradesArray);
            searchHistogram();
        }
    });
}

function startGraphing() {
    var term = $('#tags').val();
    var lastThree = term.slice(-3);
    if (!isNaN(lastThree)) {
        name = term; // contains a number
        ajaxCallSearchCourse(name);
    } else {
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
        name = toTitleCase(term);
        ajaxCallSearchProf(term.replace(/\s+/g, '-'));
    }
}



$(function() {
    $('#logout').click(function() {
        logout();
    });

})


function searchHistogram() {
    $('#containerSearch').highcharts({
        chart: {
            renderTo: 'containerSearch',
            type: 'column'
        },
        title: {
            text: 'Grade Distribution for ' + name
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
        },
        yAxis: {
            title: {
                text: 'Students'
            }
        },
        tooltip: {
            valueSuffix: ' classes',
            pointFormat: '<b>{point.y}</b>',
        },
        plotOptions: {
            column: {
                groupPadding: 0,
                pointPadding: 0,
                borderWidth: 0,
                shadow: true
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '',
            data: gradesArray
        }]
    });

}