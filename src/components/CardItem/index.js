import React from "react";
import "./styles.css";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing() * 3,
    marginRight: theme.spacing() * 3,
    [theme.breakpoints.up(400 + theme.spacing() * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
});

function CardItem(props) {
  const { classes } = props;
  return (
    <Card variant="outlined" className={classes.card}>
      <CardHeader title={props.title}> </CardHeader>
      <CardContent>
        <Typography variant="body2" component="p">
          {props.overview}
        </Typography>
        <img
          src={
            props.poster_path !== null
              ? "https://image.tmdb.org/t/p/w500" + props.poster_path
              : "https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png"
          }
          alt={props.title}
        />
        <CardActions>
          {props.isUserLoggedIn ? (
            <Button onClick={removeFromList}>Quitar de mi lista</Button>
          ) : (
            <Button>Agregar a mi lista</Button>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );

  function removeFromList(e) {
    e.preventDefault();
    firebase.removeItemFromList(props.id);
    props.onDeleteFromView(props.id);
  }
}

export default withRouter(withStyles(styles)(CardItem));
