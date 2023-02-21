import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoAlbersUsa, min, max, scaleLinear } from "d3";
import useResizeObserver from "../useResizeObserver";
import { Dimensions } from "react-native";

/**
 * Component that renders a map of Germany.
 */

function StateChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const deviceSize = Dimensions.get("window");

  const minWH =
    deviceSize.width > deviceSize.height
      ? deviceSize.height / 2
      : deviceSize.width / 2;
  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("width", minWH * 2)
      .attr("height", minWH); //width 1200, height 600

    const minProp = min(
      data.features,
      (feature) => feature.properties[property]
    );
    const maxProp = max(
      data.features,
      (feature) => feature.properties[property]
    );
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "yellow"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    // const { width, height } =
    //   dimensions || wrapperRef.current.getBoundingClientRect();

    const width = minWH * 1.5; //487.5;
    const height = minWH; //305;
    console.log(dimensions);
    console.log(width);
    console.log(height);

    const projection = geoAlbersUsa()
      .translate([width, height])
      .fitSize([minWH * 1.5, minWH], {
        type: "FeatureCollection",
        features: data.features,
      });

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const path = geoPath().projection(projection);

    svg
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path);
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default StateChart;
