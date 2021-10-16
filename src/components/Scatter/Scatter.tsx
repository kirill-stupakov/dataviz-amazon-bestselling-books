import React, { useState, useEffect, useRef } from "react";
import {
  scaleLinear,
  scaleSqrt,
  scaleLog,
  scaleOrdinal,
  extent,
  axisBottom,
  axisLeft,
  select,
} from "d3";

import "./Scatter.scss";

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

const Scatter: React.FC<Props> = ({ data }) => {
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const width = 1000;
  const height = 600;
  const margin = { top: 50, bottom: 50, right: 150, left: 50 };

  const { author, genre, name, price, reviews, rating, year } =
    data[selectedBook || 0];

  const xScale = scaleSqrt()
    // @ts-ignore
    .domain(extent(data, (d) => d.price))
    .range([margin.left, width - margin.right])
    .nice();

  const yScale = scaleLog()
    // @ts-ignore
    .domain(extent(data, (d) => d.reviews))
    .range([height - margin.bottom, margin.top])
    .nice();

  const radiusScale = scaleLinear()
    // @ts-ignore
    .domain(extent(data, (d) => d.rating))
    .range([3, 10]);

  const genres = Array.from(new Set(data.map((d) => d.genre)));
  const colorScale = scaleOrdinal()
    .domain(genres)
    .range(["#2a9d8f", "#f4a261"]);

  const axisGenerator = axisBottom(xScale);

  return (
    <svg ref={ref} width={width} height={height} className="scatter">
      {data.map((d, index) => (
        <circle
          key={index}
          onMouseEnter={() => setSelectedBook(index)}
          onMouseLeave={() => setSelectedBook(null)}
          r={radiusScale(d.rating)}
          cx={xScale(d.price)}
          cy={yScale(d.reviews)}
          // @ts-ignore
          fill={colorScale(d.genre)}
          fillOpacity={selectedBook === null ? 0.3 : 0.15}
        />
      ))}

      {selectedBook !== null && (
        <g transform={`translate(${xScale(price)}, ${yScale(reviews)})`}>
          <circle
            className="label-circle"
            r={radiusScale(rating)}
            // @ts-ignore
            fill={colorScale(genre)}
            stroke="#264653"
            strokeWidth={1.5}
          />
          <g
            transform={`translate(${radiusScale(rating) + 10}, 0)`}
            fill="#264653"
          >
            <text y={-15}>
              {author}, {genre}
            </text>
            <text y={5}>
              {`"${
                name.split(" ").length < 6
                  ? name
                  : name.split(" ").slice(0, 5).join(" ") + "..."
              }"`}
            </text>
            <text y={25}>
              {year}, {rating}★
            </text>
          </g>
        </g>
      )}
    </svg>
  );
};

export default Scatter;
