import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Interpreter } from "xstate";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Footer from "./Footer";
import NavBar from "./NavBar";
import NavDrawer from "./NavDrawer";
import { DataContext, DataEvents } from "../machines/dataMachine";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { drawerMachine } from "../machines/drawerMachine";

const useStyles = makeStyles((theme) => ({
  root: {
    margin:0,
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBarSpacer: {
    // minHeight: theme.spacing(12),
    // [theme.breakpoints.up("sm")]: {
    //   minHeight: theme.spacing(14),
    // },
    height: "10vh",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: 'scroll',
  },
  container: {
    minHeight: "77vh",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(4),
      padding: theme.spacing(4),
    },
  },
}));

interface Props {
  children: React.ReactNode;
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
  notificationsService: Interpreter<DataContext, any, DataEvents, any>;
}

const MainLayout: React.FC<Props> = ({ children, notificationsService, authService }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [drawerState, sendDrawer] = useMachine(drawerMachine);

  const aboveSmallBreakpoint = useMediaQuery(theme.breakpoints.up("sm"));
  const xsBreakpoint = useMediaQuery(theme.breakpoints.only("xs"));

  const desktopDrawerOpen = drawerState?.matches({ desktop: "closed" });
  const mobileDrawerOpen = drawerState?.matches({ mobile: "closed" });
  const toggleDesktopDrawer = () => {
    sendDrawer("TOGGLE_DESKTOP");
  };
  const toggleMobileDrawer = () => {
    sendDrawer("TOGGLE_MOBILE");
  };

  const openDesktopDrawer = (payload: any) => sendDrawer("OPEN_DESKTOP", payload);
  const closeMobileDrawer = () => sendDrawer("CLOSE_MOBILE");

  useEffect(() => {
    if (!desktopDrawerOpen && aboveSmallBreakpoint) {
      openDesktopDrawer({ aboveSmallBreakpoint });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboveSmallBreakpoint, desktopDrawerOpen]);

  return (
    <>
      <NavBar
        toggleDrawer={xsBreakpoint ? toggleMobileDrawer : toggleDesktopDrawer}
        drawerOpen={xsBreakpoint ? mobileDrawerOpen : desktopDrawerOpen}
        notificationsService={notificationsService}
      />
      <NavDrawer
        toggleDrawer={xsBreakpoint ? toggleMobileDrawer : toggleDesktopDrawer}
        drawerOpen={xsBreakpoint ? mobileDrawerOpen : desktopDrawerOpen}
        closeMobileDrawer={closeMobileDrawer}
        authService={authService}
      />
      <main className={classes.content} data-test="main">
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {children}
           </Grid>
          </Grid>
        </Container>
        {/* <footer>
      <Footer />
        </footer> */}
      </main>
    </>
  );
};

export default MainLayout;
