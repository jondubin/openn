var gradesArray = [];

function ajaxCall() {
    $.ajax({
        url: "/personalPerformance",
        datatype: 'json',
        method: 'GET',
        success: function(data) {
            var jsonData = data.data;
            gradesArray = data.graphData;
            console.log(gradesArray);
            for (var property in jsonData) {
                var dataClassCode = property;
                var dataClass = dataClassCode.substring(0, dataClassCode.length - 6);
                var semAndYearCode = dataClassCode.substring(dataClassCode.length - 5)
                var year = semAndYearCode.substring(0, 4);
                var sem = semAndYearCode.substring(4);
                if (sem == "A") {
                    sem = "Spring";
                } else if (sem == "B") {
                    sem = "Summer";
                } else {
                    sem = "Fall";
                }
                var dataGrade = jsonData[property][0];
                var dataTitle = jsonData[property][1];
                $("#tableBody").append("<tr><td>" + dataClass + "</td><td>" + dataTitle + "</td><td>" + sem + " " + year + "</td><td>" + dataGrade + "</td></tr>")
            };
            tableSorter();
            personalHistogram();
        }
    });
}

function tableSorter() {
    $.tablesorter.addParser({
        // set a unique id 
        id: 'positions',
        is: function(s) {
            // return false so this parser is not auto detected 
            return false;
        },
        format: function(s) {
            // format your data for normalization 
            return s
                .replace("A+", "a")
                .replace("A", "b")
                .replace("A-", "c")
                .replace("B+", "d")
                .replace("B", "e")
                .replace("B-", "f")
                .replace("C+", "g")
                .replace("C", "h")
                .replace("C-", "i")
                .replace("D+", "j")
                .replace("D", "k")
                .replace("F-", "l")
        },
        // set type, either numeric or text 
        type: 'text'
    });

    $("#personalTable").tablesorter({
        headers: {
            2: {
                sortInitialOrder: 'asc'
            },
            3: {
                sorter: 'positions',
            }
        }
    });
}

function personalHistogram() {
    $('#container').highcharts({

        chart: {
            renderTo: 'container',
            type: 'column'
        },

        title: {
            text: 'Your Personal Grade Distribution'
        },

        legend: {
            enabled: false
        },

        xAxis: {
            categories: ['A+', 'A', 'A', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
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