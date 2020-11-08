import axios from "axios";
import React, { useEffect, useState } from "react";
import { Event } from "../../models/event";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const colorPicker = {
  login: "#ccc",
  admin: "#ddd",
  signup: "#eee",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function LogTile() {
  const [events, setEvents] = useState<Event[]>([]);
  const [listEvents, setList] = useState<Event[]>([]);
  const [count, setCount] = useState<number>(10);
  const [type, setType] = useState<string>("");
  const [browser, setBrowser] = useState<string>("");

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>, which: string) => {
    if (which === "type") {
      setType(event.target.value as string);
    } else {
      setBrowser(event.target.value as string);
    }
  };

  useEffect(() => {
    let selectBrowser: string = "";
    switch (Number(browser)) {
      case 10:
        selectBrowser = "safari";
        break;
      case 20:
        selectBrowser = "chrome";
        break;
      case 30:
        selectBrowser = "edge";
        break;
      case 40:
        selectBrowser = "firefox";
        break;
      case 50:
        selectBrowser = "ie";
        break;
      case 60:
        selectBrowser = "other";
        break;
      default:
        break;
    }
    let selectType: string = "";
    switch (Number(type)) {
      case 10:
        selectType = "admin";
        break;
      case 20:
        selectType = "login";
        break;
      case 30:
        selectType = "signup";
        break;
    }

    setCount(10);
    setList(
      events.filter((event) => {
        if (selectType && selectBrowser) {
          if (event.browser === selectBrowser && event.name === selectType) return event;
        } else if (selectType) {
          if (event.name === selectType) return event;
        } else {
          if (event.browser === selectBrowser) return event;
        }
        if (!selectType && !selectBrowser) return event;
      })
    );
  }, [browser, type]);

  useEffect(() => {
    (async function fetchData() {
      const { data } = await axios.get("http://localhost:3001/events/all");
      setEvents(data);
      setList(data);
    })();
  }, []);

  function LoadMore(e: any) {
    if (e.currentTarget.clientHeight + e.currentTarget.scrollTop === e.currentTarget.scrollHeight) {
      setCount((prevCount) => prevCount + 10);
    }
  }

  return (
    <div
      className={classes.root}
      style={{ overflowY: "auto", height: "100%", width: "800px" }}
      onScroll={LoadMore}
    >
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          onChange={(e) => handleChangeSelect(e, "type")}
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={10}>Admin</MenuItem>
          <MenuItem value={20}>Login</MenuItem>
          <MenuItem value={30}>Signup</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Browser</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={browser}
          onChange={(e) => handleChangeSelect(e, "browser")}
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={10}>Safari</MenuItem>
          <MenuItem value={20}>Chrome</MenuItem>
          <MenuItem value={30}>Edge</MenuItem>
          <MenuItem value={40}>Firefox</MenuItem>
          <MenuItem value={50}>IE</MenuItem>
          <MenuItem value={60}>Other</MenuItem>
        </Select>
      </FormControl>
      {listEvents.slice(0, count).map((event) => {
        let color = "#5f3";
        if (event.name === "signup") color = "#444";
        if (event.name === "admin") color = "#ddd";
        return (
          <Accordion
            key={event._id + event.date}
            expanded={expanded === `panel${event._id + event.date}`}
            onChange={handleChange(`panel${event._id + event.date}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <span
                style={{
                  height: "25px",
                  width: "25px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: "inline-block",
                  marginRight: "10px",
                }}
              ></span>
              <Typography className={classes.heading}>{event.name}</Typography>
              <Typography className={classes.secondaryHeading}>
                User {event.distinct_user_id}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {Object.keys(event).map((prop) => {
                  if (prop === "geolocation") {
                    return (
                      <span key={prop}>
                        <strong>location:</strong>
                        <br />
                        <span>
                          <strong>lat:</strong> {event.geolocation.location.lat}
                          <br />
                        </span>
                        <span>
                          <strong>lng:</strong> {event.geolocation.location.lng}
                          <br />
                        </span>
                        <span>
                          <strong>accuracy:</strong> {event.geolocation.accuracy}
                          <br />
                        </span>
                      </span>
                    );
                  } else if (prop === "date") {
                    return (
                      <span key={prop}>
                        <strong>{prop} :</strong> {new Date(event[prop]).toLocaleDateString()}
                        <br />
                      </span>
                    );
                  }
                  return (
                    <span key={prop}>
                      <strong>{prop} :</strong> {event[prop]}
                      <br />
                    </span>
                  );
                })}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
