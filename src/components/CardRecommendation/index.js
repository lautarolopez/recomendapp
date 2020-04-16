import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Typography,
  Avatar,
} from "@material-ui/core";
import ReadMoreReact from "read-more-react";
import PersonIcon from "@material-ui/icons/Person";
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
  title: {
    paddingBottom: 0,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up(800)]: {
      flexDirection: "row",
      maxWidth: "450px",
    },
  },
  cardImage: {
    width: "60%",
    marginTop: "15px",
    [theme.breakpoints.up(800)]: {
      width: "35%",
      margin: "15px 0 auto 16px",
    },
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  contentContainer: {
    paddingTop: "5px",
  },
  buttons: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    aliginItems: "center",
  },
  button: {
    marginTop: "10px",
  },
  userRecommending: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

function CardRecommendation(props) {
  const { classes } = props;

  return (
    <Card variant="outlined" className={classes.card}>
      <img
        src={
          props.poster_path !== null
            ? "https://image.tmdb.org/t/p/w500" + props.poster_path
            : "https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png"
        }
        alt={props.title}
        className={classes.cardImage}
      />
      <div className={classes.cardContent}>
        <CardHeader title={props.title} className={classes.title}></CardHeader>
        <CardContent className={classes.contentContainer}>
          <ReadMoreReact
            text={props.overview}
            min={100}
            ideal={200}
            max={450}
            readMoreText={"ver más"}
          />
          <br />
          <Divider variant="middle" />
          <br />
          <section className={classes.userRecommending}>
            {props.user_poster !== "" ? (
              <Avatar
                alt="profile"
                src={props.user_poster}
                className={classes.large}
              />
            ) : (
              <Avatar>
                <PersonIcon />
              </Avatar>
            )}
            <Typography component="h1" variant="h5" align="center">
              {props.user_name}
            </Typography>
            <Typography component="p">{props.message}</Typography>
          </section>
          <CardActions className={classes.buttons}>
            <Button
              variant="outlined"
              className={classes.button}
              color="primary"
              onClick={removeFromList}
            >
              Agregar a mi lista
            </Button>
            <Button
              variant="outlined"
              className={classes.button}
              color="secondary"
              onClick={removeFromList}
            >
              Eliminar
            </Button>
          </CardActions>
        </CardContent>
      </div>
    </Card>
  );

  function removeFromList(e) {
    e.preventDefault();
    firebase.removeItemFromList(props.id);
    props.onDeleteFromView(props.id);
  }
}

export default withRouter(withStyles(styles)(CardRecommendation));
