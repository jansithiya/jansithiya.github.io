var myData, radius = 6.5;

/*  data connect */
d3.csv('../Data/Project/benchmark.csv',function (data) {
    console.log(data);
    myData = data;
    updateData(data);
    render();

});
var relevantData;
var formatPercent = d3.format(".0%"), formatNumber = d3.format(",.0f"), formatComma = d3.format(",");

function updateData(data) {


    var rankCategory = $('#categoryDropdown').val();
    console.log(rankCategory);

    switch (rankCategory) {
        case "Overall":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "ALL" && d['Weight Scope'] == "ALL" && d['State Scope'] == "ALL";
            });
            break;
        case "State":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "ALL" && d['Weight Scope'] == "ALL" && d['State Scope'] == "Dealer-State";
            });
            break;
        case "State/Metro":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "Dealer-locate" && d['Weight Scope'] == "ALL" && d['State Scope'] == "Dealer-State";
            });
            break;
        case "State/Weight":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "ALL" && d['Weight Scope'] == "Dealer-weight" && d['State Scope'] == "Dealer-State";
            });
            break;
        case "State/Metro/Weight":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "Dealer-locate" && d['Weight Scope'] == "Dealer-weight" && d['State Scope'] == "Dealer-State";
            });
            break;
        case "Metro":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "Dealer-locate" && d['Weight Scope'] == "ALL" && d['State Scope'] == "ALL";
            });
            break;
        case "Metro/Weight":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "Dealer-locate" && d['Weight Scope'] == "Dealer-weight" && d['State Scope'] == "ALL";
            });
            break;
        case "Weight":
            relevantData = data.filter(function (d) {
                return d['metroRural scope'] == "ALL" && d['Weight Scope'] == "Dealer-weight" && d['State Scope'] == "ALL";
            });
            break;
    }

    relevantData.forEach(function(d){
        d['Max G'] = +d['Max G'];
        d['Min G'] = +d['Min G'];
        d['Metric Number'] = +d['Metric Number'];
        d['Rank'] = +d['Rank'];
    });
    relevantData = d3.nest()
        .key(function (d) {
            return d.Metric;
        })
        .entries(relevantData);

    console.log(relevantData);

}


var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

var width = 1400, height = 1200, margin = {top: 20, right: 20, bottom: 10, left: 40};

var svg = d3.select('#visual')
    .append("svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom);

var benchMarkLineX, benchMarkLineWidth, metricChangeX;

var benchMarkScale = d3.scaleLinear();

//color scales for rank
var GnBu = ["#a50026", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#92c5de", "#4393c3", "#2166ac", "#053061"],
    RdYlBu = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#abd9e9", "#74add1", "#4575b4", "#313695"];
var rankColorScale = d3.scaleThreshold()
    .range(RdYlBu.reverse());

// draw the visual encodings and the transitions on change in rank category
function render() {

    //heading for the benchmark visualization and report
    var columnHeading = [{
        "title": "Metric Name",
        "parameters": [{"width": 280, "spacing": 5, "margin-left": margin.left}]
    },
        {"title": "Peer Comparison", "parameters": [{"width": 520, "spacing": 5, "margin-left": margin.left}]},
        {"title": "% Change", "parameters": [{"width": 150, "spacing": 5, "margin-left": margin.left}]},
        {"title": "Rank", "parameters": [{"width": 100, "spacing": 5, "margin-left": margin.left}]},
        {"title": "Rank Change", "parameters": [{"width": 150, "spacing": 5, "margin-left": margin.left}]}
    ];
    var headingY = 20;  //space from topmost
    var heading = svg.selectAll("g")
        .data(columnHeading)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + margin.left + "," + margin.top + ")";
        });
    //column heading text such as metric name, peer comparison, etc.,
    heading.append("text")
        .attr("class", "columnHeading")
        .attr("x", function (d, i) {
            if (i == 0) {
                return (d.parameters[0].spacing)
            }
            else {
                var totalWidth = 0;
                for (var j = 0; j < i; j++) {
                    totalWidth += (heading.data()[j].parameters[0].width + heading.data()[j].parameters[0].spacing);
                }
                return (d.parameters[0].spacing + totalWidth );
            }
        })
        .attr("y", 5)
        .text(function (d) {
            return d.title;
        });

    // horizontal line below the heading
    var totalWidth = 0;
    for (var j = 0; j < columnHeading.length; j++) {
        totalWidth += (columnHeading[j].parameters[0].width + heading.data()[j].parameters[0].spacing);
    }
    var headingLine = heading.append("line")
        .attr("class", "headingLine")
        .attr("x1", 0)
        .attr("y1", headingY)
        .attr("x2", totalWidth)
        .attr("y2", headingY);
    // data for main visualization and text elements
    var main = svg.selectAll("g.main")
        .data(relevantData)
        .enter()
        .append("g")
        .attr("class", "main")
        .attr("transform", function (d) {
            return "translate(" + margin.left + "," + margin.top + ")";
        });

    var rowSpacing = 45; //space between rows housing metrics
    // metric or measure names
    main.append("text")
        .attr("class", "mainTitle text")
        .attr("x", 10)
        .attr("y", function (d, i) {
            return ((headingY * 2.3) + (rowSpacing * i));
        })
        .attr("dy", "0em")
        .text(function (d) {
            if (d.key == "Parts_Enqury") {
                return "Parts Enquiry";
            }
            else {
                var cleanTitle = d.key.replace(/_/g, " ");
                return cleanTitle;
            }
        });
    // current metric number
    main.append("text")
        .attr("class", "mainTitle values")
        .attr("x", 10)
        .attr("y", function (d, i) {
            return ((headingY * 2.5) + (rowSpacing * i));
        })
        .attr("dy", "1em")
        .text(function (d) {
            return "( " + d.values[1]['Metric Number'] + " )";
        });

    //row divider line
    main.append("line")
        .attr("class", "rowLines")
        .attr("x1", 0)
        .attr("y1", function (d, i) {
            return ((headingY * 3.5) + (rowSpacing * i));

        })
        .attr("x2", totalWidth)
        .attr("y2", function (d, i) {
            return ((headingY * 3.5) + (rowSpacing * i));

        })
        .style("stroke", "#a1a1a4")
        .style("stroke-opacity", 0.5);

    //pixels to move horizontally to get to peer comparison
    benchMarkLineX = columnHeading[0].parameters[0].width + columnHeading[0].parameters[0].spacing;
    benchMarkLineWidth = columnHeading[1].parameters[0].width - 150;
    var textSpace = 50, textGap = 10;
    benchMarkScale.range([(benchMarkLineX + textSpace), (benchMarkLineX + textSpace + benchMarkLineWidth)]); //value for scaling

    //draw line for benchmark viz
    main.append("line")
        .attr("class", "benchmarkLine")
        .attr("x1", benchMarkLineX + textSpace)
        .attr("y1", function (d, i) {
            return (headingY * 2.3 + (rowSpacing * i));

        })
        .attr("x2", (benchMarkLineX + textSpace) + benchMarkLineWidth)
        .attr("y2", function (d, i) {
            return (headingY * 2.3 + (rowSpacing * i));

        });

    // text for maximum and minimum values
    main.append("text")
        .attr("class", "metricRange Min")
        .text(function (d) {
            return (d.values[1]['Min G']);
        })
        .attr("x", function (d) {
            var textBox = this.getBBox().width;
            var availableWidth = textSpace;
            return benchMarkLineX + (availableWidth - textBox - textGap);
        })
        .attr("y", function (d, i) {
            return (headingY * 2.5 + (rowSpacing * i));
        });
    main.append("text")
        .attr("class", "metricRange Max")
        .attr("x", benchMarkLineX + textSpace + benchMarkLineWidth + textGap)
        .attr("y", function (d, i) {
            return (headingY * 2.5 + (rowSpacing * i));
        })
        .text(function (d) {
            return formatComma(d.values[1]['Max G']);
        });  //max values

    // current Value marker or circle
    main.append("circle")
        .attr("class", "currentValue")
        .attr("cx", function (d) {
            benchMarkScale.domain([d.values[1]['Min G'], d.values[1]['Max G']]);
            return benchMarkScale(d.values[1]['Metric Number']);
        })
        .attr("cy", function (d, i) {
            return (headingY * 2.3 + (rowSpacing * i));
        })
        .attr("r", radius)
        .on("mouseover", function (d) {
            return tooltip.style("visibility", "visible").html("<b>" + "Current Value:  " + "</b>" + d.values[1]['Metric Number'] + "<br/>" + "<b>" + "Previous Period:  "
                + "</b>" + d.values[0]['Metric Number'] + "<br/>");
        })
        .on("mousemove", function (d) {
            return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function (d) {
            return tooltip.style("visibility", "hidden");
        });


    //metric change triangle
    metricChangeX = benchMarkLineX + columnHeading[1].parameters[0].width + columnHeading[1].parameters[0].spacing;
    var metricChangeShape = main.append("path")
        .attr("class", "metricChange shape");

    var symbolGap = 20; //space between shape and the value text

    // metric change text
    var metricChangeText = main.append("text")
        .attr("class", "metricChange text")
        .attr("x", metricChangeX + textGap + symbolGap)
        .attr("y", function (d, i) {
            return ((headingY * 2.75) + (rowSpacing * i));
        });

    // rank shape
    var rankX = metricChangeX + columnHeading[2].parameters[0].width + columnHeading[2].parameters[0].spacing;
    var rankShape = main.append("path")
        .attr("class", "rank shape")
        .attr("d", d3.symbol().type(d3.symbolStar)())
        .attr('transform', function (d, i) {
            return 'translate(' + (rankX + textGap) + ',' + ((headingY * 2.4) + (rowSpacing * i)) + ')';
        });

    //rank text
    var rankText = main.append("text")
        .attr("class", "rank text")
        .attr("x", rankX + textGap + symbolGap)
        .attr("y", function (d, i) {
            return ((headingY * 2.75) + (rowSpacing * i));
        });

    // rank change indicator
    var rankChangeX = rankX + columnHeading[3].parameters[0].width + columnHeading[3].parameters[0].spacing;
    var rankChangeShape = main.append("path").attr("class", "rankChange shape");

    // metric change text
    var rankChangeText = main.append("text")
        .attr("class", "rankChange text")
        .attr("x", rankChangeX + textGap + symbolGap)
        .attr("y", function (d, i) {
            return ((headingY * 2.75) + (rowSpacing * i));
        });

    //function houses the attributes that require update on change in rank category value dropdown box
    updateRender(metricChangeShape, metricChangeText, rankShape, rankText, rankChangeShape, rankChangeText);

    function updateRender(metricChangeShape, metricChangeText, rankShape, rankText, rankChangeShape, rankChangeText) {

        metricChangeShape.attr("d", function (d) {
            var current = d.values[1]['Metric Number'], previous = d.values[0]['Metric Number'],
                change = ((current - previous) / previous);
            if (change == 0 || (current == 0 && previous == 0)) {
                return d3.symbol().type(d3.symbolSquare)();
            }
            else {
                return d3.symbol().type(d3.symbolTriangle)();
            }
        })
            .attr('transform', function (d, i) {
                var current = d.values[1]['Metric Number'], previous = d.values[0]['Metric Number'],
                    change = ((current - previous) / previous);
                if (previous == 0) {
                    return 'translate(' + (metricChangeX + textGap) + ',' + ((headingY * 2.4) + (rowSpacing * i)) + ')';
                }
                else if (change < 0) {
                    return 'translate(' + (metricChangeX + textGap) + ',' + ((headingY * 2.4) + (rowSpacing * i)) + ') rotate(180)';
                }
                else {
                    return 'translate(' + (metricChangeX + textGap) + ',' + ((headingY * 2.4) + (rowSpacing * i)) + ')';
                }
            })
            .attr("fill", function (d) {
                var current = d.values[1]['Metric Number'], previous = d.values[0]['Metric Number'],
                    change = ((current - previous) / previous);
                if (change == 0 || (current == 0 && previous == 0)) {
                    return "#fee08b";
                }
                else if (change < 0) {
                    return "#d73027";
                }
                else {
                    return "#006837"
                }
            });

        metricChangeText.text(function (d) {
            var current = d.values[1]['Metric Number'], previous = d.values[0]['Metric Number'];
            if (previous == 0) {
                return (formatPercent(current));
            }
            else {
                return (formatPercent((current - previous) / previous))
            }
        });

        // rank performance indicator using star symbol
        var measureMin = d3.min(relevantData, function (d) {
            return d.values[1].Rank;
        }), measureMax = d3.max(relevantData, function (d) {
            return d.values[1].Rank;
        }), measureMid = (measureMax - measureMin) / 7;
        var rankDomain = [measureMin, measureMid, measureMid * 2, measureMid * 3, measureMid * 4, measureMid * 5, measureMid * 6, measureMid * 7, measureMax];
        rankColorScale.domain(rankDomain);

        rankText.text(function (d) {
            return d.values[1].Rank;
        });

        rankShape.attr("fill", function (d) {
            return rankColorScale(d.values[1].Rank);
        });
        rankChangeShape.attr("d", function (d) {
            var current = d.values[1].Rank, previous = d.values[0].Rank, change = current - previous;
            if (change == 0) {
                return d3.symbol().type(d3.symbolSquare)();
            }
            else {
                return d3.symbol().type(d3.symbolTriangle)();
            }
        })
            .attr('transform', function (d, i) {
                var current = d.values[1].Rank, previous = d.values[0].Rank, change = current - previous;

                if (change > 0) {
                    return 'translate(' + (rankChangeX + textGap) + ',' + ((headingY * 2.4) + (rowSpacing * i)) + ') rotate(180)';
                }
                else {
                    return 'translate(' + (rankChangeX + textGap) + ',' + ((headingY * 2.4) + (rowSpacing * i)) + ')';
                }
            })
            .attr("fill", function (d) {
                var current = d.values[1].Rank, previous = d.values[0].Rank, change = current - previous;
                if (change == 0) {
                    return "#fee08b";
                }
                else if (change > 0) {
                    return "#d73027";
                }
                else {
                    return "#006837"
                }
            });
        rankChangeText.text(function (d) {
            var current = d.values[1].Rank, previous = d.values[0].Rank, change = current - previous;
            if (change < 0) {
                return -(change);
            }
            else {
                return change;
            }
        });
    }

    //transition on change in rank category
    function benchMarkTransition() {
        console.log(relevantData);
        var duration = 750;
        svg.selectAll(".metricRange").filter(".Min")
            .data(relevantData)
            .text(function (d) {
                console.log(d.values[1]['Min G'])
                return (d.values[1]['Min G']);
            })
            .transition()
            .duration(duration)
            .attr("x", function (d) {
                var bbox = this.getBBox().width;
                var availableWidth = textSpace;
                return benchMarkLineX + (availableWidth - bbox - textGap);
            });

        svg.selectAll(".metricRange").filter(".Max")
            .data(relevantData)
            .transition()
            .duration(duration)
            .text(function (d) {
                return formatComma(d.values[1]['Max G']);
            });

        var circleDuration = 1100;
        svg.selectAll(".currentValue")
            .data(relevantData)
            .transition()
            .duration(circleDuration)
            .attr("cx", function (d) {
                benchMarkScale.domain([d.values[1]['Min G'], d.values[1]['Max G']]);
                return benchMarkScale(d.values[1]['Metric Number']);
            });
        var metricChangeShape = svg.selectAll(".metricChange").filter(".shape")
            .data(relevantData)
            .transition()
            .duration(duration);
        var metricChangeText = svg.selectAll(".metricChange").filter(".text")
            .data(relevantData)
            .transition()
            .duration(duration);
        var rankShape = svg.selectAll(".rank").filter(".shape")
            .data(relevantData)
            .transition()
            .duration(duration);
        var rankText = svg.selectAll(".rank").filter(".text")
            .data(relevantData)
            .transition()
            .duration(duration);
        var rankChangeShape = svg.selectAll(".rankChange").filter(".shape")
            .data(relevantData)
            .transition()
            .duration(duration);
        var rankChangeText = svg.selectAll(".rankChange").filter(".text")
            .data(relevantData)
            .transition()
            .duration(duration);

        updateRender(metricChangeShape, metricChangeText, rankShape, rankText, rankChangeShape, rankChangeText);
    }

//action filter
    $('#categoryDropdown').change(function () {
        updateData(myData);
        benchMarkTransition();
    });

}

function orderMetric(data) {

    var order = ["Sessions", "VINviews", "Click_to_Call", "Tracked_Number_Call", "Test_Drive_Bookings_New_Vehicles",
        "Test_Drive_Bookings_Used_Vehicles", "Service_Booking", "Enquiries", "General_Enquiry", "Inventory_New_Vehicle_Enquiry",
        "Inventory_Used_Vehicle_Enquiry", "New_Vehicle_Enquiry", "Used_Vehicle_Enquiry", "Fleet_Enquiry", "Finance_Enquiry", "Parts_Enqury", "Service_Enquiry",
        "Special_Offer_Enquiry", "Quote_Requests"];

    data = data.sort(function (a, b) {
        return order.indexOf(a.key) - order.indexOf(b.key);
    });

    return data;

}


