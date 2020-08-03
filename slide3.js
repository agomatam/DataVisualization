async function init() {

    d3.selectAll('button[name=submitButton]').on('click', function () {
        console.log("inside Submit")

        //var priceValue = this.value;

        priceValue = d3.select('input[name="priceButton"]:checked').node().value

        console.log(priceValue)

        if (priceValue == 'Any') {
            priceValueRange1 = 0;
            priceValueRange2 = 500;
        } else if (priceValue == 'Under10') {
            priceValueRange1 = 0;
            priceValueRange2 = 10;
        } else if (priceValue == 'Under25') {
            priceValueRange1 = 11;
            priceValueRange2 = 25;
        } else if (priceValue == 'Under50') {
            priceValueRange1 = 26;
            priceValueRange2 = 50;
        } else if (priceValue == 'Under100') {
            priceValueRange1 = 51;
            priceValueRange2 = 100;
        } else {
            priceValueRange1 = 101;
            priceValueRange2 = 600;
        }


        console.log(priceValueRange1);
        console.log(priceValueRange2);

        countryValue = d3.select('#countryList option:checked').text()
        console.log(countryValue)

        fetchData(countryValue, priceValueRange1, priceValueRange2)


    });




    /////////////////////////////////////////////////
    // BAR
    /////////////////////////////////////////////////


    // set the dimensions and margins of the graph

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    var width = 1200 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;




    var svg = d3.select("#table-location").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "none")
        .append("g")
        .attr(`transform`,
            "translate(" + margin.left + "," + margin.top + ")");



    // Initilaize the X axis
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);


    var xAxis = d3.axisBottom().scale(x).tickSize(0)

   svg.append("g")
     .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis")

 var dollarFormat = function (d) {
            return '$' + d3.format(',.0f')(d)
        };

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var yAxis = d3.axisLeft().scale(y).tickFormat(dollarFormat)
    
    svg.append("g")
        .attr("class", "myYaxis")

    // Label layer
    var label = svg.append('g')
        .attr('transform', 'translate(' + [margin.left, margin.top + 10] + ')');

    label.append('text')
        .text('Avg. Price')
        .attr('transform', 'rotate(-90)')
        .attr({
            'text-anchor': 'start',
            x: -75,
            y: 10,
        })
    label.append('text')
        .text('** Bars arranged from left to right in the order of Popularity **')
        .attr('transform', 'translate(' + [width / 4, -margin.top - 40] + ')')
        .attr({
            'text-anchor': 'middle',
            'font-size': '1.5em',
            fill: 'steelblue',
        });
            var xlabel = svg.append('g')
            .attr('transform', 'translate(' + [width - margin.right - 40, height + 40] + ')');

        xlabel.append('text')
            .text('Varietals')
            .attr({
                'text-anchor': 'start',
                x: 20,
                y: 80,
            })





    function fetchData(countryValue, priceValueRange1, priceValueRange2) {

        console.log("inside fetch data")
        console.log(countryValue)
        console.log(priceValueRange1)
        console.log(priceValueRange2)

        d3.csv("data/winemag-data-withAverages.csv", function (error, data) {



            //filter country
            var data = data.filter(function (d) {
                return d.Country == countryValue;

            });


            var data = data.filter(function (d) {
                return +d.AvgPrice >= priceValueRange1 && +d.AvgPrice <= priceValueRange2;

            });

            filtered_data = data.slice(0, 10)

            console.log(filtered_data)

            // Update the X axis
            x.domain(filtered_data.map(function (d) {
                return d.Variety;
            }));

            svg.selectAll(".myXaxis").transition()
                .duration(1000)
                .call(xAxis)
            


            // Update the Y axis
            y.domain([priceValueRange1, priceValueRange2]);
            //y.domain([priceValueRange1, priceValueRange2]);

            svg.selectAll(".myYaxis")
                .transition()
                .duration(1000)
                .call(yAxis)


            // Create the uBars variable
            var uBars = svg.selectAll("rect")
                .data(filtered_data)

            uBars
                .enter()
                .append("rect")
                .merge(uBars)
                .attr("class", "lineTest")
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseout', mouseout)
                .transition()
                .duration(1000)
                .attr("x", function (d) {
                    return x(d.Variety);
                })
                .attr("y", function (d) {
                    return y(+d.AvgPrice);
                })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                    return height - y(+d.AvgPrice);
                })
                .attr("fill", "steelblue")




            // If less group in the new dataset, I delete the ones not in use anymore
            uBars
                .exit()
                .remove()
            // tooltips
            var div = d3.select('#table-location').append('div')
                .attr('class', 'tooltip')
                .style('display', 'none');

            function mouseover() {
                div.style('display', 'inline');
            }

            function mousemove() {
                var d = d3.select(this).data()[0]
                div
                    .html('Country: ' + d.Country + '<hr/>' + 'Variety: ' + d.Variety + '<hr/>' +'Total Tastings: ' + d.Tastings + '<hr/>' + 'Avg Price: ' + d.AvgPrice + '<hr>' + 'Avg Rating Points: ' + d.AvgPoints) 
                    .style('left', (d3.event.pageX - 34) + 'px')
                    .style('top', (d3.event.pageY - 12) + 'px');
            }

            function mouseout() {
                div.style('display', 'none');
            }




        });





    }
    fetchData('United States', 11, 25);


}
