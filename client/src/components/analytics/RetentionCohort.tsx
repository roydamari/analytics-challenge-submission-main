import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RetentionCohort.css";
import { weeklyRetentionObject } from "../../models/event";

const weekDataBlock = (week: weeklyRetentionObject) => {
  const { registrationWeek, weeklyRetention } = week;
  return weeklyRetention.map((percent, i) => {
    const returnedUserPercent = Math.round(percent);
    const redGreen = String(100 - returnedUserPercent) + "%";
    return (
      <td
        key={`week${registrationWeek}block${i}`}
        className="weekDataBlock"
        title={returnedUserPercent + "%"}
        style={{ backgroundColor: `rgb(${redGreen},${redGreen},100%)` }}
      />
    );
  });
};

const RetentionCohort = () => {
  const [weeks, setWeeks] = useState<weeklyRetentionObject[]>([]);
  useEffect(() => {
    axios.get("http://localhost:3001/events/retention?dayZero=1601499600000").then(({ data }) => {
      setWeeks(data);
    });
  }, []);

  const totalUsers = weeks.reduce((total, current) => {
    return total + current.newUsers;
  }, 0);
  function CalculateAllUsersRetention(registrationWeek: number) {
    const retentionByWeek: number[] = weeks.map((week) => {
      const { weeklyRetention } = week;
      return weeklyRetention[registrationWeek];
    });
    const trimmedArray = retentionByWeek //remove undefined values
      .filter((weeklyRetention) => typeof weeklyRetention === "number");
    return Math.round(trimmedArray.reduce((total, cur) => total + cur, 0) / trimmedArray.length);
  }

  return (
    <div className="retention-cohort">
      <h1>User Retention</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>week</th>
              {weeks.map((week) => (
                <th key={"week " + week.registrationWeek}>{`week ${week.registrationWeek}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => {
              return (
                <tr key={"week" + week.registrationWeek} className="retention-week">
                  <td>
                    {`week ${week.registrationWeek}`}
                    <br />
                    {`${week.start} ${"→"} ${week.end}`}
                  </td>
                  {weekDataBlock(week)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetentionCohort;
