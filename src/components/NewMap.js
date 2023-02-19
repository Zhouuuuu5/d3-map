import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

const drawMap = () => {
    // Create the projection to use for the map
    const projection = d3.geoAlbersUsa()
      .scale(1280)
      .translate([480, 300]);
  
    // Create the path generator
    const path = d3.geoPath()
      .projection(projection);
  
    // Create the svg element
    const svg = d3.select("#map")
      .append("svg")
      .attr("width", 960)
      .attr("height", 600);
  
    // Draw the states
    d3.json("https://d3js.org/us-10m.v1.json", (error, us) => {
        svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
      .attr("d", path)
      .style("fill", "lightgray")
      .style("stroke", "white")
      .style("stroke-width", "1");
    })
  };
  
  const Map = () => {
    const mapRef = useRef(null);
  
    useEffect(() => {
      drawMap();
    }, []);
  
    return (
      <div ref={mapRef} id="map"></div>
    );
  };
  
  export default Map;