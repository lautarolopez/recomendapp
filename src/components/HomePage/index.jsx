import React, { useEffect } from "react";
import { Typography, Paper } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../firebase";

const styles = (theme) => ({
  main: {
    width: "100%",
    backgroundImage:
      "url(https://firebasestorage.googleapis.com/v0/b/recomendap.appspot.com/o/series-netflix.jpg?alt=media&token=5b01bd73-7e7e-46fc-b302-744ce23535f5)",
  },
  paper: {
    backgroundColor: "rgba(0,0,0,0.3)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    height: "100vh",
  },
  submit: {
    marginTop: theme.spacing() * 3,
  },
  logo: {
    display: "inline",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "40px",
    height: "40px",
    padding: "0 10px",
  },
  title: {
    color: "white",
  },
  appDescription: {
    color: "white",
    textAlign: "center",
    margin: "25px auto",
  },
});

function HomePage(props) {
  const { classes } = props;

  // eslint-disable-next-line
  useEffect(() => {
    if (firebase.getCurrentUsername()) {
      props.history.replace("/perfil/" + firebase.getCurrentUserId());
    }
    // eslint-disable-next-line
  });

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h3" className={classes.title}>
          <div className={classes.logo}>R</div>
          ecomendApp
        </Typography>
        <Typography component="p" className={classes.appDescription}>
          RecomendApp es una aplicación para guardar esas películas que te
          gustaron, y compartir tu perfil cuando te pidan recomendaciones!
        </Typography>
      </Paper>
    </main>
  );
}

export default withStyles(styles)(HomePage);
