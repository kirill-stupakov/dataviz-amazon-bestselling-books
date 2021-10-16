import React, { useState, useEffect } from "react";
import { csv } from "d3";

import Chart from "./components/Chart/Chart";
import "./App.scss";

type data = {
  author: string;
  genre: string;
  name: string;
  price: number;
  reviews: number;
  rating: number;
  year: number;
}[];

function App() {
  const [data, setData] = useState<data | null>(null);
  const datasetUrl =
    "https://gist.githubusercontent.com/kirill-stupakov/66c89bf52d9d2eb67ad4820d29e8dd75/raw/bestsellers_with_categories.csv";

  useEffect(() => {
    csv(datasetUrl)
      .then((res) =>
        res.map((entry) => ({
          author: entry.Author!,
          genre: entry.Genre!,
          name: entry.Name!,
          price: +entry.Price!,
          reviews: +entry.Reviews!,
          rating: +entry["User Rating"]!,
          year: +entry.Year!,
        }))
      )
      // @ts-ignore
      .then(setData);
  }, []);

  return <div className="App">{data && <Chart data={data}></Chart>}</div>;
}

export default App;
