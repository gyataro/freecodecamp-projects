document.addEventListener('DOMContentLoaded', function(){
  var json;
  var barwidth = 3;
  var width = 900;
  var height = 400;
  var padding = 30;
  req = new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
  req.send();
  req.onload=function(){
    json = JSON.parse(req.responseText);
    const DATASET = json.data;
    const DATES = DATASET.map((item) => new Date(item[0]));
    
    xScale = d3.scaleTime()
               .domain([d3.min(DATES, (d) => d), d3.max(DATES, (d) => d)])
               .range([0, barwidth*DATES.length]);
    
    yScale = d3.scaleLinear()
               .domain([0, d3.max(DATASET, (d) => d[1])])
               .range([height, 0]);
    
    xAxis = d3.axisBottom()
              .scale(xScale);
    
    yAxis = d3.axisLeft()
              .scale(yScale);
    
    var tooltip = d3.select("#container").append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);
    
    const SVG = d3.select("#container")
                  .append("svg")
                  .attr("id", "container")
                  .attr("width", width+padding)
                  .attr("height", height+padding);
    
    SVG.selectAll("rect")
       .data(DATASET)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", (d, i) => xScale(DATES[i]))
       .attr("y", (d) => yScale(d[1]))
       .attr("width", 4)
       .attr("height", (d) => height - yScale(d[1]))
       .attr('transform', 'translate(60, 0)')
       .attr('data-date', function(d, i) {
          return DATASET[i][0]
       })
       .attr('data-gdp', function(d, i) {
          return DATASET[i][1]
       })
       .on("mouseover", function (d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html(d[0] + "<br>" + "$" + d[1] + " billion")
                   .attr('data-date', d[0])
                   .style("left", (d3.event.pageX + 30) + "px")
                   .style("top", 350 + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", 0);
        });
        
    SVG.append("g")
       .attr('id', 'x-axis')
       .attr("transform", "translate(" + 60 + "," + (height) + ")")
       .call(xAxis);
    
    SVG.append("g")
       .attr('id', 'y-axis')
       .attr('transform', 'translate(60, 0)')
       .call(yAxis);
    
    SVG.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 80)
    .style('font-size', "20px")
    .text('Gross Domestic Product');
  };
});
