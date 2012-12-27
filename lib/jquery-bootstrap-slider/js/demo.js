$(function() {
    $( "#slider" ).slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 6,
        value: 6,
        slide: function (event, ui) {
            var skew;
            if (ui.value == 6) {
                skew = "Unlimited BandWidth";
            }
            else {
                skew = ui.value + " Mbps";
            }
            $("#echo").html(skew);
        }
    });
    $("#echo").html("Unlimited BandWidth");
});
