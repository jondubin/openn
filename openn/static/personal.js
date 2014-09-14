$.ajax({
            url: "/personalPerformance",
            dataType: 'json',
            method: 'GET',
            success: function(data) {
            	var parsed_data = $.parseJSON(data);
            	console.log(parsed_data);
            }
})