///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import { createEvent, getAllEvents, getSessionsByHour } from "./database";
import { Event, eventData, eventName, weeklyRetentionObject } from "../../client/src/models/event";
import {
  getAllEventsButOneByDateLimit,
  getSpecificEventsByDateLimit,
  getEventsByDateLimitGroupedBySessions,
} from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

const createDateString: (timeStamp: number) => string = function (timeStamp) {
  const date = new Date(timeStamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

router.get("/all", (req: Request, res: Response) => {
  try {
    const all = getAllEvents({});
    res.status(200).json(all);
  } catch (error) {
    console.error(error);
  }
});

router.get("/all-filtered", (req: Request, res: Response) => {
  const { sorting, type, browser, search, offset } = req.query;

  const filter = {
    sorting: sorting,
    type,
    browser,
    search,
    offset: Number(offset) || 0,
  };
  const filteredEvents = getAllEvents(filter);
  res.json(filteredEvents);
});

router.get("/by-days/:offset", (req: Request, res: Response) => {
  const offset = req.params.offset;
  const XdaysToCountBack: number = Number(offset);
  const now = new Date();
  const oneWeekAndXdaysAgo = new Date();
  const XdaysAgo = new Date();
  oneWeekAndXdaysAgo.setDate(now.getDate() - XdaysToCountBack - 6);
  oneWeekAndXdaysAgo.setHours(0, 0, 0);
  XdaysAgo.setDate(now.getDate() - XdaysToCountBack);
  XdaysAgo.setHours(24, 0, 0);

  const offsetEvents = getEventsByDateLimitGroupedBySessions(
    oneWeekAndXdaysAgo.getTime(),
    XdaysAgo.getTime()
  );

  const groupedEvents: { date: string; events: Event[] }[] = [];

  for (const sessionId in offsetEvents) {
    offsetEvents[sessionId].forEach((event: Event) => {
      let i = groupedEvents.findIndex((object) => object.date === createDateString(event.date));

      if (i !== -1) {
        groupedEvents[i].events.push(event);
      } else {
        groupedEvents.push({ date: createDateString(event.date), events: [event] });
      }
    });
  }

  const results: { date: string; count: number }[] = groupedEvents.map(
    (group: { date: string; events: Event[] }) => {
      return { date: group.date, count: group.events.length };
    }
  );

  results.sort(function (a, b) {
    if (a.date.split("/")[1] === b.date.split("/")[1]) {
      return Number(a.date.split("/")[0]) - Number(b.date.split("/")[0]);
    } else {
      return Number(a.date.split("/")[1]) - Number(b.date.split("/")[1]);
    }
  });

  res.send(results);
});

router.get("/by-hours/:offset", (req: Request, res: Response) => {
  try {
    const { offset } = req.params;
    res.json(getSessionsByHour(Number(offset)));
  } catch (error) {
    console.error(error);
  }
});

router.get("/today", (req: Request, res: Response) => {
  res.send("/today");
});

router.get("/week", (req: Request, res: Response) => {
  res.send("/week");
});

router.get("/retention", (req: Request, res: Response) => {
  const dayZero: number = Number(req.query.dayZero);
  const now = new Date();
  const dayZeroDate = new Date(dayZero);
  dayZeroDate.setHours(0, 0, 0, 0);
  const weekAfterDayZero = new Date(dayZero);
  weekAfterDayZero.setDate(weekAfterDayZero.getDate() + 6);
  weekAfterDayZero.setHours(0, 0, 0, 0);

  const results: weeklyRetentionObject[] = [];

  const milleSecondsInAWeek = 1000 * 60 * 60 * 24 * 7;
  const totalWeeksToCountFrom = Math.ceil(
    (now.getTime() - weekAfterDayZero.getTime()) / milleSecondsInAWeek
  );

  while (weekAfterDayZero.getTime() < now.getTime()) {
    let weeksPassedFromRegistration: number = Math.ceil(
      (now.getTime() - weekAfterDayZero.getTime()) / milleSecondsInAWeek
    );
    let signUpEventsThisWeek = getSpecificEventsByDateLimit(
      dayZeroDate.getTime(),
      weekAfterDayZero.getTime(),
      "name",
      "signup"
    );
    let newUsersIds: string[] = [];
    signUpEventsThisWeek.forEach((event: Event) => newUsersIds.push(event.distinct_user_id));

    let newDayZero = new Date(weekAfterDayZero);
    let newWeekAfterDayZero = new Date(weekAfterDayZero);
    newWeekAfterDayZero.setDate(weekAfterDayZero.getDate() + 7);

    const weeklyRetentionArray: number[] = [];

    while (newWeekAfterDayZero.getTime() < now.getTime()) {
      let allEventsButSignup = getAllEventsButOneByDateLimit(
        newDayZero.getTime(),
        newWeekAfterDayZero.getTime(),
        "name",
        "sigunp"
      );
      let userIdsWhoCameBack: string[] = [];

      allEventsButSignup.forEach((event: Event) => {
        if (!userIdsWhoCameBack.includes(event.distinct_user_id))
          userIdsWhoCameBack.push(event.distinct_user_id);
      });

      let cameBackPercentages = Number(
        ((newUsersIds.length * 100) / userIdsWhoCameBack.length).toFixed(0)
      );
      weeklyRetentionArray.push(cameBackPercentages);

      newDayZero.setDate(newDayZero.getDate() + 7);
      newWeekAfterDayZero.setDate(newWeekAfterDayZero.getDate() + 6);
    }

    results.push({
      registrationWeek: totalWeeksToCountFrom - weeksPassedFromRegistration + 1,
      newUsers: signUpEventsThisWeek.length,
      weeklyRetention: [100, ...weeklyRetentionArray],
      start: createDateString(dayZeroDate.getTime()),
      end: createDateString(weekAfterDayZero.getTime()),
    });

    dayZeroDate.setDate(dayZeroDate.getDate() + 7);
    weekAfterDayZero.setDate(weekAfterDayZero.getDate() + 7);
  }

  res.send(results);
});

router.get("/:eventId", (req: Request, res: Response) => {
  res.send("/:eventId");
});

router.post("/", (req: Request, res: Response) => {
  const eventData: eventData = req.body;
  createEvent(eventData);
  res.status(200).send("");
});

router.get("/chart/os/:time", (req: Request, res: Response) => {
  res.send("/chart/os/:time");
});

router.get("/chart/pageview/:time", (req: Request, res: Response) => {
  res.send("/chart/pageview/:time");
});

router.get("/chart/timeonurl/:time", (req: Request, res: Response) => {
  res.send("/chart/timeonurl/:time");
});

router.get("/chart/geolocation/:time", (req: Request, res: Response) => {
  res.send("/chart/geolocation/:time");
});

export default router;
