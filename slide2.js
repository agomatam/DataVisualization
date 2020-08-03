async function init() {
    // This is for the chart1

    var margin = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40
        },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg1 = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "none")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");




    wine_price_data = d3.csv("data/winemag-points-data.csv", function (data) {


        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)
        console.log(subgroups)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) {
            return (d.group)
        }).keys()


        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, 600 - margin.left - margin.right])
            .padding([0.2])

        // gridlines in X axis function
        function make_x_gridlines() {
            return d3.axisBottom(x).ticks(5)

        }

        // gridlines in Y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y).ticks(13)

        }

        // add the X gridlines
        svg1.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "grid")
            .call(make_x_gridlines()
                .tickSize(-height))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        var dollarFormat = function (d) {
            return '$' + d3.format(',.0f')(d)
        };


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([80, 94])
            .range([height, 0]);


        svg1.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width))


        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.25])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#ca0020", "#f4a582", "green", "#92c5de", "#0571b0", "pink"]);

        // Show the bars
        svg1.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + x(d.group) + ",0)";
            })
            .selectAll("rect")
            .data(function (d) {
                return subgroups.map(function (key) {
                    return {
                        key: key,
                        value: d[key]
                    };
                });
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return xSubgroup(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", function (d) {
                return color(d.key);
            });

        //Legend Stuff      

        var legspacing = 25;

        var legend = svg1.selectAll(".legend")
            .data(subgroups)
            .enter()
            .append("g")

        legend.append("rect")
            .attr("fill", color)
            .attr("width", 20)
            .attr("height", 20)
            .attr("y", function (d, i) {
                return i * legspacing;
            })
            .attr("x", width - 100);

        legend.append("text")
            .attr("class", "label")
            .attr("y", function (d, i) {
                return i * legspacing + 15;
            })
            .attr("x", width - 70)
            .attr("text-anchor", "start")
            .text(function (d, i) {
                return subgroups[i];
            });

        console.log(subgroups)
        subgroups.forEach(function (d) {
            d[subgroups[0]] = +d[subgroups[0]];
            d[subgroups[1]] = +d[subgroups[1]];
            d.vals = subgroups.map(function (name) {
                return {
                    name: name,
                    value: +d[name]
                };
            });
        });
        
        // ==== LEFT ====== //
            const annotations = [
                {
                    note: {
                        label: "Signficant high ratings(points) of Portugal wine compared to price"
                        //title: "Points to Price Comparison"
                    },
                    type: d3.annotationCalloutRect,
                    subject: {
                        width: 20,
                        height: 30
                    },
                    color: ["red"],
                    x: 20,
                    y: 10,
                    dy: 10,
                    dx: 300
  }
                    ]
            // Add annotation to the chart
            const makeAnnotations = d3.annotation()
                .annotations(annotations)
            svg1.append("g")
                .call(makeAnnotations)
        
        // Label layer
        var label = svg1.append('g')
            .attr('transform', 'translate(' + [margin.left - 20, margin.top] + ')');

        label.append('text')
            .text('Points')
            .attr('transform', 'rotate(-90)')
            .attr({
                'text-anchor': 'start',
                x: 10,
                y: 80,
            })
        var xlabel = svg1.append('g')
            .attr('transform', 'translate(' + [width - margin.right - 40, height + 20] + ')');

        xlabel.append('text')
            .text('Varietals')
            .attr({
                'text-anchor': 'start',
                x: 20,
                y: 80,
            })



    })

    // This is for Chart 2

    var svg2 = d3.select("#my_dataviz2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "none")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    wine_price_data = d3.csv("data/winemag-price-data.csv", function (data) {


        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)
        console.log(subgroups)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) {
            return (d.group)
        }).keys()


        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, 600 - margin.left - margin.right])
            .padding([0.2])
        
            var dollarFormat = function (d) {
            return '$' + d3.format(',.0f')(d)
        };


        // gridlines in X axis function
        function make_x_gridlines() {
            return d3.axisBottom(x).ticks(5)

        }

        // gridlines in Y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y).ticks(13).tickFormat(dollarFormat)

        }

        // add the X gridlines
        svg2.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "grid")
            .call(make_x_gridlines()
                .tickSize(-height))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

    

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([5, 100])
            .range([height, 0]);


        svg2.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width))


        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.25])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#ca0020", "#f4a582", "green", "#92c5de", "#0571b0", "pink"]);

        // Show the bars
        svg2.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + x(d.group) + ",0)";
            })
            .selectAll("rect")
            .data(function (d) {
                return subgroups.map(function (key) {
                    return {
                        key: key,
                        value: d[key]
                    };
                });
            })
            .enter().append("rect")
            .attr("class", "lineTest")
            .attr("x", function (d) {
                return xSubgroup(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", function (d) {
                return color(d.key);
            });




        //Legend Stuff      

        var legspacing = 25;

        var legend = svg2.selectAll(".legend")
            .data(subgroups)
            .enter()
            .append("g")

        legend.append("rect")
            .attr("fill", color)
            .attr("width", 20)
            .attr("height", 20)
            .attr("y", function (d, i) {
                return i * legspacing;
            })
            .attr("x", width - 100);

        legend.append("text")
            .attr("class", "label")
            .attr("y", function (d, i) {
                return i * legspacing + 15;
            })
            .attr("x", width - 70)
            .attr("text-anchor", "start")
            .text(function (d, i) {
                return subgroups[i];
            });

        console.log(subgroups)
        subgroups.forEach(function (d) {
            d[subgroups[0]] = +d[subgroups[0]];
            d[subgroups[1]] = +d[subgroups[1]];
            d.vals = subgroups.map(function (name) {
                return {
                    name: name,
                    value: +d[name]
                };
            });
        });
        
        // ==== LEFT ====== //
            const annotations = [
                {
                    note: {
                        label: "Signficant low selling price of the Portugal wine compared to ratings (points)"
                        //title: "Points to Price Comparison"
                    },
                    type: d3.annotationCalloutRect,
                    subject: {
                        width: 20,
                        height: 30
                    },
                    color: ["red"],
                    x: 20,
                    y: 200,
                    dy: -80,
                    dx: 300
  }
                    ]
            // Add annotation to the chart
            const makeAnnotations = d3.annotation()
                .annotations(annotations)
            svg2.append("g")
                .call(makeAnnotations)
        

        // Label layer
        var label = svg2.append('g')
            .attr('transform', 'translate(' + [margin.left - 20, margin.top] + ')');

        label.append('text')
            .text('Price')
            .attr('transform', 'rotate(-90)')
            .attr({
                'text-anchor': 'start',
                x: 20,
                y: 80,
            })

        var xlabel = svg2.append('g')
            .attr('transform', 'translate(' + [width - margin.right - 40, height + 20] + ')');

        xlabel.append('text')
            .text('Varietals')
            .attr({
                'text-anchor': 'start',
                x: 20,
                y: 80,
            })


    })



    // This is for Chart 3

    var margin = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40
        },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg3 = d3.select("#my_dataviz3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "none")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("#my_dataviz").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    wine_data = d3.csv(
        "data/winemag-data-filtered.csv",
        function (data2) {


            var dollarFormat = function (d) {
                return '$' + d3.format(',.0f')(d)
            };
            var tickFormat = d3.format("s");
            var tickValues = [0, 50, 100, 200, 500, 1000, 2000, 2500];

            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 800])
                .range([0, width]);


            // Add Y axis
            var y = d3.scaleLinear()
                .domain([76, 110])
                .range([height, 0]);


            // gridlines in X axis function
            function make_x_gridlines() {
                return d3.axisBottom(x)
                    .ticks(7)
                    .tickFormat(dollarFormat)
                    .tickValues(tickValues);


            }

            // gridlines in Y axis function
            function make_y_gridlines() {
                return d3.axisLeft(y).ticks(13)

            }

            // add the X gridlines
            svg3.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "grid")
                .call(make_x_gridlines()
                    .tickSize(-height))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-90)");

            svg3.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width))


            // Add dots
            svg3.append('g')
                .selectAll("circle")
                .data(data2)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return x(+d.price);
                })
                .attr("cy", function (d) {
                    return y(+d.points);
                })
                .attr("r", function (d, i) {
                    return 4;
                })
                .style("fill", "steelblue")
                .on("mouseover", function (d) {
                    var html = "<span><b> Country : </b><b>" + d.country + "</b><br><b> Province : </b><b>" + d.province + "</b><br><b> Variety : </b><b>" + d.variety +   "</b><br><b> Points : </b><b>" + d.points + "</b><br><b> Price : </b><b>" + d.price + "</b></span><br/>"
                    tooltip.html(html)
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .transition()
                        .duration(200) // ms
                        .style("opacity", .9) // started as 0!
                })

                // fade out tooltip on mouse out
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                });


            // ==== LEFT ====== //
            const annotations = [
                {
                    note: {
                        label: "Many top rated varietals in the below 50$ range"
                        //title: "Points to Price Comparison"
                    },
                    type: d3.annotationCalloutRect,
                    subject: {
                        width: 40,
                        height: 160
                    },
                    color: ["red"],
                    x: 0,
                    y: 80,
                    dy: 180,
                    dx: 300
  }
                    ]
            // Add annotation to the chart
            const makeAnnotations = d3.annotation()
                .annotations(annotations)
            svg3.append("g")
                .call(makeAnnotations)

            var label = svg3.append('g')
                .attr('transform', 'translate(' + [margin.left - 20, margin.top] + ')');

            label.append('text')
                .text('Points')
                .attr('transform', 'rotate(-90)')
                .attr({
                    'text-anchor': 'start',
                    x: 20,
                    y: 80,
                })

            var xlabel = svg3.append('g')
                .attr('transform', 'translate(' + [width - margin.right, height - 5] + ')');

            xlabel.append('text')
                .text('Price')
                .attr({
                    'text-anchor': 'start',
                    x: 20,
                    y: 80,
                })




        })
}
