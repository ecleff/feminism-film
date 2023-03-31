// // https://gramener.github.io/d3js-playbook/transitions.html

// import {Legend, Swatches} from "@d3/color-legend"
// const legend = Legend(d3.scaleSequential([0, 2], d3.interpolateMagma), {
//   title: "Exposure"
// })
_ = d3.require('lodash@4.17.20/lodash.js').catch(() => window["_"])


// 1st viz
// set the dimensions and margins of the graph
const margin = { top: 50, right: 30, bottom: 50, left: 200 },
  width = 860 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz_1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  grouped = d3.csv("movies_grouped.csv").then(function (data) {
    data.forEach(function (d) {
      d["count_movies"] = +d["count_movies"];
      d["avg_budget"] = +d["avg_budget"];
      
      // console.log(d)
    });


  const x = d3.scaleBand()
  .range([0, width])
  .domain(data.map(d => d.year))
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

  // Y axis label
  svg.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left+60)
  .attr("x", -margin.top)
  .text("Average budget ($)")

// Add a scale for bubble size
const z = d3.scaleSqrt()
.domain([0, 50])
.range([2, 30]);

// color
const myColor = d3.scaleOrdinal()
    .domain(["notalk", "pass","fail"])
    .range(d3.schemeSet1);
// tooltip
    const tooltip = d3
    .select("#my_dataviz_1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

// A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)

  const mouseover = function (event, d) {
    tooltip.style("opacity", 1)
    .style("left", (event.x)/2 + "px")
    .style("top", (event.y)/2+30 + "px");
   
  };

  const mousemove = function (event, d) {
    tooltip
      .html(
        `Bechdel test result: ${d.viz_results}<br />
        Number of films: ${d.count_movies}<br />
        Average budget: $${d.avg_budget} `
      )
      .style("left", (event.x)/2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (event.y)/2+30 + "px");
  };
 // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
 const mouseleave = function (event, d) {
  tooltip.transition().duration(200).style("opacity", 0);
};


// Add dots

svg.append('g')
.selectAll("dot")
.data(data)
.join("circle")
  .attr("class", "bubbles")
  .attr("cx", d => x(d.year))
  .attr("cy", d =>y(d.avg_budget))
  .attr("r", d=>z(d.count_movies))
  .style("fill", d => myColor(d.viz_results))
  .style("opacity", "0.7")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

  })


  // Second Viz


// set the dimensions and margins of the graph


const svg2 = d3
  .select("#my_dataviz_2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Read the data
full = d3.csv("movies_1997_2013.csv").then(function (data) {
  data.forEach(function (d) {
    d["budget"] = +d["budget"];
    d["domgross"] = +d["domgross"];
    d["intgross"] = +d["intgross"];
    
    console.log(d)
  });


  // Add X axis
  const x2 = d3.scaleLinear()
    .domain([900, 106500000])
    .range([ 0, width ]);
  svg2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x2));

  // Add Y axis
  const y2 = d3.scaleLinear()
    .domain([4000, 2783918982])
    .range([ height, 0]);
  svg2.append("g")
    .call(d3.axisLeft(y2));

    // color
    const myColor2 = d3.scaleOrdinal()
    .domain(["notalk", "pass","fail"])
    .range(d3.schemeSet1);


  // highlight group
  const highlight = function(event,d){

    selected_group = d.viz_results

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + selected_group)
      .transition()
      .duration(200)
      .style("fill", color(selected_group))
      .attr("r", 7)
  }

  // Highlight the specie that is hovered
  const doNotHighlight = function(event,d){
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", d => myColor2(d.viz_results))
      .attr("r", 5 )
  }

  // scatterplot
    svg2.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function (d) { return "dot " + d.viz_results } )
      .attr("cx", function (d) { return x2(d.budget); } )
      .attr("cy", function (d) { return y2(d.intgross); } )
      .attr("r", 5)
      .style("fill", d => myColor2(d.viz_results))
      .style("opacity", "0.7")
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )
   


});


