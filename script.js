// // https://gramener.github.io/d3js-playbook/transitions.html

// import {Legend, Swatches} from "@d3/color-legend"
// const legend = Legend(d3.scaleSequential([0, 2], d3.interpolateMagma), {
//   title: "Exposure"
// })

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 860 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
//Read the data
d3.csv("movies.csv").then(function (data) {
  data.forEach(function (d) {
    d["budget"] = +d["budget"];
    d["domgross"] = +d["domgross"];
    d["intgross"] = +d["intgross"];
  });
  // Add X axis
});


