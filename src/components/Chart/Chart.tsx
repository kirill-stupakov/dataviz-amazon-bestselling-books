import React from "react";
import { scaleLinear, scaleLog, scaleOrdinal, extent } from "d3";

import "./Chart.scss";

type data = {
  author: string;
  genre: string;
  name: string;
  price: number;
  reviews: number;
  rating: number;
  year: number;
}[];

interface Props {
  data: data;
}

const Chart: React.FC<Props> = ({ data }) => {
  const width = 1024;
  const height = 768;
  const margin = { top: 20, bottom: 20, right: 20, left: 20 };

  const xScale = scaleLinear()
    // @ts-ignore
    .domain(extent(data, (d) => d.price))
    .range([margin.left, width - margin.right]);

  const yScale = scaleLog()
    // @ts-ignore
    .domain(extent(data, (d) => d.reviews))
    .range([height - margin.bottom, margin.top]);

  const genres = Array.from(new Set(data.map((d) => d.genre)));
  const colorScale = scaleOrdinal()
    .domain(genres)
    .range(["#ff000020", "#0000ff20"]);

  return (
    <svg width={width} height={height}>
      {data.map((d) => (
        <circle
          r={20}
          cx={xScale(d.price)}
          cy={yScale(d.reviews)}
          // @ts-ignore
          fill={colorScale(d.genre)}
          style={{ transition: "0.3s" }}
        />
      ))}
    </svg>
  );
};

export default Chart;
