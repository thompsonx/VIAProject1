﻿function displayData(data) {
    var s = document.getElementById("wf-city");
    s.value = data[0].date;
}

$("#show").click(
    function (event) {
        var city = $("#wf-city").val();

        if (city == "")
            return;

        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        var days = $("#wf-days").val();

        $.getJSON(url, function (result) {
            displayData(result.query.results.channel.item.forecast);
        });
});