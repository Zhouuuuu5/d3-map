import React from "react";
import * as d3 from "d3";

function Legend({ colorScale }) {
  const legendWidth = 200;
  const legendHeight = 20;

  // create an array of thresholds based on the domain of the color scale
  const thresholds = colorScale.domain();

  // create an array of colors based on the thresholds
  const colors = colorScale.range();

  // create a d3 scale for the x-axis of the legend
  const xScale = d3
    .scaleLinear()
    .domain([thresholds[0], thresholds[thresholds.length - 1]])
    .range([0, legendWidth]);

  // create a d3 axis for the x-axis of the legend
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(thresholds)
    .tickFormat((d) => d.toFixed(1));

  return (
    <svg width={legendWidth} height={legendHeight}>
      <g transform={`translate(0, ${legendHeight / 2})`}>
        {colors.map((color, i) => (
          <rect
            key={i}
            x={xScale(thresholds[i])}
            width={xScale(thresholds[i + 1]) - xScale(thresholds[i])}
            height={legendHeight}
            fill={color}
          />
        ))}
      </g>
      <g transform={`translate(0, ${legendHeight})`}>
        <g ref={(node) => d3.select(node).call(xAxis)} />
      </g>
    </svg>
  );
}

export default Legend;
