import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoAlbersUsa } from "d3";
import { Dimensions, View, Text } from "react-native";
import _ from "lodash";
import tinycolor from "tinycolor2";
import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
// import d3Tip from "d3-tip";
import { Svg, Path } from "react-native-svg";

import Legend from "./MapLegend";

/**
 * Component that renders a map of US states.
 */

function StateChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const tooltipRef = useRef();
  const deviceSize = Dimensions.get("screen");

  const minWH =
    deviceSize.width > deviceSize.height
      ? deviceSize.height / 2
      : deviceSize.width / 2;

  // Set up color scale.
  let colorScale = d3
    .scaleThreshold()
    .domain([0, 1, 2, 5, 10])
    .range(["#313131", "#706C00", "rgb(169,164,3)", "#D7CF00", "#FFF500"]);

  const [uState, setUState] = useState([]);

  // Set the width and height of the map.
  const width = minWH * 1.5;
  const height = minWH;

  const projection = geoAlbersUsa()
    .translate([width, height])
    .fitSize([width, height], {
      type: "FeatureCollection",
      features: data.features,
    });

  // Takes geojson data,
  // Transforms that into the d attribute of a path element
  const path = geoPath().projection(projection);

  //Set up the legend.
  const legend = legendColor()
    .scale(colorScale)
    .labels(["0", "1", "2-4", "5-9", "10+"])
    .title("Crime Rate");

  const colors = legend.cells().map((cell) => cell.label);
  const labels = legend.labels();

  const showTooltip = (event, data) => {
    const tooltip = tooltipRef.current;
    tooltip.style.opacity = 1;
    tooltip.style.left = event.nativeEvent.pageX + "px";
    tooltip.style.top = event.nativeEvent.pageY + "px";
    tooltip.innerHTML = `<div>${data.properties.name}</div>
                         <div>Crime rate: ${data.crime}</div>`;
  };

  const hideTooltip = () => {
    const tooltip = tooltipRef.current;
    tooltip.style.opacity = 0;
  };

  // Will be called initially and on every data change
  useEffect(() => {
    // Set the width and height og the whole svg.
    const svg = select(svgRef.current);
    // .attr("width", minWH * 2)
    // .attr("height", minWH * 1.5);

    // Don't use local mock data due to broswer security reason.
    // Load mock data from JSONbin instead.
    let fetchMockData = async () => {
      let url = "https://api.jsonbin.io/v3/b/63f53344ebd26539d082ca62";
      let response = await fetch(url);
      let json = await response.json();
      return json.record;
    };

    // Fetch data from JSONbin and draw the map.
    fetchMockData()
      .then((response) => {
        return Promise.all([
          response,
          d3.json(
            "https://gist.githubusercontent.com/JoyVivian/53b03177dda52ee9ddf4f4d12fb0dbe8/raw/ee4f380bcc12330aa0a1fb94540001898ca0152e/us-states.json"
          ),
        ]);
      })
      .then(([response, uState]) => {
        // Merge the data from JSONbin with the geojson data using loadsh.
        uState.features = _(uState.features)
          .keyBy("properties.name")
          .merge(_.keyBy(response, "state"))
          .values()
          .value();

        setUState(uState);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, [data, property]);

  return (
    <View ref={wrapperRef} style={{ flexDirection: "row" }}>
      <Legend colorScale={colorScale} />
      <Svg ref={svgRef} width={minWH * 2} height={minWH * 1.5}>
        {uState &&
          uState.features &&
          uState.features.map((d, i) => {
            const crimes = d.crime;
            const fill = crimes ? colorScale(crimes) : "#313131";

            if (!path) {
              return null;
            }

            return (
              <Path
                key={i}
                d={path(d)}
                transform={`translate(70, 20)`}
                strokeWidth={1}
                stroke="gray"
                fill={fill}
              />
            );
          })}
      </Svg>
    </View>
  );
}

export default StateChart;
