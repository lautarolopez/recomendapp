import React from "react";
import { Typography, Link } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  footer: {
    position: "relative",
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "35px",
    color: "white",
    backgroundColor: theme.palette.primary.dark,
    "& a": {
      color: "white",
      textDecoration: "none",
      fontWeight: "bolder",
    },
  },
});

function Footer(props) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <Typography component="p">
        Hecho por {<Link href="https://githob.com/lautarolopez">Lauti</Link>}.
        Toda la información es de{" "}
        {<Link href="https://themoviedb.org">TMDB</Link>}{" "}
      </Typography>
    </footer>
  );
}
export default withStyles(styles)(Footer);
