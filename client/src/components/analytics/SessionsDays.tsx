import axios from "axios";
import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function getCurrentDate() {
  let date = new Date();
  let year = `${date.getFullYear()}-`;
  let month = date.getMonth() + 1 >= 10 ? `${date.getMonth() + 1}-` : `0${date.getMonth() + 1}-`;
  let day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
  return year + month + day;
}

function DaysDifference(date: string) {
  let todayDate = new Date();
  let newDate = new Date(date.replaceAll("-", "/"));

  if (newDate.getTime() > todayDate.getTime()) return 1; //invalid
  if (newDate.getTime() < 1601499600000) return 1; // invalid

  const diffTime = Math.abs(todayDate.getTime() - newDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export default function SessionsDays() {
  const [chart, setChart] = useState([]);
  const [offset, setOffset] = useState(1);
  const classes = useStyles();

  function changeDate(e: any) {
    setOffset(DaysDifference(e.target.value));
  }

  useEffect(() => {
    (async function fetchData() {
      const { data } = await axios.get(`http://localhost:3001/events/by-days/${offset - 1}`);
      setChart(data);
    })();
  }, [offset]);

  return (
    <>
      <form className={classes.container} noValidate>
        <TextField
          id="date"
          label="Date"
          type="date"
          defaultValue={getCurrentDate()}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={changeDate}
        />
      </form>
      <LineChart
        width={600}
        height={300}
        data={chart}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
}
