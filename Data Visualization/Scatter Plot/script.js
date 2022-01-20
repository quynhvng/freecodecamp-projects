// Scatter plot of cyclists' race time, grouped by doping allegation

const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// Initialize plot area
const plotSvg = d3.select("#plot-area").
append("svg").
attr("width", 900).
attr("height", 500);

// Fetch data and render plot
fetch(dataUrl).
then(response => response.json()).
then(json => {
  renderPlot(json, plotSvg);
});

// Function to render plot
function renderPlot(dataset, svg) {
  // Dataset has 8 columns: time, place, seconds, name, year, nationality, doping, url
  const df = [...dataset];
  df.forEach(d => {d.Time = new Date(d.Seconds * 1000);}); // convert time to date object

  // Dimensions of plot area
  const w = svg.attr("width");
  const h = svg.attr("height");
  const pT = 25,pR = 25,pB = 60,pL = 80; // padding, clockwise from top

  // Creating scales
  const xScale = d3.scaleLinear().
  domain([d3.min(df, d => d.Year) - 1, d3.max(df, d => d.Year) + 1]).
  range([pL, w - pR]);

  const minY = d3.min(df, d => d.Time).getMinutes();
  const maxY = d3.max(df, d => d.Time).getMinutes() + 1;

  const yScale = d3.scaleTime().
  domain([new Date(minY * 60000), new Date(maxY * 60000)]).
  range([h - pB, pT]);

  // Draw data points
  const r = 6;
  const fDoping = [
  {
    label: "Not associated with doping",
    color: "blue" },

  {
    label: "Associated with doping",
    color: "orange" }];



  svg.selectAll("circle").
  data(df).
  enter().
  append("circle").
  attr("class", "dot").
  attr("data-xvalue", d => d.Year).
  attr("data-yvalue", d => d.Time).
  attr("r", r).
  attr("cx", d => xScale(d.Year)).
  attr("cy", d => yScale(d.Time)).
  attr("fill", d => d.Doping ? fDoping[1].color : fDoping[0].color);

  // Add legend
  const legend = svg.append("g").
  attr("id", "legend").
  attr("transform", `translate(${w * 0.7} ${h * 0.65})`);

  legend.append("rect").
  attr("width", 250).
  attr("height", 80).
  attr("fill", "white").
  attr("stroke", "gray");

  legend.selectAll("circle").
  data(fDoping).
  enter().
  append("circle").
  attr("r", r).
  attr("cx", 20).
  attr("cy", (d, i) => 30 + 20 * i).
  attr("fill", d => d.color);

  legend.selectAll("text").
  data(fDoping).
  enter().
  append("text").
  attr("class", "label").
  attr("x", 30).
  attr("y", (d, i) => r + 30 + 20 * i).
  attr("fill", d => d.color).
  text(d => d.label);

  // Draw axes
  const xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).
  tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g").
  attr("id", "x-axis").
  attr("transform", `translate(0 ${h - pB})`).
  call(xAxis);

  svg.append("g").
  attr("id", "y-axis").
  attr("transform", `translate(${pL} 0)`).
  call(yAxis);

  svg.append("text").
  attr("id", "x-label").
  attr("class", "label").
  attr("transform", `translate(${(w - pL - pR) / 2 + pL} ${h - pB * 0.25})`).
  attr("text-anchor", "middle").
  text("Year");

  svg.append("text").
  attr("id", "y-label").
  attr("class", "label").
  attr("transform", `translate(${pL * 0.25} ${pT}) rotate(-90)`).
  attr("text-anchor", "end").
  text("Race time (mm:ss)");

  // Add tooltip
  const tooltip = d3.select("main").
  append("div").
  attr("id", "tooltip").
  attr("class", "label").
  style("position", "absolute").
  style("pointer-events", "none").
  style("display", "none");

  svg.selectAll(".dot").
  on("mouseover", (e, d) => {
    e.target.setAttribute("stroke", "black");

    tooltip.style("display", "block").
    style("top", e.pageY + "px").
    style("left", e.pageX + "px").
    style("background-color", d.Doping ?
    "rgba(255, 165, 0, 0.7)" :
    "rgba(255, 255, 255, 0.7)").
    attr("data-year", d.Year).
    html(`<strong>${d.Name}</strong><br/>
          Best time: ${d.Time.toISOString().substring(14, 19)} (${d.Year})</br>
          ${d.Doping ? d.Doping : "No association with doping"}`);
  }).
  on("mouseout", e => {
    e.target.setAttribute("stroke", "none");
    tooltip.style("display", "none");
  });

  // END renderPlot()
}