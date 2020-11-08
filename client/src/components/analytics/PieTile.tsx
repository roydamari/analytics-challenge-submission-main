import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

export default function PieTile() {
  const [groupOS, setOS] = useState<{ os: string; value: number }[]>();
  const [groupURL, setURL] = useState<{ url: string; value: number }[]>();

  useEffect(() => {
    (async function fetchData() {
      const { data } = await axios.get("http://localhost:3001/events/all");
      const groupByOS = [
        { os: "ios", value: 0 },
        { os: "android", value: 0 },
        { os: "mac", value: 0 },
        { os: "linux", value: 0 },
        { os: "windows", value: 0 },
        { os: "other", value: 0 },
      ];
      const groupByURL = [
        { url: "login", value: 0 },
        { url: "signup", value: 0 },
      ];
      data.forEach((event: { os: string; url: string }) => {
        if (event.url.split("/")[3] === "login") {
          groupByURL[0].value++;
        } else {
          groupByURL[1].value++;
        }
        switch (event.os) {
          case "ios":
            groupByOS[0].value++;
            break;
          case "android":
            groupByOS[1].value++;
            break;
          case "mac":
            groupByOS[2].value++;
            break;
          case "linux":
            groupByOS[3].value++;
            break;
          case "windows":
            groupByOS[4].value++;
            break;
          case "other":
            groupByOS[5].value++;
            break;
        }
      });
      setURL(groupByURL);
      setOS(groupByOS);
    })();
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          marginBottom: "0px",
        }}
      >
        <h1>OS</h1>
        <h1>Page</h1>
      </div>
      <PieChart width={600} height={300}>
        <Pie
          label
          nameKey="os"
          data={groupOS}
          cx={140}
          cy={120}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          label
          nameKey="url"
          data={groupURL}
          cx={440}
          cy={120}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </>
  );
}
