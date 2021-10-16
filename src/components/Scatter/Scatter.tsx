import React, { useState } from "react";
import { scaleLinear, scaleSqrt, scaleLog, scaleOrdinal, extent } from "d3";

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
  const [chosenBook, setChosenBook] = useState<number | null>(null);

  const width = 1440;
  const height = 900;
  const margin = { top: 50, bottom: 50, right: 150, left: 50 };

  const xScale = scaleLinear()
    // @ts-ignore
    .domain(extent(data, (d) => d.price))
    .range([margin.left, width - margin.right]);

  const yScale = scaleLog()
    // @ts-ignore
    .domain(extent(data, (d) => d.reviews))
    .range([height - margin.bottom, margin.top]);

  const radiusScale = scaleSqrt()
    // @ts-ignore
    .domain(extent(data, (d) => d.rating))
    .range([10, 20]);

  const genres = Array.from(new Set(data.map((d) => d.genre)));
  const colorScale = scaleOrdinal()
    .domain(genres)
    .range(["#2a9d8f25", "#f4a26125"]);

  return (
    <svg width={width} height={height} className="scatter">
      {data.map((d, index) => (
        <circle
          key={index}
          onMouseEnter={() => setChosenBook(index)}
          onMouseLeave={() => setChosenBook(null)}
          r={radiusScale(d.rating)}
          cx={xScale(d.price)}
          cy={yScale(d.reviews)}
          // @ts-ignore
          fill={colorScale(d.genre)}
          stroke="#264653"
          strokeWidth={1.5}
          strokeOpacity={index === chosenBook ? 1 : 0}
        />
      ))}
      {chosenBook !== null && (
        <>
          <text
            x={
              xScale(data[chosenBook].price) +
              radiusScale(data[chosenBook].rating + 1)
            }
            y={yScale(data[chosenBook].reviews) - 15}
          >
            {data[chosenBook].author}
          </text>
          <text
            x={
              xScale(data[chosenBook].price) +
              radiusScale(data[chosenBook].rating + 1)
            }
            y={yScale(data[chosenBook].reviews) + 5}
          >
            {`"${
              data[chosenBook].name.split(" ").length < 5
                ? data[chosenBook].name
                : data[chosenBook].name.split(" ").slice(0, 5).join(" ") + "..."
            }"`}
          </text>
          <text
            x={
              xScale(data[chosenBook].price) +
              radiusScale(data[chosenBook].rating + 1)
            }
            y={yScale(data[chosenBook].reviews) + 25}
          >
            {data[chosenBook].year}
          </text>
        </>
      )}
    </svg>
  );
};

export default Scatter;
