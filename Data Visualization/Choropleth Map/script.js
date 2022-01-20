// Choropleth map of the US educational attainment

const mapDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const plotDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

d3.select("#cite-link").
attr("href", "https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx").
text("USDA Economic Research Service");

// Initialize plot area
const plotArea = d3.select("#plot-area").
append("svg").
attr("width", 960).
attr("height", 610);

// Fetch data and render plot
Promise.all([d3.json(mapDataUrl), d3.json(plotDataUrl)]).
then(data => {
  render(data[0], data[1], plotArea);
}).
catch(e => console.log(e));

// Function to render map and plot data
function render(mapData, plotData, svg) {
  // Color scale
  const values = plotData.map(i => i.bachelorsOrHigher);

  const colorScale = d3.scaleQuantize().
  domain([d3.min(values), d3.max(values)]).
  range(d3.schemePuBu[9]);

  // Draw map
  const pathGen = d3.geoPath();

  svg // counties
  .append("g").
  attr("class", "counties").
  selectAll("path").
  data(topojson.feature(mapData, mapData.objects.counties).features).
  join("path").
  attr("class", "county").
  attr("data-fips", d => d.id).
  attr("data-education", d => {
    const obj = plotData.find(i => i.fips == d.id);
    if (obj) return obj.bachelorsOrHigher;
  }).
  attr("fill", d => {
    const obj = plotData.find(i => i.fips == d.id);
    return obj ? colorScale(obj.bachelorsOrHigher) : "lightgray";
  }).
  attr("d", pathGen);

  svg // boundary
  .append("path").
  datum(topojson.mesh(mapData, mapData.objects.states, (a, b) => a !== b)).
  attr("class", "boundary").
  attr("fill", "none").
  attr("d", pathGen);

  svg.
  append("path").
  datum(topojson.mesh(mapData, mapData.objects.nation)).
  attr("class", "boundary").
  attr("fill", "none").
  attr("d", pathGen);

  // Add legend
  const legendW = 390;
  const legendP = 15;
  const legendN = colorScale.range().length;
  const tickVals = [d3.min(values), ...colorScale.thresholds(), d3.max(values)];

  const legendScale = d3.scaleLinear().
  domain([0, legendN]).
  range([legendP, legendW - legendP]);

  const legend = d3.select("#legend").
  append("svg").
  attr("width", legendW).
  attr("height", 45);

  /*
  legend // label
    .append("text")
      .text("Percentage of population (%)")
      .attr("id", "legend-label")
      .attr("class", "label")
      .attr("y", 20);
  */

  legend // cells
  .selectAll("rect").
  data(colorScale.range()).
  join("rect").
  attr("width", (legendW - legendP * 2) / legendN).
  attr("height", 10).
  attr("x", (d, i) => legendScale(i)).
  attr("y", 10).
  attr("fill", d => d);

  legend // ticks
  .append("g").
  attr("transform", `translate(0 8)`).
  call(d3.axisBottom(legendScale).
  tickFormat(i => tickVals[i].toFixed(1) + "%").
  ticks(legendN + 1).
  tickSize(18)).
  select(".domain").
  remove();

  // Add tooltip
  const tooltip = d3.select("body").
  append("div").
  attr("id", "tooltip").
  attr("class", "label").
  style("position", "absolute").
  style("pointer-events", "none").
  style("display", "none");

  svg.selectAll(".county").
  on("mouseover", (e, d) => {
    e.target.setAttribute("stroke", "black");
    const obj = plotData.find(i => i.fips == d.id);

    tooltip.style("display", "block").
    style("top", e.pageY + 10 + "px").
    style("left", e.pageX + 10 + "px").
    attr("data-education", obj.bachelorsOrHigher).
    html(`<strong>${obj.area_name},</strong> ${obj.state}<br/>
          ${obj.bachelorsOrHigher}%`);
  }).
  on("mouseout", e => {
    e.target.setAttribute("stroke", "none");
    tooltip.style("display", "none");
  });

  // END render()
}