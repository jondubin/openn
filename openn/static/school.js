function graphUserSchoolData() {
    $.ajax({
        url: "/userSchoolData", 
        datatype: 'json', 
        method: 'GET'
    }).done(function(data) {
        userSchoolData(data.schoolData, '#schoolContainer', ['#0D16FF', '#B20CE8', '#E8690C', '#FFCE2F']);
        userSchoolData(data.yearData, '#yearContainer', ['#0DB9FF', '#E82F0C', '#8D0DFF', '#7CE873']);
    })
}

function userSchoolData(input, div, colors) {
    $(div).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotShadow: false
        },
        colors: colors,
        title: {
            text: 'School Distribution of Openn Users'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: input
        }]
    });
}


