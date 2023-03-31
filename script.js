// // https://gramener.github.io/d3js-playbook/transitions.html

// import {Legend, Swatches} from "@d3/color-legend"
// const legend = Legend(d3.scaleSequential([0, 2], d3.interpolateMagma), {
//   title: "Exposure"
// })
_ = d3.require('lodash@4.17.20/lodash.js').catch(() => window["_"])

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 100 },
  width = 860 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
//Read the data
d3.csv("movies_1997_2013.csv").then(function (data) {
  data.forEach(function (d) {
    d["budget"] = +d["budget"];
    d["domgross"] = +d["domgross"];
    d["intgross"] = +d["intgross"];
    
    console.log(d)
  });
ok = Object.keys(data[0])
console.log(ok)

// average budget by results + year
avgBudget = d3.rollups(
  data,
  v => ({
    count: v.length,
    mean_budget: d3.mean(v, d => +d.budget), // get the average estimated project cost!
  }),
  d => d.year,
  d => d.viz_results
  
)
console.log(avgBudget)


aB_data = avgBudget.map(d => {
  let obj = {};
  const [key, value] = d;
  obj = { key: key, value: value.count };
  return obj;
})

console.log(aB_data)

let root = d3.hierarchy(aB_data);
root.sum(function(d) {
return d[1];
})

console.log(root)


  // Add X axis
  // //   .style("fill", d => myColor(d.clean_test))

  const x = d3.scaleBand()
  .range([0, width])
  .domain(data.map(d => d.key))
  .padding(0.2);
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add X axis label:
  svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height+50 )
  .text("Year");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([10000000, 106500000])
    // .domain([10,100])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(20));
// Add a scale for bubble size
const z = d3.scaleSqrt()
.domain([0, 50])
.range([2, 30]);
// color
const myColor = d3.scaleOrdinal()
    .domain(["notalk", "pass","fail"])
    .range(d3.schemeSet1);
// Add dots
// svg.append('g')
// .selectAll("dot")
// .data(data)
// .join("circle")
// //   .attr("class", function(d) { return "bubbles " + d.clean_test })
//   .attr("cx", d => x(d.year))
//   .attr("cy", y(avgBudget))
//   .attr("r", z(countMovies))
//   .style("fill", d => myColor(d.clean_test))


svg
    .append("g")
    .selectAll("dot")
    .data(root.descendants())
    .join("circle")
    .attr("cx", d => x(d.key))
    .attr("cy",  d => y(d.value.mean_budget))
    .attr("r", 6)
   


});


