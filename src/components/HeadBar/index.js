import React from "react";
import { Typography, Button, AppBar, Toolbar } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  logo: {
    display: "inline",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    border: "solid 1px white",
    width: "20px",
    height: "40px",
    padding: "0 3px",
  },
  title: {
    color: "white",
  },
});

function HeadBar(props) {
  const { classes } = props;

  async function logout() {
    await firebase.logout();
    props.history.push("/");
  }

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar className={classes.container}>
          <Typography variant="h6" className={classes.title}>
            <div className={classes.logo}>R</div>
            ecomendApp
          </Typography>
          {props.isUserLoggedIn ? (
            <Button
              color="inherit"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/login");
              }}
            >
              Ingresar
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(withStyles(styles)(HeadBar));
