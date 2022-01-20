// Bar chart of US GDP, quarterly from 1947-01-01 to 2015-07-01

const data_url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Initialize plot area
const plotSvg = d3.select("#plot-area").
append("svg").
attr("width", 950).
attr("height", 450);

// Fetch data and render plot + info
fetch(data_url).
then(response => response.json()).
then(json => {
  d3.select("#subtitle").text(json.description); // chart desc
  renderPlot(json.data, plotSvg);
  d3.select("#cite") // cite src
  .attr("class", "label").
  html(`Source: <a href="${json.display_url}" target="_blank">${json.source_name}</a>`);
});

// Function to render plot
function renderPlot(dataset, svg) {
  // Dataset has 2 columns: date and gdp
  // Dimensions of plot area
  const w = svg.attr("width");
  const h = svg.attr("height");
  const p_t = 25,p_r = 25,p_b = 30,p_l = 80; // padding, clockwise from top

  // Creating scales
  const timeSeries = dataset.map(d => new Date(d[0]));
  const endTime = new Date(d3.max(timeSeries));
  endTime.setMonth(endTime.getMonth() + 3);

  const xScale = d3.scaleTime().
  domain([d3.min(timeSeries), endTime]).
  range([p_l, w - p_r]);

  const yScale = d3.scaleLinear().
  domain([0, d3.max(dataset, d => d[1])]).
  range([h - p_b, p_t]);

  // Draw data points
  const bar_w = (w - p_l - p_r) / dataset.length;
  const bar_fill = "gray";
  const bar_hl = "blue"; // highlight on mouseover

  svg.selectAll("rect").
  data(dataset).
  enter().
  append("rect").
  attr("class", "bar").
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  attr("width", bar_w).
  attr("height", d => h - p_b - yScale(d[1])).
  attr("x", (d, i) => p_l + bar_w * i).
  attr("y", d => yScale(d[1])).
  attr("fill", bar_fill);

  // Draw axes
  svg.append("g").
  attr("id", "x-axis").
  attr("transform", `translate(0 ${h - p_b})`).
  call(d3.axisBottom(xScale));

  svg.append("g").
  attr("id", "y-axis").
  attr("transform", `translate(${p_l} 0)`).
  call(d3.axisLeft(yScale));

  svg.append("text").
  attr("id", "y-label").
  attr("class", "label").
  attr("transform", `translate(${p_l * 0.25} ${h * 0.6}) rotate(-90)`).
  text("Gross Domestic Product (billions USD)");

  // Add tooltip
  const tooltip = d3.select("main").
  append("div").
  attr("id", "tooltip").
  attr("class", "label").
  style("position", "absolute").
  style("background-color", "white").
  style("pointer-events", "none").
  style("display", "none");

  const addNumSep = num => num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  svg.selectAll(".bar").
  on("mouseover", (e, d) => {
    e.target.setAttribute("fill", bar_hl);

    tooltip.style("display", "block").
    style("top", e.pageY + "px").
    style("left", e.pageX - 75 + "px").
    attr("data-date", d[0]).
    html(`${d[0].replace(/-/g, "–")}<br/>
          <strong>${addNumSep(d[1])} billions USD</strong>`);
  }).
  on("mouseout", e => {
    e.target.setAttribute("fill", bar_fill);
    tooltip.style("display", "none");
  });

  // END renderPlot()
}