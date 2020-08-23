var graphHeight = 500;
var graphWidth = 800;
var padding = 40;

var isDopingColor = "#F1D302";
var notDopingColor = "#4A6FA5";

d3.select("#container")
  .append("text")
  .attr("id", "title")
  .text("Doping in Professional Bicycle Racing")

d3.select("#container")
  .append("text")
  .attr("id", "subtitle")
  .text("35 Fastest times up Alpe d'Huez")

tooltip = d3.select("#container")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

const SVG = d3.select("#container")
              .append("svg")
              .attr("class", "svgcanvas")
              .attr("height", graphHeight)
              .attr("width", graphWidth)

SVG.append("text")
   .text("Time taken")
   .attr("y", 30)

const LEGEND = SVG.append("g")
                  .attr("id", "legend")

LEGEND.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", graphWidth-100-padding)
      .attr("y", 60)
      .attr("fill", isDopingColor)

LEGEND.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", graphWidth-100-padding)
      .attr("y", 30)
      .attr("fill", notDopingColor)

LEGEND.append("text")
      .attr("position", "relative")
      .attr("x", graphWidth-80-padding)
      .attr("y", 72)
      .style("color", "black")
      .text("Alleged doping")

LEGEND.append("text")
      .attr("position", "relative")
      .attr("x", graphWidth-80-padding)
      .attr("y", 42)
      .style("color", "black")
      .text("No doping")

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(function(data) {
  //Parsing year to be integer
  //Parsing completion time to Date object
  data.forEach(function(d){
    d.Year = parseInt(d.Year, 10)
    var parsedTime = d.Time.split(':');
    d.TooltipTime = d.Time
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0]-30, parsedTime[1]));
  });

  xScale = d3.scaleLinear()
             .domain([d3.min(data, (d) => d.Year)-1, d3.max(data, (d) => d.Year)+1])
             .range([padding, graphWidth-padding])
  
  yScale = d3.scaleTime()
             .domain(d3.extent(data, (d) => d.Time))
             .range([padding, graphHeight-padding])
  
  xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));
  
  yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat("%M:%S"));
  
  SVG.selectAll(".dot")
     .data(data)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("fill", (d) => (d.Doping == "")? notDopingColor: isDopingColor)
     .attr("cx", (d) => xScale(d.Year))
     .attr("cy", (d) => yScale(d.Time))
     .attr("r", 5)
     .attr("data-xvalue", (d) => d.Year)
     .attr("data-yvalue", (d) => d.Time)
     .on("mouseover", function(d){
        console.log("hey")
        tooltip.transition()
               .duration(200)
               .style("opacity", .8)
               .attr("data-year", d.Year);
        tooltip.html(d.Name + ", " + d.Nationality + "<br><br>"
                     + "Year: " + d.Year + "<br>" 
                     + "Time: " + d.TooltipTime + " minutes" + "<br><br>"
                     + d.Doping)
               .style("left", (d3.event.pageX + 30) + "px")
               .style("top", (d3.event.pageY - 20) + "px");
     })
     .on("mouseout", function(d){
        tooltip.transition()
               .duration(100)
               .style("opacity", 0)
        tooltip.style("left", "-1000px")
               .style("top", "-1000px");
     });
  
  SVG.append("g")
     .attr("id", "x-axis")
     .attr("transform", "translate(0," + (graphHeight - padding) + ")")
     .call(xAxis)
  
  SVG.append("g")
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + ",0)")
     .call(yAxis)
});
