// Heat map of global land temp

const dataUrl = `https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/
master/global-temperature.json`;

d3.select("#cite-link").
attr("href", dataUrl);

// Initialize plot area
const plotSvg = d3.select("#plot-area").
append("svg").
attr("width", 2500).
attr("height", 400);

// Fetch data and render plot
fetch(dataUrl).
then(response => response.json()).
then(json => {
  renderPlot(json, plotSvg);
}).
catch(e => {
  console.log(e);
});

// Function to render plot
function renderPlot(dataset, svg) {
  // Dimensions of plot area
  const w = svg.attr("width");
  const h = svg.attr("height");
  const pT = 15,pR = 15,pB = 30,pL = 60; // padding, clockwise from top

  // Dataset has 3 columns: year, month, variance
  // Alter dataset (copy) for plotting
  const df = [...dataset.monthlyVariance];

  df.forEach(d => {
    d.month -= 1;
    d.temp = (dataset.baseTemperature + d.variance).toFixed(3);
  });

  // Creating scales
  const yearSeries = [...new Set(df.map(d => d.year))];
  const monthSeries = d3.range(12);

  const xScale = d3.scaleBand().
  domain(yearSeries).
  range([pL, w - pR]);

  const yScale = d3.scaleBand().
  domain(monthSeries).
  range([pT, h - pB]);

  const colorScale = d3.scaleThreshold().
  domain([-3, -2, -1, 0, 1, 2, 3]).
  range(d3.schemeRdBu[8].reverse());

  // Draw data points
  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();

  svg.selectAll("rect").
  data(df).
  join("rect").
  attr("class", "cell").
  attr("data-month", d => d.month).
  attr("data-year", d => d.year).
  attr("data-temp", d => d.temp).
  attr("width", cellW).
  attr("height", cellH).
  attr("x", d => xScale(d.year)).
  attr("y", d => yScale(d.month)).
  attr("fill", d => colorScale(d.variance));

  // Draw axes
  const xAxis = d3.axisBottom(xScale).
  tickValues(yearSeries.filter(y => y % 10 == 0));

  const yAxis = d3.axisLeft(yScale).
  tickFormat(m => d3.timeFormat("%B")(new Date(2000, m))).
  tickSize(0);

  svg.append("g").
  attr("id", "x-axis").
  attr("transform", `translate(0 ${h - pB})`).
  call(xAxis);

  svg.append("g").
  attr("id", "y-axis").
  attr("transform", `translate(${pL} 0)`).
  call(yAxis);

  // Add legend
  const legend = d3.select("#legend").
  append("svg").
  attr("height", 65);

  const legendW = 300;
  const legendN = colorScale.range().length;

  const legendScale = d3.scaleLinear().
  domain([1, legendN - 1]).
  range([legendW / legendN, legendW - legendW / legendN]);

  legend.append("text").
  text("Variance (℃)").
  attr("class", "label").
  attr("y", 20);

  legend.selectAll("rect").
  data(colorScale.range()).
  join("rect").
  attr("width", legendW / legendN).
  attr("height", 10).
  attr("x", (d, i) => legendScale(i)).
  attr("y", 30).
  attr("fill", d => d);

  legend.append("g").
  attr("transform", `translate(0 28)`).
  call(d3.axisBottom(legendScale).
  tickFormat(i => d3.format("+")(colorScale.domain()[i - 1])).
  ticks(legendN).
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

  svg.selectAll(".cell").
  on("mouseover", (e, d) => {
    e.target.setAttribute("stroke", "black");

    tooltip.style("display", "block").
    style("top", e.pageY + "px").
    style("left", e.pageX + "px").
    attr("data-year", d.year).
    html(`<strong>${d3.timeFormat("%B")(new Date(2000, d.month))}
          ${d.year}</strong><br/>
          Variance: ${d3.format("+")(d.variance)}℃</br>
          Temperature: ${d.temp}℃`);
  }).
  on("mouseout", e => {
    e.target.setAttribute("stroke", "none");
    tooltip.style("display", "none");
  });

  // END renderPlot()
}