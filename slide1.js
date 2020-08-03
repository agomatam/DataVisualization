async function init() {
    var width = 1200,
        height = 550;

    var scale = 150,
        offset = [width / 2, height / 2]

    var projection = d3.geoEquirectangular()
    //var projection = d3.geoNaturalEarth()
        .center([0, 5])
        .scale(scale)
        .rotate([0, 0])
        .translate(offset);

    var svg = d3.select("#my_dataviz").append("svg")
        .attr("width", width)
        .attr("height", height);

    var path = d3.geoPath()
        .projection(projection);

    var g = svg.append("g");

    var tooltip = d3.select("#my_dataviz").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // load and display the World
    d3.json("data/world-110m2.json", function (topology) {

        g.selectAll("path")
            .data(topojson.feature(topology, topology.objects.countries)
                .features)
            .enter().append("path")
            .attr("d", path);

        //var tooltip = d3.select("#chart1")
        // .append("div")
        // .style("position", "absolute")
        // .style("z-index", "10")
        //  .style("visibility", "hidden")
        //  .text("a simple tooltip");

        var tooltip = d3.select("#my_dataviz").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        // load and display the cities
        d3.csv("data/winemag-geo-data.csv", function (data) {
            g.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return projection([d.Longitude, d.Latitude])[0];
                })
                .attr("cy", function (d) {
                    return projection([d.Longitude, d.Latitude])[1];
                })
                .attr("r", 6)
                .style("fill", "steelblue")
                .on("mouseover", function (d) {
                    var html = "<span><b> Country : </b><b>" + d.Country + "</b><br><b> Total Reviews : </b><b>" + d.Total_Reviews + "</b></span><br/>";
                    tooltip.html(html)
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .transition()
                        .duration(100) // ms
                        .style("opacity", .9) // started as 0!
                })

                // fade out tooltip on mouse out
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });


            //.on("mouseover", function() {
            //    return tooltip.style("visibility", "visible");
            //  })
            //  .on("mousemove", function() {
            //      return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            //    })
            //    .on("mouseout", function() {
            //        return tooltip.style("visibility", "hidden");
            //    });



            g.selectAll("text")
                .data(data)
                .enter()
                .append("text") // append text
                .attr("x", function (d) {
                    return projection([d.Longitude, d.Latitude])[0];
                })
                .attr("y", function (d) {
                    return projection([d.Longitude, d.Latitude])[1];
                })
                .attr("dy", -7) // set y position of bottom of text
                .style("fill", "black") // fill the text with the colour black
                .attr("text-anchor", "middle") // set anchor y justification
                .text(function (d) {
                    return d.Country;
                }); // define the text to display

        });
    });

    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function () {
            g.selectAll('path')
                .attr('transform', d3.event.transform);
            g.selectAll("circle")
                .attr('transform', d3.event.transform);
            g.selectAll("text")
                .attr('transform', d3.event.transform);
        });
}
