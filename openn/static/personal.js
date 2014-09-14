$.ajax({
            url: "/personalPerformance",
            datatype: 'json',
            method: 'GET',
            success: function(data) {
            	var jsonData = data.data;
            	for (var property in jsonData) {
            		var dataClass = property;
            		var dataGrade = jsonData[property][0];
            		var dataTitle = jsonData[property][1];
            		console.log(dataClass + dataGrade + dataTitle);
            	};
            }
});