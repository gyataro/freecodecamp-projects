const SVG = d3.select("#container")
              .append("svg")
              .attr("height", 600)
              .attr("width", 960)

var tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

//Source data holder
var MAP_DATA;
var EDUCATION_DATA;
var educationArray = [];

//Color scale palette
var colorArray = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'];

var colorScale = d3.scaleQuantile()
                   .domain([0, 90])
                   .range(colorArray)

var legendScale = d3.scaleLinear()
                    .domain([0, 90])
                    .range([0, 270])

var legendAxis = d3.axisBottom(legendScale)
                   .ticks(9)

var legend = SVG.selectAll("#legend")
   .data(colorArray).enter()
   .append("g")
   .attr("id", "legend");

legend.append("rect")
      .attr("id", "legend")
      .attr("fill", (d) => d)
      .attr("x", (d, i) => i*30 + 600)
      .attr("height", 15)
      .attr("width", 30);

 SVG.append("g")
     .call(legendAxis)
     .attr("transform", "translate(599.5, 15)");

//Creates a new geographic path generator with the default settings (GeoJSON to SVG Canvas)
var path = d3.geoPath();

Promise.all([
    fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"),
    fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")
]).then(async([map, edu]) => {
    MAP_DATA = await map.json();
    EDUCATION_DATA = await edu.json();
}).then(function() {
    console.log("fetch complete");
    generateMap(MAP_DATA, EDUCATION_DATA);
}).catch((err) => {
    console.log(err);
});

function generateMap(map_data, education_data){
  //Generate counties
  SVG.append("g") 
     .selectAll("path")
     //Converts TopoJSON topology to GeoJSON Feature
     .data(topojson.feature(map_data, map_data.objects.counties).features)
     .enter().append("path")
     .attr("d", path)
     .attr("class", "county")
     .attr("data-fips", (d) => d.id)
     .attr("data-education", function(d, i){
        var target_object = education_data.filter(function(obj) {
          return obj.fips == d.id;
        })
        if(target_object[0]){
          //We match the ids once and store them in an array for future use
          educationArray[d.id] = target_object[0];
          return educationArray[d.id].bachelorsOrHigher;
        } else {
          console.log("No data found for ", d.id);
          return 0;
        }
     })
     .attr("fill", (d) => colorScale(educationArray[d.id].bachelorsOrHigher))
     .on("mouseover", function(d){
          tooltip.transition()		
                 .duration(100)		
                 .style("opacity", .8);
          tooltip.html(educationArray[d.id]['area_name'] + "<br>" + educationArray[d.id]['state'] + ": " + educationArray[d.id].bachelorsOrHigher + "%")
                 .attr("data-education", educationArray[d.id].bachelorsOrHigher)
                 .style("left", (d3.event.pageX - 80) + "px")		
                 .style("top", (d3.event.pageY - 100) + "px");	
     })
     .on("mouseout", function(d) {		
          tooltip.transition()		
                 .duration(100)		
                 .style("opacity", 0);	
     });

  //Generate state borders, the function in the filter argument ensures that only interior borders are generated
  SVG.append("path")
      .attr("class", "county-borders")
      .datum(topojson.mesh(map_data, map_data.objects.states, function(a, b) { return a !== b; }))
      .attr("d", path);
}
