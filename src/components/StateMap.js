import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoAlbersUsa, min, max} from "d3";
import useResizeObserver from "../useResizeObserver";
import { Dimensions } from "react-native";
import _ from 'lodash';
import tinycolor from "tinycolor2";
import * as d3 from 'd3';
import { legendColor } from "d3-svg-legend";
import { scaleThreshold } from "d3-scale";

import './StateMap.css';




/**
 * Component that renders a map of US states.
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
    
     // Don't use local mock data due to broswer security reason. 
  // Load mock data from JSONbin instead.
  let fetchMockData = async () => {
    let url = "https://api.jsonbin.io/v3/b/63f53344ebd26539d082ca62";
    let response = await fetch(url);
    return response.json();
  };

  let colorScale = scaleThreshold()
  .domain([0, 1, 2, 5, 10])
  .range(["#313131", "#706C00", "rgb(169,164,3)", "#D7CF00", "#FFF500"]);
  
  fetchMockData()
    .then(response => {
      return Promise.all([response, d3.json('https://gist.githubusercontent.com/JoyVivian/53b03177dda52ee9ddf4f4d12fb0dbe8/raw/ee4f380bcc12330aa0a1fb94540001898ca0152e/us-states.json')]);
    })
    .then(([response, uState]) => {
      _(uState.features)
        .keyBy('properties.name')
        .merge(_.keyBy(response.record, 'state'))
        .values()
        .value();
  
      svg
        .selectAll("path")
        .data(uState.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr('transition', "all 0.2s ease-in-out")
        .attr('class', 'state')
        .style('fill', (d, i) => {
          let crimes = d.crime;
          return crimes ? colorScale(crimes) : "#313131";
        })
        .on('mouseover', (event, d) => {
          d3.select(event.target)
          .style("fill", tinycolor(colorScale(d.crime)).darken(15).toString())
          .style("cursor", "pointer");
        })
        .on('mouseout', (event, d) => {
          d3.select(event.target)
          .style("fill", () => {
            let crimes = d.crime;
            return crimes ? colorScale(crimes) : "#313131";
          });
        });
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });

    const legend = legendColor()
    .scale(colorScale)
    .labels(["0", "1", "2-4", "5-9", "10+"])
    .title("Crime Rate")

    const legendGroup = svg.append("g")
    .attr("transform", "translate(20, 20)");

    legendGroup.call(legend);

  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default StateChart;
