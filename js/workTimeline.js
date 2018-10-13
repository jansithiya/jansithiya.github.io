/**
 * Created by jansi on 12/06/17.
 */

//Draw the line with Year

var workMargin = {top: 20, right: 20, bottom: 50, left: 40},
    workClientWidth = document.getElementById("timeline").clientWidth, workClientHeight = 700;
var workWidth = workClientWidth - workMargin.left - workMargin.right,
    workHeight = workClientHeight - workMargin.top - workMargin.bottom;
var allFields = ["Business Intelligence", "Data Visualization", "Data Mining", "ETL", "Data Analytics", "Market Research", "Reporting"];
var JewelBright = ["#EB1E2C", "#FD6F30", "#F9A729", "#F9D23C", "#64CDCC", "#91DCEA", "#A4A4D5", "#BBC9E5"];
var fieldColor = d3.scaleOrdinal()
    .range(JewelBright)
    .domain(allFields);

// append the svg canvas to the page
var workSvg = d3.select("#timeline").append("svg")
    .attr("width", workWidth + workMargin.left + workMargin.right)
    .attr("height", workHeight + workMargin.top + workMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + workMargin.left + "," + workMargin.top + ")");


var yScale = d3.scaleTime().range([workHeight, 0]);


renderTimeline(workData);


function renderTimeline(workData) {

    var dateMin = d3.min(workData.education, function (d) {
        return d.from;
    });
    var dateMax = d3.max(workData.job, function (d) {
        return d.to;
    });

    yScale.domain([dateMin, dateMax]);

    var axisShift = workWidth / 2.8, yShift = 10;

    workSvg.append("g")
        .attr("transform", "translate(" + axisShift + "," + yShift + ")")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale));

    // draw work experience tile
    var rectMove = 100, rectWidth = 40;

    var rectData = workSvg.selectAll(".work")
        .data(workData.job)
        .enter();


    var workRect = rectData.append("rect")
        .attr("transform", "translate(" + (axisShift + 120) + "," + yShift + ")")
        .attr("class", "work workRect")
        .attr("y", function (d) {
            return yScale(d.to);
        })
        .attr("width", rectWidth)
        .attr("height", function (d) {
            return yScale(d.from) - yScale(d.to);
        })
        .attr("fill", "#6d6e70")
        .attr("fill-opacity", 0.8);


    var workRole = rectData.append("svg:foreignObject")
        .attr("class", "work role")
        .attr("width", workWidth - (axisShift + 50))
        .attr("height", function (d) {
            return yScale(d.from) - yScale(d.to)
        })
        .attr("x", (axisShift + rectWidth + 130))
        .attr("y", function (d) {
            return (yScale(d.to) + (yScale(d.from) - yScale(d.to)) / 2 - 5);
        })
        .append("xhtml:div")

    workRole.html(function (d, i) {
        return '<button type="button" class="btn btn-info btn-sm roleButton" id="role" data-toggle="modal" data-target="#myModal">' + d.role + '</button>' 

    });

    var workCompany = rectData.append("svg:foreignObject")
        .attr("class", "work company")
        .attr("width", axisShift - 140 - 50)
        .attr("height", function (d) {
            return yScale(d.from) - yScale(d.to)
        })
        .attr("x", (axisShift + 20))
        .attr("y", function (d) {
            return (yScale(d.to) + (yScale(d.from) - yScale(d.to)) / 2) - 5;
        })
        .append("xhtml:div");

    workCompany.append('p')
        .html(function (d) {
            if (d.jobID != 5) {
                return (d.company + "<br>" + "(" + d.country + ")")
            }
            else {
                return (d.company);
            }
        });

    var fieldRect = rectData.selectAll(".fieldRect")
        .data(function (d) {
            var fieldRect = [], fieldLen = d.field.length;
            d.field.forEach(function (e) {
                fieldRect.push({"name": e, "from": d.from, "to": d.to, "len": fieldLen})
            });
            return fieldRect;
        })
        .enter()
        .append("rect")
        .attr("transform", "translate(" + (axisShift + 125) + "," + yShift + ")")
        .attr("class", "work fieldRect")
        .attr("x", -20)
        .attr("y", function (d, i) {
            return yScale(d.to) + i * ((yScale(d.from) - yScale(d.to)) / d.len);
        })
        .attr("width", 10)
        .attr("height", function (d) {
            return (yScale(d.from) - yScale(d.to)) / d.len
        })
        .attr("fill", function (d) {
            return fieldColor(d.name);
        })
        .attr("fill-opacity", 0.8);

    var eduData = workSvg.selectAll(".edu")
        .data(workData.education.filter(function (d) {
            return d.eduID != 3
        }))
        .enter();

    var eduRect = eduData.append("rect")
        .attr("transform", "translate(" + (axisShift - 80) + "," + yShift + ")")
        .attr("class", "edu eduRect")
        .attr("y", function (d) {
            return yScale(d.to);
        })
        .attr("width", 25)
        .attr("height", function (d) {
            return yScale(d.from) - yScale(d.to);
        })
        .attr("fill", "#8a7967")
        .attr("fill-opacity", 0.8);

    var eduCap = eduData.append("svg:foreignObject")
        .attr("class", "edu eduCap")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", (axisShift - 140))
        .attr("y", function (d) {
            return (yScale(d.to));
        })
        .append("xhtml:span")
        .attr("class", "fa fa-graduation-cap")
        .style("font-size", "30px")
        .style("color", "#6a737b");


    var eduProgram = eduData.append("svg:foreignObject")
        .attr("class", "edu program")
        .attr("width", 200)
        .attr("height", function (d) {
            return yScale(d.from) - yScale(d.to)
        })
        .attr('x', 5)
        .attr("y", function (d) {
            return (yScale(d.to) + 40);
        })
        .append("xhtml:div");

    eduProgram.append('p')
        .html(function (d) {
            return d.degree;
        });


    var eduMajor = eduData.append("svg:foreignObject")
        .attr("class", "edu major")
        .attr("width", 150)
        .attr("height", function (d) {
            return yScale(d.from) - yScale(d.to)
        })
        .attr('x', 10)
        .attr("y", function (d) {
            if (d.eduID == 1) {
                return (yScale(d.to) + 90);
            }
            else {
                return (yScale(d.to) + 70)
            }
        })
        .append("xhtml:div");

    eduMajor.append('p')
        .html(function (d) {
            if (d.eduID == 1) {
                return (d.School + " " + "(" + d.country + ")" );
            }
            else {
                return ( d.Major);
            }
        });

    var eduUniv = eduData.append("svg:foreignObject")
        .attr("class", "edu major")
        .attr("width", 150)
        .attr("height", function (d) {
            return yScale(d.from) - yScale(d.to)
        })
        .attr('x', 10)
        .attr("y", function (d) {

            return (yScale(d.to) + 100)
        })
        .append("xhtml:div");

    eduUniv.append("p")
        .html(function (d) {
            if (d.eduID == 2) {
                return (d.School + " " + "(" + d.country + ")" );
            }
        })


}
