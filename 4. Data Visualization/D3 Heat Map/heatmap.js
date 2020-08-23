var graphWidth = 1300;
var graphHeight = 300;
var padding = 100;
var colorArray = ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'].reverse();
var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var yearArray = generateYears(1753, 2015, 1);

function generateYears(min, max, interval){
  var output = [];
  var year = min;
  while(year <= max){
    output.push(year);
    year += interval;
  }
  return output;
}

d3.select("body")
  .append("text")
  .attr("id", "title")
  .text("Monthly Global Land-Surface Temperature");

d3.select("body")
  .append("text")
  .attr("id", "description")
  .text("1753 - 2015: base temperature 8.66℃");

const SVG = d3.select("body")
              .append("svg")
              .attr("height", graphHeight+padding)
              .attr("width", graphWidth+padding)
              .style("background-color", "white");

tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(function(data){
  data.monthlyVariance.forEach(function(item){
    item.monthText = monthArray[item.month-1];
    item.temperature = (item.variance + data.baseTemperature).toFixed(2);
  });
  
  //Color scale
  var colorScale = d3.scaleQuantile()
                    .domain(d3.extent(data.monthlyVariance, (d) => d.variance))
                    .range(colorArray);
  
  var legendScale = d3.scaleQuantile()
                      .domain([-6.5, 0, 5.5])
                      .range([0, 165, 330]);
  
  var xScale = d3.scaleBand()
                 .domain(yearArray)
                 .range([0, graphWidth]);
  
  var xAxis = d3.axisBottom(xScale)
                .tickValues(generateYears(1760, 2015, 10))
                .tickFormat(d3.format("d"));
  
  SVG.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr("transform", "translate(80," + graphHeight + ")");
  
  var yScale = d3.scaleBand()
                .domain(monthArray)
                .range([0, graphHeight])
                .padding(0.01);
  
  var yAxis = d3.axisLeft(yScale);
      
  SVG.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", "translate(80, 0)");
  
  SVG.append("g")
     .call(d3.axisTop(legendScale))
     .attr("transform", "translate(80, 350)");
  
  SVG.selectAll(".cell")
     .data(data.monthlyVariance)
     .enter()
     .append("rect")
     .attr("class", "cell")
     .attr("data-month", (d) => d.month-1)
     .attr("data-year", (d) => d.year)
     .attr("data-temp", (d) => (d.variance + data.baseTemperature))
     .attr("width", xScale.bandwidth())
     .attr("height", graphHeight/12)
     .attr("x", (d) => xScale(d.year) + 80)
     .attr("y", (d) => yScale(d.monthText))
     .attr("fill", (d) => colorScale(d.variance))
     .on("mouseover", function(d){
          tooltip.transition()		
                 .duration(100)		
                 .style("opacity", .9);
          tooltip.html(d.year + " - " + d.monthText + "<br>"
                       + d.temperature + " °C" + "<br>"
                       + d.variance)
                 .attr("data-year", d.year)
                 .style("left", (xScale(d.year) + 20) + "px")		
                 .style("top", (yScale(d.monthText)) + "px");	
     })
     .on("mouseout", function(d) {		
          tooltip.transition()		
             .duration(100)		
             .style("opacity", 0);	
     });
  
     var legend = SVG.selectAll("#legend")
                     .data(colorArray).enter()
                     .append("g")
                     .attr("id", "legend");
                          
         legend.append("rect")
               .attr("height", 20)
               .attr("width", 30)
               .attr("x", (d, i) => 30*i + 80)
               .attr("y", graphHeight + 50)
               .attr("fill", (d) => d);
});
