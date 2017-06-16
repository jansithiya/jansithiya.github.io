// Define svg dimension attributes
var margin = {top: 20, right: 20, bottom: 50, left: 80},
    divWidth = document.getElementById("mainViz").clientWidth,  //use the width of div based on Bootstrap grid
    width = divWidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var color = d3.scaleOrdinal(d3.schemeCategory20);

// append the svg canvas to the page
var svg = d3.select("#mainViz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var widthGap = margin.left;
var sankey = d3.sankey()
    .nodeWidth(25)
    .nodePadding(5)
    .size([width - widthGap, height - margin.bottom]);

var path = sankey.link();

var colorPalette10 = ["4E79A7", "E15759", "76B7B2", "EDC948", "B07AA1", "FF9DA7", "9C755F", "BAB0AC"];
var colorPalette20 = ["4E79A7", "A0CBE8", "F28E2B", "FFBE7D", "59A14F", "8CD17D", "B6992D", "F1CE63", "499894", "86BCB6", "E15759", "FF9D9A", "79706E", "BAB0AC", "D37295",
    "FABFD2", "B07AA1", "D4A6C8", "9D7660", "D7B5A6"];
var colorBlind = ["#1170AA", "FC7D0B", "#A3ACB9", "#57606C", "#5FA2CE", "#C85200", "#7B848F"]
var colorBrewer10 = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"];
var colorTitle = ["#d73027", "#F1CE63", "#08519c"];

var colorRange_Activity = ["#a50026", "#d73027", "#f46d43", "#fdae61"];
var colorRange_Tech = ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8"];

var colorIndustry = d3.scaleOrdinal()
    .range(colorPalette10);

var colorActivity = d3.scaleQuantile()
    .range(colorRange_Activity.reverse());

var colorTech = d3.scaleQuantile()
    .range(colorRange_Tech.reverse());

var colorTitle = d3.scaleOrdinal()
    .range(colorTitle)
    .domain(["Activity", "Project", "Technology"]);

var ProjectTooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

// Fetch the data and process it
d3.csv("./data/Project/portfolio.csv", function (error, data) {

    if (error) throw error;

    console.log(data);

    flowData = {"nodes": [], "links": []};

    // get the unique skills and assign the frequency or count to each skill to determine height of the node
    var skill = [];

    data.forEach(function (d) {
        skill.push(d.SkillID);
    });

    skill = skill.reduce(function (d, e) {
        if (typeof d[e] !== "undefined") {
            d[e]++;
            return d;
        } else {
            d[e] = 1;
            return d;
        }
    }, {});

    //push all project to skill combination to flow data array and also the nodes
    data.forEach(function (d) {
        flowData.nodes.push({
            "name": d.ProjectID,
            "title": d.ProjectName,
            "Industry": d.IndustryName,
            "Desc": d.Description,
            "url": d.URL
        });
        flowData.nodes.push({"name": d.ActivityID, "title": d.ActivityName, "url": d.URL});
        flowData.nodes.push({"name": d.TechID, "title": d.TechName, "url": d.URL});
        flowData.links.push({"source": d.ActivityID, "target": d.ProjectID, "value": 1, "Industry": d.IndustryName});
        flowData.links.push({"source": d.ProjectID, "target": d.TechID, "value": 1, "Industry": d.IndustryName});
    });

    //get unique combination of source and target
    flowData.links = _.uniq(flowData.links, function (elem) {
        return [elem.source, elem.target].join();
    });

    //create nodes title as separate array
    flowData.nodesTitle = d3.nest()
        .key(function (d) {
            return d.name;
        })
        .rollup(function (d) {
            return d[0].title;
        }) // return the title
        .object(flowData.nodes);

    //create nodes Industry as separate array
    flowData.nodesIndustry = d3.nest()
        .key(function (d) {
            return d.name;
        })
        .rollup(function (d) {
            return d[0].Industry;
        }) // return the title
        .object(flowData.nodes);

    //create url of node as a separate array
    flowData.nodesUrl = d3.nest()
        .key(function (d) {
            return d.name;
        })
        .rollup(function (d) {
            return d[0].url;
        }) // return the title
        .object(flowData.nodes);

    //create Description of node as a separate array
    flowData.nodesDesc = d3.nest()
        .key(function (d) {
            return d.name;
        })
        .rollup(function (d) {
            return d[0].Desc;
        }) // return the title
        .object(flowData.nodes);

    //keep only the unique nodes
    flowData.nodes = d3.keys(d3.nest()
        .key(function (d) {
            return d.name;
        })
        .object(flowData.nodes));

    // Prep source link for sankey by replacing text by index of the node
    flowData.links.forEach(function (d, i) {
        flowData.links[i].source = flowData.nodes.indexOf(flowData.links[i].source);
        flowData.links[i].target = flowData.nodes.indexOf(flowData.links[i].target);
    });

    //make the nodes object
    flowData.nodes.forEach(function (d, i) {
        flowData.nodes[i] = {"name": d};
    });

    console.log(flowData);
    draw(flowData);

});


// Render the Sankey flow diagram

function draw(flowData) {

    sankey
        .nodes(flowData.nodes)
        .links(flowData.links)
        .layout(20);

    var titleTransform = 200;

    var transform = svg.attr("transform", "translate(" + 40 + "," + 100 + ")"); //to leave space for appending project title
    var link = transform.append("g").selectAll(".link")
        .data(flowData.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
        })
        .style("stroke", function (d) {
            if (d.source.name.startsWith("P")) {
                return colorIndustry(flowData.nodesIndustry[d.source.name]);
            }
            else if (d.target.name.startsWith("P")) {
                return colorIndustry(flowData.nodesIndustry[d.target.name]);
            }
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        })
        .on("mouseover", function () {
            d3.select(this).style("stroke-opacity", 0.5)
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke-opacity", 0.2)
        });


// add the link titles
    link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + (d.value);
        });

    //domain for colorIndustry

    var IndustryName = [];

    Object.keys(flowData.nodesIndustry).forEach(function (key) {

        if (flowData.nodesIndustry[key]) {
            IndustryName.push(flowData.nodesIndustry[key]);
        }

    });
    IndustryName = _.uniq(IndustryName);  //Keep only the unique values
    colorIndustry.domain(IndustryName);

    //Domain for Activity and tech color
    var activities = [];
    var tech = []
    var activityCount = flowData.links.forEach(function (d) {
        if (d.source.name.startsWith("A")) {
            activities.push(d.source.name);
        }
        else if (d.target.name.startsWith("T")) {
            tech.push(d.target.name);
        }
    });

    activities = _.countBy(activities, _.identity);
    tech = _.countBy(tech, _.identity);

    var domainActivity = d3.extent(Object.keys(activities), function (d) {
        return activities[d]
    });
    var domainTech = d3.extent(Object.keys(tech), function (d) {
        return tech[d]
    });
    colorActivity.domain(domainActivity);
    colorTech.domain(domainTech);


    // Get the x position for each node to add title in the top for the flow source
    var allTitle = [];

    flowData.nodes.forEach(function (d) {
        if (d.name == "P1") {
            allTitle.push({"name": "Project", "x": d.x});
        }
        else if (d.name == "A1") {
            allTitle.push({"name": "Activity", "x": d.x});
        }
        else if (d.name == "T1") {
            allTitle.push({"name": "Technology", "x": d.x});
        }
    });


    var rectWidth = 100, rectHeight = 25, xMove = -10, yMove = -80, triangleMove = 25, titleY = -63;

    // Include title on the top of each section of node, i.e, activity, project and tech

    var mainTitle = svg.selectAll(".mainTitle")
        .data(allTitle)
        .enter()
        .append("text")
        .attr("class", "mainTitle")
        .attr("x", function (d) {
            return d.x
        })
        .attr("y", titleY)
        .text(function (d) {
            return d.name
        });

    var titleRect = svg.selectAll(".titleRect")
        .data(allTitle)
        .enter()
        .append("rect")
        .attr("class", "titleRect")
        .attr("x", function (d) {
            return d.x + xMove
        })
        .attr("y", yMove)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .style("fill", function (d) {
            return colorTitle(d.name)
        })
        .style("fill-opacity", 0.6);

    var titleTriangle = svg.selectAll(".titleTriangle")
        .data(allTitle)
        .enter()
        .append("path")
        .attr("class", "titleTriangle")
        .attr("d", function (d) {
            return " M " + (d.x + xMove + rectWidth) + " " + yMove + " L " + (d.x + xMove + rectWidth + triangleMove) + " " + (yMove + (rectHeight / 2)) + "L " + (d.x + xMove + rectWidth) + " " + (yMove + rectHeight) + " Z"
        })
        .style("stroke", "none")
        .style("fill", function (d) {
            return colorTitle(d.name)
        })
        .style("fill-opacity", 0.6);

    var node = transform.append("g").selectAll(".node")
        .data(flowData.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
// add the rectangles for the nodes
    node.append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            if (d.name.startsWith("P")) {
                return colorIndustry(flowData.nodesIndustry[d.name]);
            }
            else if (d.name.startsWith("A")) {
                return colorActivity(activities[d.name]);
            }

            else if (d.name.startsWith("T")) {
                return colorTech(tech[d.name]);
            }

        })
        .style("stroke", "none")
        .style("cursor", "pointer")
        .on("mouseover", function (e) {
            node_mouseHover(e, flowData.links)
        })
        .on("mouseout", node_mouseOut)
        .on("click", node_onClick)
        .append("title")
        .text(function (d) {
            return d.name;
        });

    node.append("text")
        .attr("x", -6)
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function (d) {
            return flowData.nodesTitle[d.name];
        })
        .attr("x", function (d) {
            var w = this.getComputedTextLength();
            if (d.name.startsWith('P')) {
                return (6 + sankey.nodeWidth());
            }
            else {
                return (6 + sankey.nodeWidth());
            }
        })
        .attr("text-anchor", "start")
        .attr("font-size",function(d){
            if(d.name.startsWith("P")){
                return "10px";
            }
        })

}


/*  Functions assocaited with interaction events */

//Mouse Over the node or the rectangle
function node_mouseHover(e, links) {

    d3.selectAll(".link").filter(function (d) {
        return d.source.name == e.name;
    }).style("stroke-opacity", 0.5);

}

function node_mouseOut() {

    d3.selectAll(".link").style("stroke-opacity", 0.2)
}

function node_onClick() {



}
