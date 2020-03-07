import React from "react";
import "./App.css";
import Reservation_Form from "./components/reservation_form";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    links: {
      flexGrow: 1,
      flexDirection: "row",
      alignContent: "end"
    },
    link: {
      color: "black",
      padding: "25px",
      font: "Roboto",
      fontSize: "20px",
      textDecoration: "none",
      "&:hover": {
        color: "grey",
        transition: "0.2s"
      }
    },
    logo: {
      color: "black",
      fontWeight: "bold",
      padding: "25px",
      font: "Roboto",
      fontSize: "20px",
      textDecoration: "none",
      "&:hover": {
        color: "grey",
        transition: "0.2s"
      }
    }
  })
);

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <Router>
      <AppBar position="static" color="inherit">
        <Toolbar variant="regular">
          <Link to="/" className={classes.logo}>
            Antoine SPRL
          </Link>
          <Link to="/calendrier" className={classes.link}>
            Calendrier
          </Link>
          <Link to="/reservation" className={classes.link}>
            Reservation
          </Link>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/reservation">
          <Reservation_Form />
        </Route>
        <Route path="/calendrier">
          <>CALENDRIER</>
        </Route>
        <Route path="/">
          <>HOME</>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
