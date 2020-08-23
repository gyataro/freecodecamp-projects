var graphWidth = 1200;
var graphHeight = 2000;
var padding = 20;
var platformArray = ["XOne", "PSP", "2600", "PC", "XB", "GBA", "N64", "PS", "SNES", "PS4", "3DS", "PS2", "NES", "PS3", "GB", "X360", "DS", "Wii"]

const SVG = d3.select("#container")
              .append("svg")
              .attr("height", graphHeight+padding)
              .attr("width", graphWidth+padding)

var tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

const colorScale = d3.scaleOrdinal(d3.schemeCategory20b.reverse());

d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json", function(data){
  const treemap = d3.treemap()
                    .size([graphWidth, graphHeight])
                    .paddingInner(2)
                    .paddingOuter(6)
                    .paddingTop(30);
  
  const root = d3.hierarchy(data)
                 .eachBefore((d) => {
                    d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
                 })
                 .sum(d => d.value)
                 .sort((a, b) => b.height - a.height || b.value - a.value);
  
  treemap(root);
  
  const CELL = SVG.selectAll('g')
                  .data(root.leaves())
                  .enter()
                  .append('g')
                  .attr('transform', (d) => `translate(${d.x0},${d.y0})`)
        
              CELL.append('rect')
                  .attr('id', (d) => d.data.id)
                  .attr('class', 'tile')
                  .attr('data-name', (d) => d.data.name)
                  .attr('data-value', (d) => d.data.value)
                  .attr('data-category', (d) => d.data.category)
                  .attr('width', (d) => d.x1 - d.x0)
                  .attr('height', (d) => d.y1 - d.y0)
                  .attr('fill', (d) => colorScale(d.data.category))
                  .on("mousemove", function(d){
                    tooltip.transition()		
                           .duration(100)		
                           .style("opacity", .8);
                    tooltip.html(d.data.name + "<br>" + "Sales: " + d.data.value + " Million")
                           .attr("data-value", d.data.value)
                           .style("left", (d3.event.pageX + 10) + "px")		
                           .style("top", (d3.event.pageY - 28) + "px");	
                  })
                  .on("mouseout", function(d) {		
                    tooltip.transition()		
                           .duration(100)		
                           .style("opacity", 0);	
                  });

              CELL.append('text')
                  .attr('x', 10)
                  .attr('y', -10)
                  .text((d) => d.data.name)
                  .style("font-family", "Arial")
                  .attr("fill", "white")  
                  .call(wrap, 10)
  
               SVG.selectAll("titles")
                  .data(root.descendants().filter(function(d){return d.depth==1}))
                  .enter()
                  .append("text")
                  .attr("x", (d) => d.x0 + 8)
                  .attr("y", (d) => d.y0 + 25)
                  .text((d) => d.data.name)
                  .style("font-family", "Arial")
                  .attr("font-size", "25px")
  
const LEGEND = d3.select("#legend")
                 .append("svg")
                 .attr("width", graphWidth)
                 .attr("height", 80)

LEGEND.selectAll("rect")
      .data(platformArray)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", 60)
      .attr("height", 20)
      .attr("x", (d, i) => i*63 + 10)
      .attr("y", 0)
      .attr("fill", (d) => colorScale(d))

LEGEND.selectAll("text")
      .data(platformArray)
      .enter()
      .append("text")
      .attr("x", (d, i) => i*63 + 10)
      .attr("y", 40)
      .text((d) => d)
  
});

function sumBySize(d) {
  return d.value;
}

//Text wrap function by Dennis Bauszus
function wrap(text, width) {
  text.each(function() {
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1,
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 1.1,
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

