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


// csv with rollup

d3.csv("movies_1997_2013.csv").then(data => {
  var ungroupedData = data.slice();
  const groupedData = d3.rollup(
    data,
    yearData => {
      return d3.rollup(
        yearData,
        v => ({
          count: v.length,
          budgetMean: d3.mean(v, d => d.budget)
        }),
        d => d.viz_results
      );
    },
    d => d.year
  );

  

  const transformedData = Array.from(groupedData, ([year, yearData]) => ({
    year: year,
    bechdelResults: Array.from(yearData, ([key, value]) => ({
      bechdelResult: key,
      movieCount: value.count,
      budgetMean: value.budgetMean
    }))
  }));

  console.log(transformedData);
  const scatterData = transformedData.flatMap(yearData =>
    yearData.bechdelResults.map(bechdelResultData => ({
      year: yearData.year,
      bechdelResult: bechdelResultData.bechdelResult,
      movieCount: bechdelResultData.movieCount,
      budgetMean: bechdelResultData.budgetMean
    }))
  ).sort((a, b) => a.year - b.year);

  console.log(scatterData)
const formatNumber = d3.format(".2s");
const x = d3.scaleBand()
  .range([0, width])
  .domain(scatterData.map(d => d.year))
  .padding(0.5);
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
    .call(d3.axisLeft(y).ticks(20).tickFormat(formatNumber));

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

// // color
const myColor = d3.scaleOrdinal()
    .domain(["nowomen", "pass","fail"])
    .range(["#231123", "#558c8c", "#82204a"]);
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
  const formatMoney = d3.format(",.4r")
  const mouseover = function (event, d) {
    tooltip.style("opacity", 1)
    .style("left", (event.x)/2 + "px")
    .style("top", (event.y)/2 + "px");
   
  };

  const mousemove = function (event, d) {
    if (tooltip.style("opacity") !== "0") {
      tooltip
        .html(
          `In ${d.year}, Hollywood spent an average of $${formatMoney(
            d.budgetMean
          )} per movie <br /> that had a Bechdel Test result of: ${d.bechdelResult}
   `
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
    }
  };
 // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
 const mouseleave = function (event, d) {
  tooltip.transition().duration(200).style("opacity", 0);
};


// Add dots



svg.append('g')
.selectAll("dot")
.data(scatterData)
.join("circle")
  .attr("class", "bubbles")
  .attr("cx", d => x(d.year))
  .attr("cy", d =>y(d.budgetMean))
  .attr("r", d=>z(d.movieCount))
  .style("fill", d => myColor(d.bechdelResult))
  .style("opacity", "0.7")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)
  .on('click', function(event, d) {
    const selectedYear = d.year;
    const filteredData = ungroupedData.filter(d => d.year === selectedYear);
    updateSecondGraph(filteredData);
    console.log(filteredData)

      // Show tooltip
  // tooltip.style("opacity", 1)
  // .html("Your tooltip content here");
  });

  // Load the data and create the first graph
// apply the year filter to the original data
console.log(ungroupedData)


// Append a new SVG element for the second scatterplot
const svg2 = d3.select("#my_dataviz_1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Draw the second scatterplot with the filtered data
function updateSecondGraph(filteredData) {
  svg2.selectAll("g").remove();
  svg2.selectAll("text").remove();
  const formatNumber = d3.format(".2s");
  const x2 = d3.scaleBand()
    .range([0, width])
    .domain(filteredData.map(d => d.budget))
    .padding(0.5);

  svg2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x2).tickValues(x2.domain().filter((d, i) => !(i % Math.ceil(filteredData.length / 5)))).tickFormat(formatNumber))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(0)")
      .style("text-anchor", "end")
      // .style("font-size", "6px");
  svg2.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height+45 )
    .text("Budget");
 
 
  
  const y2 = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.intgross)])
    .range([height, 0]);
  svg2.append("g")
    .call(d3.axisLeft(y2).ticks(5).tickFormat(formatNumber));

  svg2.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+60)
    .attr("x", -margin.top)
    .text("International gross");

  svg2.append("text")
    .data(filteredData)
    .attr("text-anchor", "end")
    .attr("x", width-500)
    .attr("y", height-510)
    .style("font-size", "24px")
    .text(function(d) {
      return d.year;
    });

  const myColor = d3.scaleOrdinal()
    .domain(["nowomen", "pass","fail"])
    .range(["#231123", "#558c8c", "#82204a"]);

  // tooltip
  const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "white");

  // dots
  const formatMoney = d3.format(",.4r")
    svg2.selectAll(".dot")
    .data(filteredData)
    .join("circle")
    .attr("class", "dot")
    .attr("cx", d => x2(d.budget))
    .attr("cy", d => y2(d.intgross))
    .attr("r", 5)
    .style("fill", d => myColor(d.viz_results))
    .style("opacity", "0.7")
    .on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`Movie title: ${d.title}<br>Budget: $${formatMoney(d.budget)}<br>International gross: $${formatMoney(d.intgross)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", function(event) {
      tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", function(event) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

}

})



