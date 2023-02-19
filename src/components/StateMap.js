import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoAlbersUsa, min, max, scaleLinear } from "d3";
import useResizeObserver from "../useResizeObserver";

/**
 * Component that renders a map of Germany.
 */

function StateChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);


  // will be called initially and on every data change
  useEffect(() => {
    
    const svg = select(svgRef.current).attr("width", 1200).attr("height", 600);

    const minProp = min(data.features, feature => feature.properties[property]);
    const maxProp = max(data.features, feature => feature.properties[property]);
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "yellow"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    // const { width, height } =
    //   dimensions || wrapperRef.current.getBoundingClientRect();

    const width = 487.5
    const height = 305
    

    console.log(width);
    console.log(height);

      const projection = geoAlbersUsa().translate([width, height]).scale([1300]);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const path = geoPath().projection(projection);

    svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr("d", path)

  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default StateChart;