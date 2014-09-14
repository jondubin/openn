var gradesArray = [];


function ajaxCall() {
    $.ajax({
        url: "/search",
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
            };
            searchHistogram();
        }
    });
}



function searchHistogram() {
    $('#containerSearch').highcharts({

        chart: {
            renderTo: 'containerSearch',
            type: 'column'
        },

        title: {
            text: 'Grade Distribution for' + ''
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