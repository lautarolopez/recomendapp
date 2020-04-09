import React from "react";
import {
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
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
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            RecomendApp
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
