// Treemap diagram of selected dataset
// TODO: responsive sizing

const datasets = {
  kickstarter: {
    title: "Top 100 Most Pledged Kickstarter Campaigns",
    desc: "Grouped by category",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json" },

  movie: {
    title: "Top 100 Highest Grossing Movies",
    desc: "Grouped by genre",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json" },

  game: {
    title: "Top 100 Best Selling Video Games",
    desc: "Grouped by platform",
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json" } };



// Initialize plot area
const plotArea = d3.select("#plot-area").
append("svg").
attr("width", 1200).
attr("height", 742);

// Fetch data as selected and render plot
let datasetId = d3.select("#select-dataset").node().value;
selectAndRender(datasetId);

d3.select("#select-dataset").
on("change", e => {
  if (e.target.value != datasetId) {
    datasetId = e.target.value;
    selectAndRender(datasetId);
  }
});

function selectAndRender(id) {
  const dataset = datasets[id];

  d3.select("#title").
  text(dataset.title);

  d3.select("#description").
  text(dataset.desc);

  d3.select("#cite-link").
  attr("href", dataset.url);

  d3.json(dataset.url).
  then(data => render(data, plotArea)).
  catch(e => console.log(e));
}

// Function to render plot
function render(data, svg) {
  // Dimensions of plot
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const w = svg.attr("width") - margin.right - margin.left;
  const h = svg.attr("height") - margin.top - margin.bottom;

  const plot = svg.append("g").
  attr("transform", `translate(${margin.left} ${margin.top})`);

  // Compute data and position of nodes
  const root = d3.hierarchy(data).
  sum(d => d.value).
  sort((a, b) => b.height - a.height || b.value - a.value);

  d3.treemap().
  size([w, h]).
  padding(2)(
  root);

  // Create color scale
  let cats = root.leaves().map(i => i.data.category);
  cats = [...new Set(cats)];
  const shuffledCats = shuffleArray(cats);

  const colorScale = d3.scaleSequential().
  domain([0, cats.length - 1]).
  interpolator(d3.interpolateSpectral);

  // Draw data points
  d3.selectAll(".leaf").remove();

  const leaves = plot // leaves as g containing rect, text, etc.
  .selectAll("g").
  data(root.leaves()).
  join("g").
  attr("class", "leaf").
  attr("transform", d => `translate(${d.x0} ${d.y0})`);

  leaves // the colored tiles
  .append("rect").
  attr("class", "tile").
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.value).
  attr("width", d => d.x1 - d.x0).
  attr("height", d => d.y1 - d.y0).
  attr("fill", d => colorScale(shuffledCats.indexOf(d.data.category)));

  const tileLabelPadding = 4;
  const tileLabelSize = 12;

  leaves // labels clipping path
  .append("clipPath").
  attr("id", (d, i) => `clip-${i}`).
  append("rect").
  attr("width", d => d.x1 - d.x0 - tileLabelPadding).
  attr("height", d => d.y1 - d.y0 - tileLabelPadding);

  leaves // labels
  .append("text").
  attr("class", "tile-label").
  attr("clip-path", (d, i) => `url(#clip-${i})`).
  style("pointer-events", "none").
  style("font-size", tileLabelSize + "px").
  selectAll("tspan").
  data(d => d.data.name.split(/(?=(?<=\s)[A-Za-z]+)/g)).
  join("tspan").
  attr("x", tileLabelPadding).
  attr("dy", tileLabelPadding + tileLabelSize).
  text(d => d);

  // Add tooltip
  const tooltip = d3.select("body").
  append("div").
  attr("id", "tooltip").
  style("position", "absolute").
  style("pointer-events", "none").
  style("display", "none");

  plot.selectAll(".leaf").
  on("mouseover", (e, d) => {
    e.target.classList.add("tile_hover");

    tooltip.style("display", "block").
    style("top", e.pageY + 10 + "px").
    style("left", e.pageX + 10 + "px").
    attr("data-value", d.value).
    html(`<strong>${d.data.name}</strong></br>
          Category: ${d.data.category}</br>
          Value: ${d.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}`);
  }).
  on("mouseout", e => {
    e.target.classList.remove("tile_hover");
    tooltip.style("display", "none");
  });

  // Add legend
  d3.selectAll("#legend svg").remove();

  const legendItems = d3.select("#legend").
  selectAll("svg").
  data(cats).
  join("svg").
  attr("width", 150).
  attr("height", tileLabelSize);

  legendItems.
  append("rect").
  attr("class", "legend-item").
  attr("width", tileLabelSize * 2).
  attr("height", tileLabelSize).
  attr("fill", d => colorScale(shuffledCats.indexOf(d)));

  legendItems.
  append("text").
  attr("class", "legend-label").
  attr("x", tileLabelSize * 2 + 5).
  attr("dominant-baseline", "hanging").
  style("font-size", tileLabelSize + "px").
  text(d => d);

  // END render()
}

// Fisher-Yates shuffle, from StackOverflow
function shuffleArray(array) {
  const res = [...array];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}