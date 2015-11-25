var msg_city = "This field should not be empty and can contain only letters!";
var msg_unavailable = "The forecast service is now unavailable! Please, try later.";
var msg_api_error = "Incorrect call of the forecast API! Check city you have entered and try again.";

function displayData(data) {
    var days = Number($("#wf-days").val());

    $("#chart")[0].remove();
    var canvas = document.createElement("canvas");
    canvas.id = "chart";
    canvas.setAttribute("width", "900");
    canvas.setAttribute("height", "500");
    $("#main").append(canvas);
    canvas = canvas.getContext("2d");

    var gLabels = [];
    var gDataDay = [];
    var gDataNight = [];
    var atzero = true;
    var isnight = $("#wf-night")[0].checked;
    for (var i = 0; i < days; i++) {
        gLabels.push(data[i].day + " - " + data[i].date);
        gDataDay.push(data[i].high);
        if (data[i].high < 0) {
            atzero = false;
        }
        if (isnight) {
            gDataNight.push(data[i].low);
            if (data[i].low < 0)
                atzero = false;
        }
    }

    var graphdata = {
        labels: gLabels,
        datasets: [
            {
                label: "Day Temperatures",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: gDataDay
            }
        ]
    };
    if (isnight) {
        var night = {
            label: "Night Temperatures",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: gDataNight
        }
        graphdata.datasets.push(night);
    }

    var graphoptions = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero : atzero,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - If there is a stroke on each bar
        barShowStroke : true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth : 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing : 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing : 2,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };
    var graph = new Chart(canvas).Bar(graphdata, graphoptions);

}

function displayError(message, element) {
    var error = document.createElement("div");
    error.className = "error-message";
    error.innerHTML = message;
    element.appendChild(error);
}

$("form").submit(
    function (event) {
        event.preventDefault();
        var city = $("#wf-city").val();

        var re = /^[\w]*$/;
        if (!city.match(re)) {
            displayError(msg_city, $(".city")[0]);
            return;
        }

        var tunit = "";
        if ($("#wf-temp1")[0].checked)
            tunit = "%20and%20u%3D%22c%22";
        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"
            + city + "%22)" + tunit + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

        $.getJSON(url, function (result) {
            if ("error" in result) {
                displayError(msg_api_error, $("form")[0]);
            }
            displayData(result.query.results.channel.item.forecast);
        })
        .fail(function () {
            displayError(msg_unavailable, $("form")[0]);
        });
});